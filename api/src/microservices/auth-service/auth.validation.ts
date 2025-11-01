import * as yup from 'yup';

// User Registration Schema
export const authRegistrationSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: yup.string().required('Email is required').email('Invalid email format').max(255, 'Email must be less than 255 characters'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters').max(128, 'Password must be less than 128 characters'),
  confirmPassword: yup.string().required('Confirm password is required').oneOf([yup.ref('password')], 'Passwords must match'),
  phone: yup.string().max(20, 'Phone must be less than 20 characters'),
  role: yup.string().oneOf(['user', 'admin', 'superadmin'], 'Invalid role').default('user')
});

// User Login Schema
export const authLoginSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required')
});

// Password Change Schema
export const authPasswordChangeSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().required('New password is required').min(8, 'Password must be at least 8 characters').max(128, 'Password must be less than 128 characters'),
  confirmPassword: yup.string().required('Confirm password is required').oneOf([yup.ref('newPassword')], 'Passwords must match')
});

// Password Reset Request Schema
export const authPasswordResetRequestSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email format')
});

// Password Reset Schema
export const authPasswordResetSchema = yup.object().shape({
  token: yup.string().required('Reset token is required'),
  newPassword: yup.string().required('New password is required').min(8, 'Password must be at least 8 characters').max(128, 'Password must be less than 128 characters'),
  confirmPassword: yup.string().required('Confirm password is required').oneOf([yup.ref('newPassword')], 'Passwords must match')
});

// Email Verification Schema
export const emailVerificationSchema = yup.object().shape({
  token: yup.string().required('Verification token is required')
});

// Refresh Token Schema
export const refreshTokenSchema = yup.object().shape({
  refreshToken: yup.string().required('Refresh token is required')
});

// Two-Factor Authentication Setup Schema
export const twoFactorSetupSchema = yup.object().shape({
  secret: yup.string().required('Secret is required'),
  token: yup.string().required('Token is required').length(6, 'Token must be 6 digits')
});

// Two-Factor Authentication Verify Schema
export const twoFactorVerifySchema = yup.object().shape({
  token: yup.string().required('Token is required').length(6, 'Token must be 6 digits')
});

// Social Login Schema
export const socialLoginSchema = yup.object().shape({
  provider: yup.string().required('Provider is required').oneOf(['google', 'facebook', 'twitter'], 'Invalid provider'),
  accessToken: yup.string().required('Access token is required'),
  email: yup.string().email('Invalid email format'),
  name: yup.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters')
});

// User Profile Update Schema
export const authProfileUpdateSchema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  phone: yup.string().max(20, 'Phone must be less than 20 characters'),
  avatar: yup.string().url('Invalid avatar URL'),
  preferences: yup.object().shape({
    newsletter: yup.boolean(),
    notifications: yup.boolean(),
    language: yup.string().oneOf(['en', 'es', 'fr', 'de'], 'Invalid language')
  })
});
