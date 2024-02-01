import { Request, Response } from 'express';
import { IInvoice } from '../models/invoice';
import { validationResult } from 'express-validator';

// const invoices:IInvoice[] = [
//   {
    
//     // userId: 1,
//     // customer: 1,
//     date: new Date(),
//     invoiceNumber: '123',
//     services: [
//       {
//         title: 'Service 1',
//         quantity: 1,
//         price: 12,
//         totalPrice: 12,
//       },
//       {
//         title: 'Service 2',
//         quantity: 1,
//         price: 12,
//         totalPrice: 12,
//       },
//     ],
//     totalPrice: 24,
//   },
// ];

function getInvoices(req: Request, res: Response) {
  // res.status(200).json({ invoices });
}

function postInvoice(req: Request, res: Response) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({message: 'Creating or editing invoice failed!',errors: errors.array()})
    }

  // const newInvoice: IInvoice = {
  //   // userId: 1,
  //   // _id: new Date().toISOString(),
  //   // customer: 1,
  //   date: req.body.date || new Date().toISOString(),
  //   invoiceNumber: (invoices.length + 1).toString(),
  //   services: req.body.services,
  //   totalPrice: req.body.totalPrice,
  // };

  // invoices.push(newInvoice)
  // res.status(201).json({invoice: newInvoice});
}

export default { getInvoices, postInvoice };
