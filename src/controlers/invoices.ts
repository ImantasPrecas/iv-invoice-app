import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { InvoiceModel } from '../models/invoice';

async function getInvoices(req: Request, res: Response, next: NextFunction) {
  const currentPage = req.query.page || 1
  const perPage = req.query.limit || 10
  let totalItems
  
  try {
    const totalItems = await InvoiceModel.find().countDocuments()

    console.log(totalItems)

    const invoices = await InvoiceModel.find().skip((+currentPage -1) * +perPage).limit(+perPage);
    if (!invoices) {
      res.status(404).json({ message: 'Could not find invoices!!!!' });
    }
    res.status(200).json({ invoices, totalItems });
  } catch (err) {
    next(err);
  }
}

async function createInvoice(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = {
      message: 'Validation failed, entered data is incorrect!',
      error: errors.array(),
    } as any;
    res.status(422).json({ error });
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
      res.status(404).json({ message: 'Could not find invoice!!!!' });
    }
    res.status(200).json({ invoice });
  } catch (err) {
    next(err);
  }
}

async function updateInvoice(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = {
      message: 'Validation failed, entered data is incorrect!',
      error: errors.array(),
    } as any;
    error.statusCode = 422;
    res.status(422).json({ error });
  }

  const invoiceId = req.params.invoiceId;
  try {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) {
      res.status(404).json({ message: 'Could not find invoice!!!!' });
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

      res.status(404).json({ message: 'Could not find this invoice!' });
    }
  } catch (err) {
    next(err);
  }
  try {
    const deletedInvoice = await InvoiceModel.findByIdAndDelete(invoiceId);
    res
      .status(200)
      .json({ message: 'Successfuly deleted' });
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
