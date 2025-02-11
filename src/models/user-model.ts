import mongoose, { Types, Document } from 'mongoose'
const Schema = mongoose.Schema

export interface IActivityType {
  code: string
  title: string
}

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  isProfileUpdated: boolean
  personalInfo?: {
    address?: string
    phone?: string
    city?: string
    country?: string
  }
  activityInfo?: {
    activityTypes?: IActivityType[]
    activityRegistration?: string
  }
  bankInfo?: {
    bankAccount?: string
    bankName?: string
    IBAN?: string
    swiftCode?: string
  }
  clients: Types.ObjectId[]
  invoices: Types.ObjectId[]
  isAuthenticated: boolean
}

// export interface IUserModel extends IUser, Document {}

const ActivityTypeSchema = new Schema<IActivityType>({
  code: String,
  title: String,
})

const UserSchema = new Schema<IUser>({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  isProfileUpdated: { type: Boolean, default: false },
  personalInfo: {
    address: { type: String },
    phone: { type: String },
    city: { type: String },
    country: { type: String },
  },
  activityInfo: {
    activityTypes: [ActivityTypeSchema],
    activityRegistration: { type: String },
  },
  bankInfo: {
    bankAccount: { type: String },
    bankName: { type: String },
    IBAN: { type: String },
    swiftCode: { type: String },
  },
  clients: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
  invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
  isAuthenticated: { type: Boolean, default: false },
})

const UserModel = mongoose.model('User', UserSchema)

export { UserModel }
