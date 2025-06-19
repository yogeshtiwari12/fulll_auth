import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  isverified: boolean;
  verifycodeExpiry: Date;
  otp: string;
}

const userSchema: Schema<User> = new Schema(
  {
    // yha jo schema hai na wo type hai mongoose schema ka
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // required: true,
      default: "user",
      enum: ["user", "admin"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isverified: {
      type: Boolean,
      default: false,
    },

    verifycodeExpiry: {
      type: Date,
      default: Date.now,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  
  {
    timestamps: true,
  }
);

export const User =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);
export default User;
