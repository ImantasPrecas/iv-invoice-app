import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { newError } from '../utils/generateError';

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

export default { register, login };
