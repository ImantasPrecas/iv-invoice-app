import { Router } from 'express'
import userController from '../controllers/user-controller'
import { userUpdateValidator } from '../validators/user-validator'
import isAuth from '../middleware/is-auth'

const router = Router()

//GET /user
router.get('/', isAuth, userController.getUser)

//GET /user/clients
router.get('/clients', isAuth, userController.getClients)

//PUT /user/update
router.put('/update', isAuth, userUpdateValidator, userController.update)

export default router
