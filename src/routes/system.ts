import { Router } from 'express'

import systemController from '../controllers/system-controller'

const router = Router()

router.get('/health', systemController.health)

export default router
