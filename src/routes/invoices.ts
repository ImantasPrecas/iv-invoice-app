import {Router, Request, Response} from 'express'
import invoicesControler from '../controlers/invoices'

const router = Router();

//GET /invoices
router.get('/invoices', invoicesControler.getInvoices)

// POST /invoices
router.post('/invoices',invoicesControler.postInvoice)

export default router