import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import { InvoiceModel } from '../models/invoice-model'
import { newError } from '../utils/generateError'
import { UserModel } from '../models/user-model'
import { Types } from 'mongoose'

export interface IAuthenticatedRequest extends Request {
    userId?: string
}

async function getInvoices(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const currentPage = req.query.page || 1
    const perPage = req.query.limit || 10
    let totalItems

    try {
        totalItems = await InvoiceModel.find({
            createdBy: req.userId,
        }).countDocuments()

        const invoices = await InvoiceModel.find({ createdBy: req.userId })
            .skip((+currentPage - 1) * +perPage)
            .limit(+perPage)
        if (!invoices) {
            const error = newError('Could not find invoices!', 422)
            throw error
        }
        res.status(200).json({ invoices, totalItems })
    } catch (err) {
        next(err)
    }
}

async function createInvoice(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(
            newError(
                'Validation failed, entered data is incorrect!',
                422,
                errors.array()
            )
        )
    }

    const newInvoice = new InvoiceModel({
        client: req.body.client,
        createdBy: req.userId,
        date: req.body.date,
        invoiceNumber: req.body.invoiceNumber,
        assets: req.body.assets,
        totalPrice: req.body.totalPrice,
    })

    try {
        const invoice = await newInvoice.save()

        const user = await UserModel.findById(req.userId)
        if (user) {
            user.invoices = user.invoices || []
            user.invoices.push(newInvoice._id)
            await user?.save()
        }

        res.status(201).json({
            message: 'Success',
            user: user?._id,
            invoice: invoice,
        })
    } catch (err) {
        next(err)
    }
}

async function getInvoice(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const invoiceId = req.params.invoiceId
    try {
        const invoice = await InvoiceModel.findById(invoiceId)
        if (!invoice) {
            return next(newError('Could not find invoice!!!!', 404))
        }
        if (invoice.createdBy.toString() !== req.userId) {
            throw next(newError('Unauthorized', 403))
        }
        res.status(200).json({ invoice })
    } catch (err) {
        next(err)
    }
}

async function updateInvoice(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(
            newError(
                'Validation failed, entered data is incorrect!',
                422,
                errors.array()
            )
        )
    }

    const invoiceId = req.params.invoiceId
    try {
        const invoice = await InvoiceModel.findById(invoiceId)
        if (!invoice) {
            return next(newError('Could not find invoice!!!!', 404))
        }

        if (invoice.createdBy.toString() !== req.userId) {
            throw next(newError('Unauthorized', 403))
        }

        if (invoice) {
            invoice.date = req.body.date
            invoice.invoiceNumber = req.body.invoiceNumber // Check if this number don't clash with other invoices numbers. It must be unique
            invoice.assets = req.body.assets
            invoice.totalPrice = req.body.totalPrice

            const updatedInvoice = await invoice.save()
            res.status(200).json({ updatedInvoice })
        }
    } catch (err) {
        next(err)
    }
}

async function deleteInvoice(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const invoiceId = req.params.invoiceId

    try {
        const invoice = await InvoiceModel.findById(invoiceId)
        // Check logged in user
        if (!invoice) {
            return next(newError('Could not find invoice!!!!', 404))
        }
        if (invoice.createdBy.toString() !== req.userId) {
            throw next(newError('Unauthorized', 403))
        }
        await InvoiceModel.findByIdAndDelete(invoiceId)

        const user = await UserModel.findById(req.userId)

        if (user) {
            const userInvoices =
                user.invoices as Types.DocumentArray<Types.ObjectId>
            userInvoices.pull(invoiceId)
            await user.save()
        }
        res.status(200).json({ message: 'Successfully deleted' })
    } catch (err) {
        next(err)
    }
}

export default {
    getInvoices,
    createInvoice,
    getInvoice,
    updateInvoice,
    deleteInvoice,
}
