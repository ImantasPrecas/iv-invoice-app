import { NextFunction, Response } from 'express';
import { IAuthenticatedRequest } from '../middleware/is-auth';
import { validationResult } from 'express-validator';
import { newError } from '../utils/generateError';
import { clientModel } from '../models/client';
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

  let message;
  let client;
  const oldClient = await clientModel.findOne({
    registration: req.body.registration,
  });
  if (oldClient) {
    oldClient.name = req.body.name;
    oldClient.address = req.body.address;
    oldClient.registration = req.body.registration;
    oldClient.bankAccount = req.body.bankAccount;
    oldClient.bankName = req.body.bankName;
    oldClient.vat = req?.body?.vat || null;
    oldClient.phone = req?.body?.phone || null;
    oldClient.email = req?.body?.email || null;
    oldClient.additionalInfo = req?.body?.additionalInfo || null;

    client = oldClient;
    message = 'client updated!';
  } else {
    const newclient = new clientModel({
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
    message = 'client created!';
  }

  try {
    await client.save();

    const user = await UserModel.findById(req.userId);
    if (user) {
      user.clients = user.clients || [];

      if (!oldClient) {
        user.clients.push(client._id);
        await user?.save();
      }
    }

    res
      .status(200)
      .json({ message: message, clientId: client._id });
  } catch (err: any) {
    if (!err.statusCode) err.statusCode === 500;
    next(err);
  }
}

export default { createClient };
