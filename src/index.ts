// const express = require('express')
import express, { Request, Response, NextFunction } from 'express';
import invoiceRoutes from './routes/invoices';
// const bodyParser = require('body-parser')

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
  next()
});

app.use('/', invoiceRoutes);

// app.get('/', (req: Request, res: Response) => {
//   res.send('<h1>Welcome</h1>');
// });

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
