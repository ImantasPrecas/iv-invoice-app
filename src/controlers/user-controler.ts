import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user-model';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { newError } from '../utils/generateError';
import { IAuthenticatedRequest } from '../middleware/is-auth';

async function register(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      newError(
        'Validation failed, entered data is incorrect!',
        422,
        errors.array()
      )
    );
  }

  let newUser;
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    newUser = new UserModel({
      firstname: req.body.firstname,
      lastname: req.body.firstname,
      email: req.body.email,
      password: hashedPassword,
    });
  } catch (err: any) {
    if (!err.statusCode) err.statusCode === 500;
    next(err);
  }

  try {
    const user = await newUser?.save();
    console.log('User Created!');
    res.status(201).json({ message: 'User created!', userId: user?._id });
  } catch (err: any) {
    if (!err.statusCode) err.statusCode === 500;
    next(err);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      newError(
        'Validation failed, entered data is incorrect!',
        422,
        errors.array()
      )
    );
  }

  let user;
  try {
    user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      const error = newError('Cant find user with this email!', 401);
      throw error;
    }
    try {
      const isEqual = await bcrypt.compare(req.body.password, user.password);
      if (!isEqual) {
        const error = newError(
          'Validation failed, entered password is incorrect!',
          401
        );
        throw error;
      }

      // send webToken
      const JWT_KEY = process.env.JWT_KEY || '';
      const token = jwt.sign(
        {
          email: user.email,
          password: user.password,
          userId: user._id.toString(),
        },
        JWT_KEY,
        { expiresIn: '1h' }
      );
      res.status(200).json({ userId: user._id.toString(), token: token });
    } catch (error) {
      throw error;
    }
  } catch (err: any) {
    if (!err.statusCode) err.statusCode === 500;
    next(err);
  }
}

async function getUser(
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.userId;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw next(newError('Cant find user', 404));
    }

    res.status(200).json({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      iaRegistration: user.iaRegistration || '',
      address: user.address || '',
      bankAccount: user.bankAccount || '',
      bankName: user.bankName || '',
    });
  } catch (err: any) {
    if (!err.statusCode) err.statusCode === 500;
    next(err);
  }
}

async function update(
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      newError(
        'Validation failed, entered data is incorrect!',
        422,
        errors.array()
      )
    );
  }

  const userId = req.userId;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return next(newError('Cant find user', 404));
    }

    const existingEmail = await UserModel.findOne({email: req.body.email})    

    if(existingEmail) {
      return next(newError('Email already taken', 409))
    }

    const firstname =
      req.body.firstname !== '' || undefined
        ? req.body.firstname
        : user.firstname;
    const lastname =
      req.body.lastname !== '' || undefined ? req.body.lastname : user.lastname;
    const email =
      req.body.email !== '' || undefined ? req.body.email : user.email;
    const iaRegistration =
      req.body.iaRegistration !== '' || undefined
        ? req.body.iaRegistration
        : user.iaRegistration;
    const address =
      req.body.address !== '' || undefined ? req.body.address : user.address;
    const bankAccount =
      req.body.bankAccount !== '' || undefined
        ? req.body.bankAccount
        : user.bankAccount;
    const bankName =
      req.body.bankName !== '' || undefined ? req.body.bankName : user.bankName;

    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.iaRegistration = iaRegistration;
    user.address = address;
    user.bankAccount = bankAccount;
    user.bankName = bankName;

    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: 'User updated successfuly', user: updatedUser._id });
  } catch (err: any) {
    if (!err.statusCode) err.statusCode === 500;
    next(err);
  }
}

async function getClients(
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.userId;

  try {
    const user = await UserModel.findById(userId)
      .populate({
        path: 'clients',
        select:
          'name address registration bankAccount bankName vat phone email additionalInfo myfield',
      })
      .exec();
    if (!user) {
      return next(newError('No user found', 404));
    }
    const clients = user.clients;

    res.status(200).json(clients);
  } catch (err: any) {
    if (!err.statusCode) err.statusCode === 500;
    next(err);
  }
}

export default { register, login, getUser, update, getClients };
