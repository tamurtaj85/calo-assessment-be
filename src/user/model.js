import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    teamCreated: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model('User', userSchema);
