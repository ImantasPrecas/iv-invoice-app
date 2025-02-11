import { Router } from 'express'
import { register, login } from '../controllers/user-controller'
import { userValidator, userLoginValidator } from '../validators/user-validator'

const router = Router()

router.post('/register/v1', userValidator, register)
router.post('/login/v1', userLoginValidator, login)

export default router
