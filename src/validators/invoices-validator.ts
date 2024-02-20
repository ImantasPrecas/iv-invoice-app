import { body } from 'express-validator'
import { IAssets } from '../models/invoice-model'

export const invoiceValidator = [
    body('date').exists().withMessage('Date must be provided'),
    body('date').isDate().withMessage('Invalid date format'),
    body('invoiceNumber')
        .exists()
        .withMessage('Invoice number must be provided'),
    body('invoiceNumber')
        .isString()
        .withMessage('Invoice number must be a string'),
    body('assets').exists().withMessage('Assets can not be 0'),
    body('assets')
        .isArray({ min: 1 })
        .withMessage('Assets must be in Array with at least 1 item')
        .custom((assets: IAssets[]) => {
            for (const asset of assets) {
                if (
                    !asset.title ||
                    !asset.quantity ||
                    !asset.price ||
                    !asset.totalPrice ||
                    typeof asset.title !== 'string' ||
                    typeof asset.quantity !== 'number' ||
                    typeof asset.price !== 'number' ||
                    typeof asset.totalPrice !== 'number'
                ) {
                    throw new Error('Invalid asset object')
                }
            }
            return true
        }),
    body('totalPrice')
        .exists()
        .withMessage('Total invoice price must be provided'),
    body('totalPrice')
        .isNumeric()
        .withMessage('Total price mus be a numeric value'),
]
