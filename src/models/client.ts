import mongoose, { Document, Schema, Types } from "mongoose";

export interface IClient {
    users: Types.ObjectId[]
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

export interface IClientModel extends IClient, Document {}

const clientSchema = new Schema<IClientModel>({
    users: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
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

const ClientModel = mongoose.model('Client', clientSchema);

export {ClientModel}