import { body } from 'express-validator';

export const clientValidator = [
  body('name')
    .trim()
    .exists()
    .not()
    .isEmpty()
    .withMessage('Individual activity registration number must be provided!'),
  body('address')
    .trim()
    .exists()
    .not()
    .isEmpty()
    .withMessage('Individual activity registration number must be provided!'),
  body('registration')
    .trim()
    .exists()
    .not()
    .isEmpty()
    .withMessage('Individual activity registration number must be provided!'),
  // body('bankName')
  //   .trim()
  //   .exists()
  //   .not()
  //   .isEmpty()
  //   .withMessage('Individual activity registration number must be provided!'),

];
