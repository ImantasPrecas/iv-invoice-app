import { body } from 'express-validator';
import { UserModel } from '../models/user-model';

const userBase = [
  body('firstname').trim().exists().withMessage('First name must be provided!'),
  body('firstname')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters!'),
  body('lastname').trim().exists().withMessage('Last name must be provided!'),
  body('lastname')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Last name must be at least 3 characters!'),
  body('email').exists().withMessage('Email name must be provided!'),
];

export const userValidator = [
  ...userBase,
  body('email')
    .isEmail()
    .withMessage('Email must be correct format!')
    .custom((value, { req }) => {
      return UserModel.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject('E-mail address already exists!');
        }
      });
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .exists()
    .not()
    .isEmpty()
    .withMessage('Password must be provided!'),
];

// export const userValidator = [
//   body('firstname').trim().exists().withMessage('First name must be provided!'),
//   body('firstname')
//     .trim()
//     .isLength({ min: 3 })
//     .withMessage('Name must be at least 3 characters!'),
//   body('lastname').trim().exists().withMessage('Last name must be provided!'),
//   body('lastname')
//     .trim()
//     .isLength({ min: 3 })
//     .withMessage('Last name must be at least 3 characters!'),
//   body('email').exists().withMessage('Email name must be provided!'),
//   body('email')
//     .isEmail()
//     .withMessage('Email must be correct format!')
//     .custom((value, { req }) => {
//       return UserModel.findOne({ email: value }).then((userDoc) => {
//         if (userDoc) {
//           return Promise.reject('E-mail address already exists!');
//         }
//       });
//     })
//     .normalizeEmail(),
//   body('password')
//     .trim()
//     .exists()
//     .not()
//     .isEmpty()
//     .withMessage('Password must be provided!'),
// ];

export const userLoginValidator = [
  body('email').exists().withMessage('Email name must be provided!'),
  body('email').isEmail().withMessage('Email must be correct format!'),
  body('password')
    .trim()
    .exists()
    .not()
    .isEmpty()
    .withMessage('Password must be provided!'),
];

export const userUpdateValidatos = [
  ...userBase,
  body('iaRegistration')
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
    .withMessage('Address must be provided!'),
  body('bankAccount')
    .trim()
    .exists()
    .not()
    .isEmpty()
    .withMessage('Bank account must be provided!'),
  body('bankName')
    .trim()
    .exists()
    .not()
    .isEmpty()
    .withMessage('Bank name must be provided!'),
];
