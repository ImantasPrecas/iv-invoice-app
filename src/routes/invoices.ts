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

// PUT /invoices/:invoiceId
router.put('/:invoiceId', invoiceValidator, invoicesControler.updateInvoice)

// DELETE /invoice/:invoiceId
router.delete('/:invoiceId', invoicesControler.deleteInvoice)

export default router