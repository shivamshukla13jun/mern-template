
import * as yup from 'yup';
import { Role, ROLES } from '../types';

const AuthRegisterSchema=yup.object().shape({
    name: yup.string()
       .required("Name is required")
       .min(3, "Name must be at least 3 characters long")
       .max(50, "Name must be at most 50 characters long"),
       email: yup.string().required("Email is required")
       .email("Email must be a valid email address")
       .max(100, "Email must be at most 100 characters long"),
       password: yup.string().required("Password is required")
       .min(8, "Password must be at least 8 characters long"),
       role: yup.string().oneOf(Object.values(Role), "Invalid role").required("Role is required")
       .min(1, "At least one role is required"),
})
const AuthLoginSchema=yup.object().shape({
    email:yup.string().email().required('Email is required'),
    password:yup.string().required('Password is required')
})

export {AuthRegisterSchema,AuthLoginSchema}

