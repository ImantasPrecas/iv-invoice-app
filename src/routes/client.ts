import { Router } from 'express'
import isAuth from '../middleware/is-auth'
import { clientValidator } from '../validators/client-validator'

import clientControler from '../controlers/client-controler'

const router = Router()

// POST /client/create
router.post('/create', isAuth, clientValidator, clientControler.createClient)

//PUT /client/:clientId
router.put('/:clientId', isAuth, clientValidator, clientControler.updateClient)

//GET /client/:clientId
router.get('/:clientId', isAuth, clientControler.getClient)

export default router
