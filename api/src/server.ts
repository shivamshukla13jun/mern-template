import dotenv from 'dotenv';
dotenv.config();

import express, { ErrorRequestHandler, Express, NextFunction } from "express";
import cors from "cors";
import helmet from 'helmet';
import {Middleware} from 'middlewares';
import {  sessionMiddleware } from 'middlewares/session';
import compression from 'compression';
import {
  PORT, ALL_DIRECTORY_LIST, UPLOAD_BASE_DIR,
} from 'config';
import rootRouter from 'routes';
import { notFound, errorHandler, AppError } from 'middlewares/error';
import connectDB from 'config/database';
// import rabbitMQConnection from 'config/rabbitmq';
// import MessageQueueConsumer from 'microservices/message-queue-consumer';
import createDefaultUsers from 'seeders';
import bodyParser from 'body-parser';
import { corsOptions } from 'utils/CorsOptions';
import swaggerSpec from "services/SwaggerService/swaggerSpec";
import swaggerUi from 'swagger-ui-express';

const app: Express = express();

// Track database connection state
let isDatabaseConnected = false;

// Middleware to check database connection
const checkDatabaseConnection = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!isDatabaseConnected && !req.path.startsWith('/health')) {
    throw new AppError('Database connection is not available. Please try again later.', 503);
  }
  next();
};

// create directortis if not exists
import { ensureDirectoryExists } from 'libs';
import { runCluster } from 'utils/cluster';
ALL_DIRECTORY_LIST.forEach((dir) => {
  ensureDirectoryExists(dir);
});
// set default engine
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

// compression
app.use(compression());

// enable cors-origin
app.use(cors(corsOptions as any));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
  })
);

// parse body
app.use(bodyParser.json());
// url encode to accept form-data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(UPLOAD_BASE_DIR));
const attemptDatabaseConnection = async () => {
  try {
    await connectDB();
    isDatabaseConnected = true;
    console.log('MongoDB connected');
    
    // Initialize RabbitMQ and message queue consumers
    // await MessageQueueConsumer.startConsumers();
    
    createDefaultUsers()
    const swaggerDocument = await swaggerSpec();
    // Mount Swagger UI
    app.use(checkDatabaseConnection);
    // session middleware
    app.use(sessionMiddleware);


    app.use('/api-docs', swaggerUi.serve);

    app.get('/api-docs', swaggerUi.setup(swaggerDocument));
    app.use(rootRouter);
    app.use(notFound)
    app.use(errorHandler as ErrorRequestHandler);
    console.log(' Swagger UI is available at /api-docs');
    // runCluster(() => {
    //   app.listen(PORT, () => {
    //     console.log(`Server is running on port ${PORT}`);
    //   });
    // }, {
    //   workers: 0,           // 0 = use all CPU cores
    //   restartOnExit: true,  // restart workers if they crash
    //   onWorkerStart: (worker) => {
    //     console.log(`Worker ${worker.process.pid} forked`);
    //   },
    // });
    // Start the server only after routes are set up
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });


  } catch (err) {
    isDatabaseConnected = false;
    console.warn('Unable to connect to the database:', err);
    // Attempt reconnection after 5 seconds
    setTimeout(attemptDatabaseConnection, 5000);
  }
};
attemptDatabaseConnection();

