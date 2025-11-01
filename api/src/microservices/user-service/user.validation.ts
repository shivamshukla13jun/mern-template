import { Role } from "microservices/auth-service/types"
import * as Yup from "yup"
const userRegistrationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 50 characters long"),
  email: Yup.string().required("Email is required")
    .email("Email must be a valid email address")
    .max(100, "Email must be at most 100 characters long"),
  password: Yup.string().required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  role: Yup.string().oneOf(Object.values(Role), "Invalid role").required("Role is required")
    .min(1, "At least one role is required"),

})

const userUpdateSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email("Email must be a valid email address"),
  password: Yup.string(),
  role: Yup.string().oneOf(Object.values(Role), "Invalid role"),
})
const ActiveUserSchema = Yup.object().shape({
  isActive: Yup.boolean().required("isActive is required"),
})
const BlockUserSchema = Yup.object().shape({
  isBlocked: Yup.boolean().required("isBlocked is required"),
})
export { userRegistrationSchema, userUpdateSchema, ActiveUserSchema, BlockUserSchema }