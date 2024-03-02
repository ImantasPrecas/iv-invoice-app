// require('dotenv').config()
import * as dotenv from 'dotenv'
import express, { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

import invoiceRoutes from './routes/invoices'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import clientRoutes from './routes/client'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080
const MONGO_URI = process.env.MONGO_URI || ''

app.use(express.json())

// THIS ROUTE IS FOR TESTING PURPOUSE- DELETE AFTER DEPLOY TO PROD
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Pong' })
})

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS,GET,POST,PUT,PATH,DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/invoices', invoiceRoutes)
app.use('/client', clientRoutes)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    // error && console.log('ERRORS: ', { message, data })
    res.status(status).json({ message: message, data: data })
})

mongoose
    .connect(MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            // console.log(`Listening on port: ${PORT}`)
        })
    })
    .catch((err) =>
        // eslint-disable-next-line no-console
        console.error(err)
    )
