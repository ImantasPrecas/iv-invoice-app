import { Router } from 'express'
import userController from '../controllers/user-controller'
import { userValidator, userLoginValidator } from '../validators/user-validator'

const router = Router()

// POST /auth/register
router.post('/register', userValidator, userController.register)

// POST /auth/login
router.post('/login', userLoginValidator, userController.login)

export default router
