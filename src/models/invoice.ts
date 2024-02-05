import mongoose, { Types, Document } from 'mongoose';
const Schema = mongoose.Schema;

export interface IService {
  title: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface IInvoice {
  createdBy: Types.ObjectId;
//   customer: Types.ObjectId;
  date: Date;
  invoiceNumber: string;
  services: IService[];
  totalPrice: number;
}

export interface IServiceModel extends IService, Document {}

const ServiceSchema = new Schema<IServiceModel>({
  title: { type: String, require: true },
  quantity: { type: Number, require: true },
  price: { type: Number, require: true },
  totalPrice: { type: Number, require: true },
});

export interface IInvoiceModel extends IInvoice, Document {}

const InvoiceSchema = new Schema<IInvoiceModel>({
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: Date, required: true },
  invoiceNumber: {type: String, required: true},
  services: {type: [ServiceSchema], required: true},
  totalPrice: {type: Number, required: true}
},
{timestamps: true});


const InvoiceModel = mongoose.model<IInvoiceModel>('Invoice', InvoiceSchema)

export {InvoiceModel, ServiceSchema, InvoiceSchema}