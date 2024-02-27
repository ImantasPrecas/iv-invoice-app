import { Router } from 'express'
import isAuth from '../middleware/is-auth'
import { clientValidator } from '../validators/client-validator'

import clientController from '../controllers/client-controller'

const router = Router()

// POST /client/create
router.post('/create', isAuth, clientValidator, clientController.createClient)

//PUT /client/:clientId
router.put('/:clientId', isAuth, clientValidator, clientController.updateClient)

//GET /client/:clientId
router.get('/:clientId', isAuth, clientController.getClient)

export default router
