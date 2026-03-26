import { Request, Response, NextFunction } from "express";
import User,{IUserDocument} from "../../models/user.model";
import { AppError } from "middlewares/error";
import crypto from "crypto";
import sendEmail from "libs/sendEmail";
import config from "config";
import ejs from "ejs";
import path from "path";
import { generateAccessToken, generateRefreshToken, saveTokenToDatabase, getTokenExpirationSeconds, revokeToken, verifyToken } from "libs/jwt";

/**
 * @description Create New User
 * @type POST 
 * @path /api/users/register
 */
const registerUser =
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.create(req.body);
      res.status(201).json({ data: user, success: true, statusCode: 201 });
    } catch (error) {
      console.warn(error)
      next(error)
    }
  }

/**
 * @description User Login
 * @type POST 
 * @path /api/users/login
 */
const loginUser = 
  async (req: Request, res: Response, next: NextFunction):  Promise<void>  => {
    try {
      const payload: IUserDocument = req.body;
    payload.email = payload.email.toLowerCase();

    // Use a "where" clause to find the user by email
    const checkUser = await User.findOne( { email: payload.email  });
    if (!checkUser) {
      throw new AppError("No user found with provided email", 400);
    }

    if (!checkUser.isActive) {
      throw new AppError("Account is deactivated by owner!", 400);
    }
    if (checkUser.isBlocked) {
      throw new AppError("Account is blocked by owner!", 400);
    }
    const isMatch = await checkUser.matchPassword(payload.password as string, checkUser.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 400);
    }

    // Generate JWT tokens
    const tokenPayload = {
      userId: checkUser._id.toString(),
      email: checkUser.email,
      role: checkUser.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save tokens to database with TTL
    const accessTokenExpiry = getTokenExpirationSeconds('access');
    const refreshTokenExpiry = getTokenExpirationSeconds('refresh');

    await saveTokenToDatabase(checkUser._id, accessToken, 'access', accessTokenExpiry);
    await saveTokenToDatabase(checkUser._id, refreshToken, 'refresh', refreshTokenExpiry);

    // Remove sensitive info from returned user data
    const { password, isBlocked, ...userData } = checkUser.toJSON();
      res.status(200).json({
        success: true,
        data: {
          user: userData,
          accessToken,
          refreshToken,
          expiresIn: accessTokenExpiry,
        },
        message: "Login successful",
      });
    } catch (error) {
      next(error)
    }
  }


/**
 * @description Forgot Password
 * @type POST 
 * @path /api/auth/forgot-password
 */
const forgotPassword = 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
     const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError("No user found with provided email", 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${config.FRONTEND_URL}/reset-password/${resetToken}`;
    const html=await ejs.renderFile(path.join(__dirname,"passwordreset.ejs"), { resetUrl });

    sendEmail(user.email, "Password Reset Request", html);
    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
    
   } catch (error) {
    next(error)
   }
  }


/**
 * @description Reset Password
 * @type POST 
 * @path /api/auth/reset-password
 */
const resetPassword =
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, password } = req.body;
      const user = await User.findOne({ resetPasswordToken: token,resetPasswordExpire:{$gt:Date.now()} });
      if (!user) {
        throw new AppError("Invalid or expired reset token", 400);
      }
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password reset successful"
      });
    } catch (error) {
      next(error)
    }    
  }

 const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await revokeToken(token);
    }
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
} catch (error) {
  next(error)
}
};
const currentLoginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id
    const user=await User.findById(userId)
    if(!user){
      throw new AppError("User not found", 400);
    }
    res.status(200).json({ data: user, success: true, statusCode: 200 });
  } catch (error) {
    next(error)
  }
}

/**
 * @description Refresh Access Token
 * @type POST 
 * @path /api/auth/refresh-token
 */
const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    // Verify refresh token signature
    const decoded = verifyToken(refreshToken, true);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError("User not found", 401);
    }

    // Generate new access token
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const accessTokenExpiry = getTokenExpirationSeconds('access');

    // Save new access token to database
    await saveTokenToDatabase(user._id, newAccessToken, 'access', accessTokenExpiry);

    // Optionally: Rotate refresh token (revoke old one and create new one)
    // Uncomment below to enable refresh token rotation
    // await revokeToken(refreshToken);
    // const newRefreshToken = generateRefreshToken(tokenPayload);
    // const refreshTokenExpiry = getTokenExpirationSeconds('refresh');
    // await saveTokenToDatabase(user._id, newRefreshToken, 'refresh', refreshTokenExpiry);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        expiresIn: accessTokenExpiry,
        // Include new refresh token if rotation is enabled:
        // refreshToken: newRefreshToken,
        // refreshExpiresIn: refreshTokenExpiry,
      },
      message: "Token refreshed successfully",
    });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(new AppError("Refresh token has expired. Please login again", 401));
    } else if (error.name === 'JsonWebTokenError') {
      next(new AppError("Invalid refresh token", 401));
    } else {
      next(error);
    }
  }
};

export { registerUser, loginUser, forgotPassword, resetPassword, logout, currentLoginUser, refreshAccessToken };
