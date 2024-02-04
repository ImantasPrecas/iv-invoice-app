import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { InvoiceModel } from '../models/invoice';

async function getInvoices(req: Request, res: Response, next: NextFunction) {
  const currentPage = req.query.page || 1;
  const perPage = req.query.limit || 10;
  let totalItems;

  try {
     totalItems = await InvoiceModel.find().countDocuments();

    const invoices = await InvoiceModel.find()
      .skip((+currentPage - 1) * +perPage)
      .limit(+perPage);
    if (!invoices) {
      const error = new Error('Could not find invoices!') as any;
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ invoices, totalItems });
  } catch (err) {
    next(err);
  }
}

async function createInvoice(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      'Validation failed, entered data is incorrect!'
    ) as any;
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const newInvoice = new InvoiceModel({
    // customer: req.body.customer,
    date: req.body.date,
    invoiceNumber: req.body.invoiceNumber,
    services: req.body.services,
    totalPrice: req.body.totalPrice,
  });

  try {
    const invoice = await newInvoice.save();
    console.log('Invoice created');
    res.status(201).json({ invoice });
  } catch (err) {
    next(err);
  }
}

async function getInvoice(req: Request, res: Response, next: NextFunction) {
  const invoiceId = req.params.invoiceId;
  try {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) {
      const error = new Error('Could not find invoice!!!!') as any;
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ invoice });
  } catch (err) {
    next(err);
  }
}

async function updateInvoice(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      'Validation failed, entered data is incorrect!'
    ) as any;
    error.statusCode = 422;
    error.data = errors.array();
    console.log('Before next');
    return next(error);
  }

  const invoiceId = req.params.invoiceId;
  try {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) {
      const error = new Error('Could not find invoice!!!!') as any;
      error.statusCode = 404;
      return next(error);
    }

    if (invoice) {
      invoice.date = req.body.date;
      invoice.invoiceNumber = req.body.invoiceNumber; // Check if this number dont clash with other invoices numbers. It must be unique
      invoice.services = req.body.services;
      invoice.totalPrice = req.body.totalPrice;

      try {
        const updatedInvoice = await invoice.save();
        res.status(200).json({ updatedInvoice });
      } catch (err) {
        throw err;
      }
    }
  } catch (err) {
    next(err);
  }
}

async function deleteInvoice(req: Request, res: Response, next: NextFunction) {
  const invoiceId = req.params.invoiceId;

  try {
    const invoice = await InvoiceModel.findById(invoiceId);
    // Check logged in user
    if (!invoice) {
      const error = new Error('Could not find invoice!!!!') as any;
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    next(err);
  }
  try {
    const deletedInvoice = await InvoiceModel.findByIdAndDelete(invoiceId);
    res.status(200).json({ message: 'Successfuly deleted' });
  } catch (err) {
    next(err);
  }
}

export default {
  getInvoices,
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
};
