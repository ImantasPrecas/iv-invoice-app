import { Router } from "express";
import isAuth from "../middleware/is-auth";
import { clientValidator } from "../validators/client";

import clientControler from '../controlers/client'

const router = Router()

// POST /client/create
router.post('/create', isAuth, clientValidator, clientControler.createClient)

export default router