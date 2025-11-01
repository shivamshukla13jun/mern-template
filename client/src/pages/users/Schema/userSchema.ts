import { IUser, Role, Roles } from '@/types';
import * as Yup from 'yup';

const permissionSchema = Yup.object().shape({
  create: Yup.boolean().default(false).optional(),
  delete: Yup.boolean().default(false).optional(),
  update: Yup.boolean().default(false).optional(),
  view: Yup.boolean().default(false).optional(),
  import: Yup.boolean().default(false).optional(),
  export: Yup.boolean().default(false).optional(),
});


const Userschema:Yup.ObjectSchema<IUser>= Yup.object().shape({
  _id:Yup.string().optional(),
  isUpdate: Yup.boolean().default(false),
  isActive: Yup.boolean().default(false),
  isBlocked: Yup.boolean().default(false),
  name: Yup.string()
    .label('Full Name')
    .required('Please enter your full name')
    .min(2, 'Name must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: Yup.string()
    .label('Email Address')
    .email('Please enter a valid email address (e.g. user@example.com)')
    .required('Email address is required for registration'),
  password: Yup.string()
    .label('Password')
    .when('isUpdate', {
      is: false,
      then: (schema) => schema.required('Please create a password').min(6, 'Password must contain at least 6 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number'),
      otherwise: (schema) => schema.optional(),
    }),

  repeatPassword: Yup.string()
    .label('Confirm Password')
    .when('isUpdate', {
      is: false,
      then: (schema) => schema.required('Please confirm your password').oneOf([Yup.ref('password')], 'Both passwords must match'),
      otherwise: (schema) => schema.optional(),
    }).when("password", {
      is: (password: string) => password !== '',
      then: (schema) => schema.required('Please confirm your password').oneOf([Yup.ref('password')], 'Both passwords must match'),
      otherwise: (schema) => schema.optional(),
    }),
  role: Yup.string()
    .label('User Role')
    .oneOf(Roles)
    .required('Please select a role'),
  
 
});

const defaulUsertValues:IUser = {
  isUpdate:false,
  name: '', // Default name
  email: '', // Default email
  password: '', // Default password (ensure this is more secure in production)
  repeatPassword: '', // Default repeat password
  role: "admin", // Default role
};

export { Userschema, defaulUsertValues }
