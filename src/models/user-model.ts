import mongoose, { Types, Document } from 'mongoose'
const Schema = mongoose.Schema

interface IActivityType {
    code: string
    title: string
}

export interface IUser {
    firstName: string
    lastName: string
    email: string
    password: string
    iaRegistration: string
    address: string
    activityTypes: IActivityType[]
    bankAccount: string
    bankName: string
    clients: Types.ObjectId[]
    invoices: Types.ObjectId[]
    isAuthenticated: boolean
    isProfileUpdated: boolean
}

export interface IUserModel extends IUser, Document {}

const ActivityTypeSchema = new Schema<IActivityType>({
    code: String,
    title: String,
})

const UserSchema = new Schema<IUserModel>({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    iaRegistration: { type: String },
    address: { type: String },
    activityTypes: [ActivityTypeSchema],
    bankAccount: { type: String },
    bankName: { type: String },
    clients: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
    invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
    isAuthenticated: { type: Boolean, default: false },
    isProfileUpdated: { type: Boolean, default: false },
})

const UserModel = mongoose.model('User', UserSchema)

export { UserModel }
