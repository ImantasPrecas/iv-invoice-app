require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import invoiceRoutes from './routes/invoices';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import clientRoutes from './routes/client'

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || '';

app.use(express.json());
// app.use(express.urlencoded({extended:true}))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS,GET,POST,PUT,PATH,DELETE'
  );
  res.setHeader('Access-Control-Allow-Haders', 'Content-Type, Authorization');
  next();
});

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/client', clientRoutes);


app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  error && console.log('ERRORS: ',{message, data});
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
