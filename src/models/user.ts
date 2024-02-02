import mongoose, { Types, Document } from 'mongoose';
const Schema = mongoose.Schema;

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  personalId: string;
  iaRegistration: string;
  address: string;
  bankAccount: string;
  bankName: string;
  customers: Types.ObjectId[];
  invoices: Types.ObjectId[];
}

export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema<IUserModel>({
  firstname: { type: String, require: true },
  lastname: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  personalId: { type: String },
  iaRegistration: { type: String },
  address: { type: String },
  bankAccount: { type: String },
  bankName: { type: String },
  customers: [{ type: Schema.Types.ObjectId, ref: 'Customer' }],
  invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
});

const UserModel = mongoose.model('User', UserSchema);

export { UserModel };
