import { Request, Response } from 'express';
import { Invoice } from '../models/invoice';

const invoices:Invoice[] = [
  {
    _id: '1',
    userId: 1,
    customerId: 1,
    date: new Date().toISOString(),
    invoiceNumber: '123',
    services: [
      {
        title: 'Service 1',
        quantity: 1,
        price: 12,
        totalPrice: 12,
      },
      {
        title: 'Service 2',
        quantity: 1,
        price: 12,
        totalPrice: 12,
      },
    ],
    totalPrice: 24,
  },
];

function getInvoices(req: Request, res: Response) {
  res.status(200).json({ invoices });
}

function postInvoice(req: Request, res: Response) {
  const newInvoice: Invoice = {
    userId: 1,
    _id: new Date().toISOString(),
    customerId: 1,
    date: req.body.date || new Date().toISOString(),
    invoiceNumber: (invoices.length + 1).toString(),
    services: req.body.services,
    totalPrice: req.body.totalPrice,
  };

  invoices.push(newInvoice)
  res.status(201).json({invoice: newInvoice});
}

export default { getInvoices, postInvoice };
