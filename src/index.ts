import express, { Request, Response, NextFunction } from 'express';
import invoiceRoutes from './routes/invoices';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 8080;

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

mongoose
  .connect(
    'mongodb+srv://precasimantas:gnh9kbg.ptq-czt0NHT@iv-invoice-cluster.d8lykpt.mongodb.net/invoice-app'
  )
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
