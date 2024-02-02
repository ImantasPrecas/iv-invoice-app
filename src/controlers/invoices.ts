import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { InvoiceModel } from '../models/invoice';

function getInvoices(req: Request, res: Response, next: NextFunction) {
  InvoiceModel.find()
    .then((result) => {
      if(!result) {
        const error = new Error('Could not find any invoices') as any
        error.statusCode = 404
        throw error
      }
      res.status(200).json({ result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

function createInvoice(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = {
      message: 'Validation failed, entered data is incorrect!',
      error: errors.array(),
    } as any;
    error.statusCode = 422;
    throw error;
  }

  const newInvoice = new InvoiceModel({
    // customer: req.body.customer,
    date: req.body.date,
    invoiceNumber: req.body.invoiceNumber,
    services: req.body.services,
    totalPrice: req.body.totalPrice,
  });
  newInvoice
    .save()
    .then((result) => {
      console.log('Invoice created');
      res.status(201).json({ invoice: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

function getInvoice(req: Request, res: Response, next: NextFunction) {
  const invoiceId = req.params.invoiceId;
  InvoiceModel.findById(invoiceId)
    .then((invoice) => {
      if(!invoice) {
        const error = new Error('Could not find invoice') as any
        error.statusCode = 404
        throw error
      }
      console.log('Found an invoice')
      res.status(200).json({ invoice });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      // console.log(err)
      next(error);
    });
}

export default { getInvoices, createInvoice, getInvoice };
