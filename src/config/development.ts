
export default {

  NODE_ENV: "development",
  isProduction: false,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  PORT: Number(process.env.PORT) ,

  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET ,
  JWT_EXPIRE: process.env.JWT_EXPIRE ,

  MONGO_URI: process.env.MONGO_URI ,
  FRONTEND_URL: process.env.FRONTEND_URL ,

  fullurl: process.env.DEVELOPMENTURL ,

  REDIS_HOST: process.env.REDIS_HOST ,
  REDIS_PORT: process.env.REDIS_PORT ,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD ,
  REDIS_UERNAME: process.env.REDIS_UERNAME ,

  RABBITMQ_URL: process.env.RABBITMQ_URL ,
  RABBITMQ_HOST: process.env.RABBITMQ_HOST ,
  RABBITMQ_PORT: process.env.RABBITMQ_PORT ,
  RABBITMQ_USERNAME:
    process.env.RABBITMQ_USERNAME ,
  RABBITMQ_PASSWORD:
    process.env.RABBITMQ_PASSWORD ,
    SALT_ROUNDS:10,
  UPLOAD_BASE_DIR: process.env.UPLOAD_BASE_DIR,
  sessionExpireTime: process.env.SESSION_EXPIRE_TIME || 3600,
};
