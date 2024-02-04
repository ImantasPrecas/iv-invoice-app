require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import invoiceRoutes from './routes/invoices';
import userRoutes from './routes/auth';
import mongoose from 'mongoose';

import { IMyCustomError } from './models/interfaces';

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

app.use('/invoices', invoiceRoutes);
app.use('/auth', userRoutes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log('ERRORS: ', data);
  res.status(status).json({ message:message, data:data });
});

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
