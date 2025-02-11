import { Router } from 'express'
import { getUser, getClients, updateUser } from '../controllers/user-controller'
import { userUpdateValidator } from '../validators/user-validator'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/v1/:userId', isAuth, getUser)
router.get('/clients/v1', isAuth, getClients)

router.put('/update', isAuth, userUpdateValidator, updateUser)

export default router
