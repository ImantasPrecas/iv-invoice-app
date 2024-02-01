import {Router, Request, Response} from 'express'
import invoicesControler from '../controlers/invoices'
import { body } from 'express-validator'
import { invoiceValidator } from '../validators/invoices';

const router = Router();

//GET /invoices
router.get('/invoices', invoicesControler.getInvoices)

// POST /invoices
router.post('/invoices', invoiceValidator, invoicesControler.postInvoice)

export default router