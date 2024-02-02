import { Router } from "express";
import userControler from '../controlers/user'
import { userValidator } from "../validators/user";

const router = Router()

// POST 
router.post('/register', userValidator, userControler.register)

export default router