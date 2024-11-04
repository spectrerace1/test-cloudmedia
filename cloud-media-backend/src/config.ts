import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  
  // Database
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  
  // Redis
  REDIS_URL: z.string(),
  
  // MinIO
  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.string(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_BUCKET: z.string(),
  
  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('1d'),
  
  // Bcrypt
  BCRYPT_SALT_ROUNDS: z.string().default('10'),

  // Email (Nodemailer)
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_FROM: z.string(),
  EMAIL_SECURE: z.string().default('true'),

  // SendGrid
  SENDGRID_API_KEY: z.string(),

  // Twilio
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_PHONE_NUMBER: z.string(),

  // Firebase
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),

  // Default Notification Recipients
  DEFAULT_NOTIFICATION_EMAIL: z.string(),
  DEFAULT_NOTIFICATION_PHONE: z.string()
});

const env = envSchema.parse(process.env);

export const config = {
  env: env.NODE_ENV,
  port: parseInt(env.PORT, 10),
  
  database: {
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT, 10),
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    name: env.DB_NAME,
    logging: env.NODE_ENV === 'development'
  },
  
  redis: {
    url: env.REDIS_URL
  },
  
  minio: {
    endpoint: env.MINIO_ENDPOINT,
    port: parseInt(env.MINIO_PORT, 10),
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY,
    bucket: env.MINIO_BUCKET
  },
  
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN
  },
  
  bcrypt: {
    saltRounds: parseInt(env.BCRYPT_SALT_ROUNDS, 10)
  },

  email: {
    host: env.EMAIL_HOST,
    port: parseInt(env.EMAIL_PORT, 10),
    user: env.EMAIL_USER,
    password: env.EMAIL_PASSWORD,
    from: env.EMAIL_FROM,
    secure: env.EMAIL_SECURE === 'true'
  },

  sendgrid: {
    apiKey: env.SENDGRID_API_KEY
  },

  twilio: {
    accountSid: env.TWILIO_ACCOUNT_SID,
    authToken: env.TWILIO_AUTH_TOKEN,
    phoneNumber: env.TWILIO_PHONE_NUMBER
  },

  firebase: {
    projectId: env.FIREBASE_PROJECT_ID,
    serviceAccount: {
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }
  },

  notifications: {
    defaultEmail: env.DEFAULT_NOTIFICATION_EMAIL,
    defaultPhone: env.DEFAULT_NOTIFICATION_PHONE
  }
};