import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import {  Role, ROLES } from '../microservices/auth-service/types';
import config from 'config';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;  // Changed from Role[] to Role
  isActive: boolean;
  isBlocked: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  matchPassword(enteredPassword: string,password:string): Promise<boolean>;
  resetPasswordToken?: string;
 
  resetPasswordExpire?: Number;
}

const userSchema: Schema<IUserDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
  
    resetPasswordToken:{
      type: String,
    },
    resetPasswordExpire:{
      type: Number,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      // select: false, // Exclude password from query results by default
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      default: Role.ADMIN,
      enum: ROLES,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    versionKey:false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password; // Exclude password from the returned object
        return ret;
      },
    },
    timestamps: true,
    
    
  }
);


// Password hashing middleware
userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt =config.SALT_ROUNDS
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword: string,password:string): Promise<boolean> {

  if (!enteredPassword || !password) {
    throw new Error('Password and hash are required for comparison');
  }
  return bcrypt.compare(enteredPassword, password);
};
  

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;