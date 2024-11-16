import { Schema, Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  address: string;
  img: string;
}

export const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  img: { type: String, required: true }
});
