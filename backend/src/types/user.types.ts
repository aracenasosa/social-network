import { Document } from "mongoose";

export interface IUser extends Document {
  userName: string;
  fullName: string;
  email: string;
  profilePhoto?: string;
  location?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}
