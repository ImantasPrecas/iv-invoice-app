import { NextFunction, Response } from 'express';
import { IAuthenticatedRequest } from '../middleware/is-auth';
import { validationResult } from 'express-validator';
import { newError } from '../utils/generateError';
import { ClientModel } from '../models/client';
import { UserModel } from '../models/user';

async function createClient(
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
  const user = await UserModel.findById(req.userId);

  // Check if client is already in DB
  const existingCilent = await ClientModel.findOne({
    registration: req.body.registration,
  });

  if (existingCilent && user) {
    //Check if client already have user asigned
    const isUser = existingCilent.users.find(
      (user) => user._id.toString() === req.userId
    );

    if (isUser) {
      return next(
        newError('This client already exists', 409, {
          registration: req.body.registration,
        })
      );
    }
    
    existingCilent.users = existingCilent.users || [];
    existingCilent.users.push(user._id);
    await existingCilent.save();

    res.status(200).json({ message: 'User added to client' });
  } else {
    let client;
    const newclient = new ClientModel({
      users: req.userId,
      name: req.body.name,
      address: req.body.address,
      registration: req.body.registration,
      bankAccount: req.body.bankAccount,
      bankName: req.body.bankName,
      vat: req?.body?.vat || null,
      phone: req?.body?.phone || null,
      email: req?.body?.email || null,
      additionalInfo: req?.body?.additionalInfo || null,
    });

    client = newclient;

    try {
      await client.save();

      const user = await UserModel.findById(req.userId);
      if (user) {
        user.clients = user.clients || [];
      }

      res
        .status(200)
        .json({ message: 'Client created!', clientId: client._id });
    } catch (err: any) {
      if (!err.statusCode) err.statusCode === 500;
      next(err);
    }
  }
}

export default { createClient };
