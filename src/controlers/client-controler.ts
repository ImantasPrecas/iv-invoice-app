import { NextFunction, Response } from 'express'
import { IAuthenticatedRequest } from '../middleware/is-auth'
import { validationResult } from 'express-validator'
import { newError } from '../utils/generateError'
import { ClientModel } from '../models/client-model'
import { UserModel } from '../models/user-model'

async function createClient(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const errors = validationResult(req)
    let client
    if (!errors.isEmpty()) {
        return next(
            newError(
                'Validation failed, entered data is incorrect!',
                422,
                errors.array()
            )
        )
    }
    let user
    let existingCilent
    try {
        user = await UserModel.findById(req.userId)
        existingCilent = await ClientModel.findOne({
            registration: req.body.registration,
        })
    } catch (err: any) {
        if (!err.statusCode) err.statusCode === 500
        next(err)
    }

    if (existingCilent && user) {
        const isUserId = existingCilent.users.find(
            (user) => user._id.toString() === req.userId
        )

        if (isUserId) {
            return next(
                newError('This client already exists', 409, {
                    registration: req.body.registration,
                })
            )
        }

        existingCilent.users = existingCilent.users || []
        existingCilent.users.push(user._id)
        try {
            await existingCilent.save()
        } catch (err: any) {
            if (!err.statusCode) err.statusCode === 500
            next(err)
        }

        res.status(200).json({ message: 'User added to client' })
    } else {
        const newclient = new ClientModel({
            users: req.userId,
            name: req.body.name,
            address: req.body.address,
            registration: req.body.registration,
            bankAccount: req.body.bankAccount,
            bankName: req.body.bankName,
            vat: req?.body?.vat || null,
            phone: req?.body?.phone || null,
            email: req?.body?.email || null,
            additionalInfo: req?.body?.additionalInfo || null,
        })

        client = newclient

        try {
            await client.save()

            const user = await UserModel.findById(req.userId)
            if (user) {
                user.clients = user.clients || []
                user.clients.push(client._id)
                await user.save()
            }

            res.status(200).json({
                message: 'Client created!',
                clientId: client._id,
            })
        } catch (err: any) {
            if (!err.statusCode) err.statusCode === 500
            next(err)
        }
    }
}

async function updateClient(req: IAuthenticatedRequest, res: Response) {
    res.json({ ok: 'ok' })
}

async function getClient(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const clientId = req.params.clientId

    try {
        const client = await ClientModel.findById(clientId)
        if (!client) {
            return next(newError('Could not find Client', 404))
        }
        res.status(200).json({
            id: client._id,
            name: client.name,
            address: client.address,
            registration: client.registration,
            bankName: client.bankName || null,
            bankAccount: client.bankAccount || null,
            vat: client.vat || null,
            phone: client.phone || null,
            email: client.email || null,
            additionalInfo: client.additionalInfo || null,
        })
    } catch (err: any) {
        if (!err.statusCode) err.statusCode === 500
        next(err)
    }
}

// async function getUsersClients(
//   req: IAuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   const userId = req.userId;

//   try {
//     const user = await UserModel.findById(userId)
//       .populate({
//         path: 'clients',
//         select:
//           'name address registration bankAccount bankName vat phone email additionalInfo myfield',
//       })
//       .exec();
//     if (!user) {
//       return next(newError('No user found', 404));
//     }
//     const clients = user.clients;

//     res.status(200).json(clients);
//   } catch (err: any) {
//     if (!err.statusCode) err.statusCode === 500;
//     next(err);
//   }
// }

export default { createClient, getClient, updateClient }
