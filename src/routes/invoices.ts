import {Router, Request, Response} from 'express'
import invoicesControler from '../controlers/invoices'
import { invoiceValidator } from '../validators/invoices';
import isAuth from '../middleware/is-auth';

const router = Router();

//GET /invoices
router.get('/', isAuth, invoicesControler.getInvoices)

// POST /invoices
router.post('/', isAuth, invoiceValidator, invoicesControler.createInvoice)

// GET /invoices/:invoiceId -- single invoice
router.get('/:invoiceId', isAuth, invoicesControler.getInvoice)

// PUT /invoices/:invoiceId
router.put('/:invoiceId', isAuth, invoiceValidator, invoicesControler.updateInvoice)

// DELETE /invoice/:invoiceId
router.delete('/:invoiceId', isAuth, invoicesControler.deleteInvoice)

export default router