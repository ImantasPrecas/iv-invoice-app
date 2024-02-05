import { Router } from "express";
import userControler from '../controlers/user'
import { userValidator, userLoginValidator, userUpdateValidatos } from "../validators/user";
import isAuth from "../middleware/is-auth";

const router = Router()

// POST /auth/register 
router.post('/register', userValidator, userControler.register)

// POST /auth/login
router.post('/login', userLoginValidator, userControler.login)

//PUT /auth/update
router.put('/update', isAuth, userUpdateValidatos, userControler.update)

router.get('/user', isAuth, userControler.getUser)

export default router