import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { InvoiceModel } from '../models/invoice';

function getInvoices(req: Request, res: Response) {
  // res.status(200).json({ invoices });
}

function createInvoice(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = {message:'Validation failed, entered data is incorrect!', error: errors.array()} as any;
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
      res.status(201).json({ invoice: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export default { getInvoices, createInvoice };
