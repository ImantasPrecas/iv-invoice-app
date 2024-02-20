import { Router } from 'express'
import userControler from '../controlers/user-controler'
import { userValidator, userLoginValidator } from '../validators/user-validator'

const router = Router()

// POST /auth/register
router.post('/register', userValidator, userControler.register)

// POST /auth/login
router.post('/login', userLoginValidator, userControler.login)

export default router
