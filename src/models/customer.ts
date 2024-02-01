import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer {
    name: string;
    address: string;
    registration: string;
    bankAccount: string;
    bankName: string;
    vat?: string;
    phone?: string;
    email?: string;
    additionalInfo?: string  
}

export interface ICustomerModel extends ICustomer, Document {}

const CustomerSchema = new Schema<ICustomerModel>({
    name: {type: String, require: true},
    address: {type: String, require: true},
    registration: {type: String, require: true},
    bankAccount: {type: String, require: true},
    bankName: {type: String, require: true},
    vat: {type: String},
    phone: {type: String},
    email: {type: String},
    additionalInfo: {type: String}
})

const CustomerModel = mongoose.model('Customer', CustomerSchema);

export {CustomerModel}