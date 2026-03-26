import { Request, Response, NextFunction } from "express";
import multer from 'multer';
import path from 'path';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import { AppError } from 'middlewares/error';
import { verifyToken, verifyTokenInDatabase } from 'libs/jwt';
import User, { IUserDocument } from 'models/user.model';
declare global {
  namespace Express {
    interface Request {
      user: IUserDocument;
    }
  }
}
const mimeTypeMap: { [key: string]: string[] } = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac']
};

export class Middleware {
    constructor() {

    }

    static verifyToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract JWT token from Authorization header
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return next(new AppError('Unauthorized: No token provided', 401));
            }

            const token = authHeader.replace('Bearer ', ''); // Remove 'Bearer ' prefix

            // Verify JWT signature
            const decoded = verifyToken(token, false);

            // Verify token exists in database (not revoked)
            const tokenExists = await verifyTokenInDatabase(token, 'access');
            if (!tokenExists) {
                return next(new AppError('Unauthorized: Token is invalid or expired', 401));
            }

            // Get user from database
            const user = await User.findById(decoded.userId);
            if (!user) {
                return next(new AppError('Unauthorized: User not found', 401));
            }

            // Attach user to request object
            req.user = user 
            next();

        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                return next(new AppError('Unauthorized: Token has expired', 401));
            }
            if (error.name === 'JsonWebTokenError') {
                return next(new AppError('Unauthorized: Invalid token', 401));
            }
            next(error);
        }
    }

    static loginLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 3, // e.g., 5 login attempts per window
        //   store: loginStore,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        handler: (req, res, next, options) => {
            next(
                new AppError(
                    `Too many login attempts from this IP. Please try again after ${Math.ceil(options.windowMs / 60000)} minutes.`,
                    429
                )
            );
        }
    });
    static apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100, // e.g., 100 requests per window for normal APIs
        //   store: apiStore,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        handler: (req, res, next, options) => {
            next(
                new AppError(
                    `Too many requests from this IP. Please try again after ${Math.ceil(options.windowMs / 60000)} minutes.`,
                    429
                )
            );
        }
    });
    // Configure multer
    static upload = ({ destination = "uploads", fileSize = 5, maxFiles = 1, fileType }: { destination: string, fileSize: number, maxFiles: number, fileType: "image" | "video" | "document" | "audio" | "all" | "" }) => {


        return multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, destination);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + uuidv4();
                    const extension = path.extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
                }
            }),
            limits: {
                fileSize: fileSize * 1024 * 1024,
                files: maxFiles
            },
            fileFilter: (req, file, cb) => {
                if (fileType === 'all' || fileType === '') {
                    cb(null, true);
                } else {
                    const allowedMimes = mimeTypeMap[fileType] || [];
                    if (allowedMimes.includes(file.mimetype)) {
                        cb(null, true);
                    } else {
                        cb(new AppError(`Only ${fileType} files are allowed!`, 400));
                    }
                }
            }
        })
    }
    // Error handling middleware
    static handleUploadError = (error: any, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 5MB.'
                });
            }
            if (error.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    success: false,
                    message: 'Too many files. Maximum 10 files allowed.'
                });
            }
            if (error.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    success: false,
                    message: 'Unexpected field name for file upload.'
                });
            }
        }

        if (error.message.includes('Only image files')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        next(error);
    };
    static requestValidate = (schema: z.ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.info('Original Request Body:', req.body);
            req.body = await schema.parseAsync(req.body);
            console.info('New Request Body:', req.body);
            next();
        } catch (err: any) {
            next(err);
        }
    };
}