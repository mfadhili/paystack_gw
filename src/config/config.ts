// src/config/config.ts
import { config } from 'dotenv';

config();


export const MONGODB_URI = process.env.MONGO_STRING;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const NODE_ENV2 = 'development';


// Paddle billing details
export const PADDLE_ENVIRONMENT = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox';
export const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';
export const PADDLE_API_KEY = process.env.NEXT_PUBLIC_PADDLE_API_KEY || '';
export const PADDLE_WEBHOOK_SECRET_KEY = process.env.NEXT_PADDLE_WEBHOOK_SECRET_KEY || '';

// Paystack billing
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_TEST_SECRET_KEY || '';

// Paddle Base URL (switches based on environment)
export const PADDLE_BASE_URL =
    NODE_ENV2 === 'development'
        ? process.env.NEXT_PADDLE_SANDBOX_BASE_URL || 'https://sandbox-api.paddle.com'
        : 'https://vendors.paddle.com/api/2.0';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!PADDLE_CLIENT_TOKEN || !PADDLE_API_KEY) {
    throw new Error('Please define the Paddle billing environment variables inside .env.local');
}
export const ENABLE_LOGSTASH = false
