import { body } from 'express-validator';
import { IService } from '../models/invoice';

export const invoiceValidator = [
  body('date').exists().withMessage('Date must be provided'),
  body('date').isDate().withMessage('Invalid date format'),
  body('invoiceNumber').exists().withMessage('Invoice number must be provided'),
  body('invoiceNumber')
    .isString()
    .withMessage('Invoice number must be a string'),
  body('services').exists().withMessage('Services can not be 0'),
  body('services')
    .isArray({ min: 1 })
    .withMessage('Services must be in Array with at least 1 item')
    .custom((services:IService[]) => {
        for (const service of services) {
            if(
                !service.title ||
                !service.quantity ||
                !service.price ||
                !service.totalPrice ||
                typeof service.title !== 'string' ||
                typeof service.quantity !== 'number' ||
                typeof service.price !== 'number' ||
                typeof service.totalPrice !== 'number'
                ){
                    throw new Error('Invalid service object')
                }
        }
        return true
    }),
body('totalPrice').exists().withMessage('Total invoice price must be provided'),
body('totalPrice').isNumeric().withMessage('Total price mus be a numeric value')
];
