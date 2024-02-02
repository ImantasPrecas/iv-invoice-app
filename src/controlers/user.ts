import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user";
import { validationResult } from "express-validator";

function register(req:Request, res:Response, next: NextFunction){
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const error = {
            message: 'Validation failed, entered data is incorrect!',
            errors: errors.array()
        } as any
        res.status(422).json({error})
    }
    // const user = UserModel.

    res.json({message: 'ok'})
}

export default {register}