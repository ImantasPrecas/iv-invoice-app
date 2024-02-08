import mongoose, { Types, Document } from 'mongoose';
const Schema = mongoose.Schema;

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  iaRegistration: string;
  address: string;
  bankAccount: string;
  bankName: string;
  clients: Types.ObjectId[];
  invoices: Types.ObjectId[];
  isAuthenticated: boolean
}

export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema<IUserModel>({
  firstname: { type: String, require: true },
  lastname: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  iaRegistration: { type: String },
  address: { type: String },
  bankAccount: { type: String },
  bankName: { type: String },
  clients: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
  invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
  isAuthenticated: {type:Boolean, default: false}
});

const UserModel = mongoose.model('User', UserSchema);

export { UserModel };
