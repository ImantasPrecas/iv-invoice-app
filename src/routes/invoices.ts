import {Router, Request, Response} from 'express'
import invoicesControler from '../controlers/invoices'
import { invoiceValidator } from '../validators/invoices';

const router = Router();

//GET /invoices
router.get('/', invoicesControler.getInvoices)

// POST /invoices
router.post('/', invoiceValidator, invoicesControler.createInvoice)

// GET /invoices/:invoiceId -- single invoice
router.get('/:invoiceId', invoicesControler.getInvoice)

export default router