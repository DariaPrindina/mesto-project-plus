import mongoose from 'mongoose';
import { Request } from 'express';

interface IUser {
  name: string,
  about: string,
  avatar: string,
  _id: string
}

export interface IUserReq extends Request {
  user?: {
    _id: any;
  }
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>('user', userSchema);