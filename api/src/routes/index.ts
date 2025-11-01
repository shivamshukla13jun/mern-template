import { Router } from "express";
import authRoutes from "microservices/auth-service/route"
import userRoutes from "microservices/user-service/route"
import PermissionRoutes from "microservices/permission-services/route"
import { Middleware } from "middlewares";


const rootRouter = Router();

// decrypt data
rootRouter.use(Middleware.encryptResponseMiddleware)
rootRouter.use(Middleware.decryptDataMiddleware)

// Legacy routes
rootRouter.use("/api/auth", authRoutes)
rootRouter.use("/api/users", userRoutes)
rootRouter.use("/api/role-permissions", PermissionRoutes)
// E-commerce routes

export default rootRouter;