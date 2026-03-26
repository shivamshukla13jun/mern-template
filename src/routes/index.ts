


import { Router } from "express";

import { Middleware } from "middlewares";
import config from "config";
import authRoutes from "microservices/auth-service/route";
import userRoutes from "microservices/user-service/route";
import { microservicesConfig } from "microservices/microservices";

const rootRouter = Router();

rootRouter.use(microservicesConfig.auth.baseUrl, authRoutes);
rootRouter.use(microservicesConfig.user.baseUrl, userRoutes);

export default rootRouter;
