
import dotenv from "dotenv"
import path from 'path'
dotenv.config()
const sessionExpireTime = 365 * 24 * 60 * 60 * 1000; // 365 days in ms
const NODE_ENV:string=process.env.NODE_ENV||"development"
const PORT:number=NODE_ENV==="production"?Number(process.env.PORT_PRODUCTION):process.env.NODE_ENV==="staging"?Number(process.env.PORT_STAGING):Number(process.env.PORT)
const JWT_SECRET: string = process.env.JWT_SECRET || 'defaultSecret';
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || 'defaultSecret';
const JWT_EXPIRE: string = process.env.JWT_EXPIRE || '1h'
const MONGO_URI=NODE_ENV==="production"?process.env.MONGO_URI_PRODUCTION:process.env.NODE_ENV==="staging"?process.env.MONGO_URI_STAGING:process.env.MONGO_URI
const FRONTEND_URL=NODE_ENV==="production"?process.env.FRONTEND_URL_PRODUCTION:process.env.NODE_ENV==="staging"?process.env.FRONTEND_URL_STAGING:process.env.FRONTEND_URL
// Define upload directories
const UPLOAD_BASE_DIR = path.join(process.cwd(), 'uploads');

const isProduction = NODE_ENV !== "development";
const fullurl = NODE_ENV !== 'development' ? process.env.PRODUCTIONURL as string : process.env.DEVELOPMENTURL as string;
// Redis Configuration
const REDIS_HOST: string = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT: string = process.env.REDIS_PORT || '6379';
const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || '';
const REDIS_UERNAME: string = process.env.REDIS_UERNAME || 'default';

// RabbitMQ Configuration
const RABBITMQ_URL: string = process.env.RABBITMQ_URL || '';
const RABBITMQ_HOST: string = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_PORT: string = process.env.RABBITMQ_PORT || '5672';
const RABBITMQ_USERNAME: string = process.env.RABBITMQ_USERNAME || 'guest';
const RABBITMQ_PASSWORD: string = process.env.RABBITMQ_PASSWORD || 'guest';

const ALL_DIRECTORY_LIST=[UPLOAD_BASE_DIR]
export {
  PORT, JWT_SECRET, FRONTEND_URL, JWT_EXPIRE, REFRESH_TOKEN_SECRET, UPLOAD_BASE_DIR, 
  NODE_ENV, isProduction, sessionExpireTime, fullurl, ALL_DIRECTORY_LIST, 
  REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, MONGO_URI,REDIS_UERNAME,
  RABBITMQ_URL, RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USERNAME, RABBITMQ_PASSWORD
};