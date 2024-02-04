import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

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
    const error = new Error('Not authenticated!') as any;
    error.statusCode = 401;
    return next(error);
  }
  const token = req.get('Authorization')?.split(' ')[1] || '';
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_KEY) as { userId: string };
  } catch (err: any) {
    const error = new Error('Not Authenticated') as any
    error.statusCode = 500;
    error.data = err.message
    return next(error);
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated!') as any;
    error.statusCode = 401;
    return next(error);
  }

  req.userId = decodedToken.userId;
  next();
}
