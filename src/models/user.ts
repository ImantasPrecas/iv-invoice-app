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
  personalId: { type: String, require: true },
  iaRegistration: { type: String, require: true },
  address: { type: String, require: true },
  bankAccount: { type: String, require: true },
  bankName: { type: String, require: true },
  customers: [{ type: Schema.Types.ObjectId, ref: 'Customer' }],
  invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
});

const UserModel = mongoose.model('User', UserSchema);

export { UserModel };
