import { Router } from 'express'
import invoicesController from '../controllers/invoices-controller'
import { invoiceValidator } from '../validators/invoices-validator'
import isAuth from '../middleware/is-auth'

const router = Router()

//GET /invoices
router.get('/', isAuth, invoicesController.getInvoices)

// POST /invoices
router.post('/', isAuth, invoiceValidator, invoicesController.createInvoice)

// GET /invoices/:invoiceId -- single invoice
router.get('/:invoiceId', isAuth, invoicesController.getInvoice)

// PUT /invoices/:invoiceId
router.put(
    '/:invoiceId',
    isAuth,
    invoiceValidator,
    invoicesController.updateInvoice
)

// DELETE /invoice/:invoiceId
router.delete('/:invoiceId', isAuth, invoicesController.deleteInvoice)

export default router
