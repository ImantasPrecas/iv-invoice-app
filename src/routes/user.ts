import { Router } from "express";
import userControler from '../controlers/user-controler'
import { userValidator, userLoginValidator, userUpdateValidatos } from "../validators/user-validator";
import isAuth from "../middleware/is-auth";

const router = Router()

//GET /user
router.get('/', isAuth, userControler.getUser)

//GET /user/clients
router.get('/clients', isAuth, userControler.getClients)

//PUT /user/update
router.put('/update', isAuth, userUpdateValidatos, userControler.update)


export default router