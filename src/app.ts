require('dotenv').config()
import express, { Request, Response, NextFunction } from 'express';
import invoiceRoutes from './routes/invoices';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 8080;
// const PORT =8080;

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

app.use('/', invoiceRoutes);


interface MyCustomError extends Error {
  statusCode?: number
  error?: []
}

app.use((error: MyCustomError, req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message
  res.status(status).json({message, error: error.error})

});

mongoose
  .connect(
    `mongodb+srv://precasimantas:${process.env.MONGO_PASS}@iv-invoice-cluster.d8lykpt.mongodb.net/invoice-app`
  )
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
