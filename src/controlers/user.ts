import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user";
import { validationResult } from "express-validator";

async function register(req:Request, res:Response, next: NextFunction){
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const error = {
            message: 'Validation failed, entered data is incorrect!',
            errors: errors.array()
        } as any
        res.status(422).json({error})
        return
    }

    const newUser = new UserModel({
        firstname: req.body.firstname,
        lastname: req.body.firstname,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const user = await newUser.save()
        console.log('User Created!')
        res.status(201).json({user})
    } catch (err) {
        next(err)
    }
}

export default {register}