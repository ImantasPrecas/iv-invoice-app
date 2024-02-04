import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { newError } from '../utils/generateError';

export interface IAuthenticatedRequest extends Request {
  userId?: string;
}

const JWT_KEY = process.env.JWT_KEY || '';

export default function (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const headers = req.headers;
  if (!headers.authorization) {
    return next(newError('Not authenticated!', 401));
  }
  const token = req.get('Authorization')?.split(' ')[1] || '';
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_KEY) as { userId: string };
  } catch (err: any) {
    return next(newError('Not Authenticated', 401, err.message));
  }
  if (!decodedToken) {
    return next(newError('Not Authenticated', 401));
  }

  req.userId = decodedToken.userId;
  next();
}
