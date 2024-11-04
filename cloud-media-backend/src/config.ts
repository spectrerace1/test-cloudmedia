import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  
  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_NAME: z.string().default('cloud_media'),
  
  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  
  // MinIO
  MINIO_ENDPOINT: z.string().default('localhost'),
  MINIO_PORT: z.string().default('9000'),
  MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().default('minioadmin'),
  MINIO_BUCKET: z.string().default('cloud-media'),
  
  // JWT
  JWT_SECRET: z.string().default('your-jwt-secret-key'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  JWT_REFRESH_SECRET: z.string().default('your-jwt-refresh-secret-key'),
  
  // Bcrypt
  BCRYPT_SALT_ROUNDS: z.string().default('10'),

  // Email (Nodemailer)
  EMAIL_HOST: z.string().default('smtp.gmail.com'),
  EMAIL_PORT: z.string().default('587'),
  EMAIL_USER: z.string().default('your-email@gmail.com'),
  EMAIL_PASSWORD: z.string().default('your-app-password'),
  EMAIL_FROM: z.string().default('your-email@gmail.com'),
  EMAIL_SECURE: z.string().default('true'),

  // SendGrid
  SENDGRID_API_KEY: z.string().default('your-sendgrid-api-key'),

  // Twilio
  TWILIO_ACCOUNT_SID: z.string().default('your-twilio-sid'),
  TWILIO_AUTH_TOKEN: z.string().default('your-twilio-token'),
  TWILIO_PHONE_NUMBER: z.string().default('your-twilio-phone'),

  // Firebase
  FIREBASE_PROJECT_ID: z.string().default('your-project-id'),
  FIREBASE_CLIENT_EMAIL: z.string().default('your-client-email'),
  FIREBASE_PRIVATE_KEY: z.string().default('your-private-key'),

  // Default Notification Recipients
  DEFAULT_NOTIFICATION_EMAIL: z.string().default('admin@example.com'),
  DEFAULT_NOTIFICATION_PHONE: z.string().default('+1234567890')
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
    refreshSecret: env.JWT_REFRESH_SECRET,
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