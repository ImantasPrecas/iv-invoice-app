import { NextFunction, Request, Response } from 'express'
import { IUser, UserModel } from '../models/user-model'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { newError } from '../utils/generateError'
import { IAuthenticatedRequest } from '../middleware/is-auth'

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(newError('Bad request!', 400, errors.array()))
  }

  const { firstName, lastName, email, password } = req.body

  try {
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return next(newError('Email already in use', 409))
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })

    const user = await newUser.save()
    res.status(201).json({ message: 'User created!', userId: user._id })
  } catch (err: any) {
    if (!err.statusCode) err.statusCode = 500
    next(err)
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(newError('Bad request!', 400, errors.array()))
  }

  const { email, password } = req.body

  try {
    const existingUser = await UserModel.findOne({ email })
    if (!existingUser) {
      const error = newError('Cant find user with this email!', 401)
      throw error
    }

    const isEqual = await bcrypt.compare(password, existingUser.password)
    if (!isEqual) {
      const error = newError(
        'Validation failed, entered password is incorrect!',
        401
      )
      throw error
    }

    const JWT_KEY = process.env.JWT_KEY || ''
    const token = jwt.sign(
      {
        userId: existingUser._id.toString(),
      },
      JWT_KEY,
      { expiresIn: '1h' }
    )
    res.status(200).json({
      id: existingUser._id.toString(),
      token: token,
    })
  } catch (err: any) {
    if (!err.statusCode) err.statusCode = 500
    next(err)
  }
}

async function getUser(
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.params.userId
  // IMPLEMENT USER ID ERROR HANDLING IF NOT FOUND
  try {
    const user = (await UserModel.findById(userId)) as IUser
    if (!user) {
      throw next(newError('Cant find user', 404))
    }

    res.status(200).json(user)
  } catch (err: any) {
    if (!err.statusCode) err.statusCode === 500
    next(err)
  }
}

async function updateUser(
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(newError('Bad request!', 400, errors.array()))
  }

  const userId = req.userId
  const { firstName, lastName, email, personalInfo, activityInfo, bankInfo } =
    req.body

  try {
    const user = await UserModel.findById(userId)
    if (!user) {
      return next(newError('Not found', 404))
    }

    const existingUserByEmail = await UserModel.findOne({ email })
    if (email === existingUserByEmail?.email && email !== user.email) {
      return next(newError('Email already taken', 400))
    }

    user.firstName = firstName.trim() || user.firstName
    user.lastName = lastName.trim() || user.lastName
    user.email = email.trim() || user.email
    user.personalInfo = {
      address: personalInfo.address.trim() || user?.personalInfo?.address || '',
      phone: personalInfo.phone.trim() || user?.personalInfo?.phone || '',
      city: personalInfo.city.trim() || user?.personalInfo?.city || '',
      country: personalInfo.country.trim() || user?.personalInfo?.country || '',
    }
    user.activityInfo = {
      activityTypes:
        activityInfo.activityTypes || user?.activityInfo?.activityTypes || [],
      activityRegistration:
        activityInfo.activityRegistration ||
        user?.activityInfo?.activityRegistration ||
        '',
    }
    user.bankInfo = {
      bankAccount:
        bankInfo.bankAccount.trim() || user?.bankInfo?.bankAccount || '',
      bankName: bankInfo.bankName.trim() || user?.bankInfo?.bankName || '',
      IBAN: bankInfo.IBAN.trim() || user?.bankInfo?.IBAN || '',
      swiftCode: bankInfo.swiftCode.trim() || user?.bankInfo?.swiftCode || '',
    }
    if (
      !user.firstName ||
      !user.lastName ||
      !user.personalInfo.address ||
      !user.personalInfo.phone ||
      !user.personalInfo.city ||
      !user.personalInfo.country ||
      !user.activityInfo.activityRegistration ||
      (user.activityInfo.activityTypes &&
        user.activityInfo.activityTypes.length === 0) ||
      !user.bankInfo.bankAccount ||
      !user.bankInfo.bankName ||
      !user.bankInfo.IBAN ||
      !user.bankInfo.swiftCode
    ) {
      user.isProfileUpdated = false
    } else user.isProfileUpdated = true

    const updatedUser = await user.save()

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    })
  } catch (err: any) {
    if (!err.statusCode) err.statusCode === 500
    next(err)
  }
}

async function getClients(
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.userId

  try {
    const user = await UserModel.findById(userId)
      .populate({
        path: 'clients',
        select:
          'name address registration bankAccount bankName vat phone email additionalInfo myField',
      })
      .exec()
    if (!user) {
      return next(newError('No user found', 404))
    }
    const clients = user.clients

    if (clients.length === 0)
      res.status(200).json({ message: 'No clients found' })
    else res.status(200).json(clients)
  } catch (err: any) {
    if (!err.statusCode) err.statusCode === 500
    next(err)
  }
}

export { login, getUser, updateUser, getClients }
