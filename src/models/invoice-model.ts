import mongoose, { Types, Document } from 'mongoose'
const Schema = mongoose.Schema

export interface IAssets {
    title: string
    quantity: number
    price: number
    totalPrice: number
}

export interface IInvoice {
    createdBy: Types.ObjectId
    client: Types.ObjectId
    date: Date
    invoiceNumber: string
    assets: IAssets[]
    totalPrice: number
}

export interface IAssetModel extends IAssets, Document {}

const AssetSchema = new Schema<IAssetModel>({
    title: { type: String, require: true },
    quantity: { type: Number, require: true },
    price: { type: Number, require: true },
    totalPrice: { type: Number, require: true },
})

export interface IInvoiceModel extends IInvoice, Document {}

const InvoiceSchema = new Schema<IInvoiceModel>(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
        date: { type: Date, required: true },
        invoiceNumber: { type: String, required: true },
        assets: { type: [AssetSchema], required: true },
        totalPrice: { type: Number, required: true },
    },
    // eslint-disable-next-line spellcheck/spell-checker
    { timestamps: true }
)

const InvoiceModel = mongoose.model<IInvoiceModel>('Invoice', InvoiceSchema)

export { InvoiceModel, AssetSchema, InvoiceSchema }
