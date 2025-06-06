// src/config/config.ts
import { config } from 'dotenv';

config();


export const MONGODB_URI = process.env.MONGO_STRING;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const NODE_ENV2 = 'development';




// Paystack billing
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_TEST_SECRET_KEY || '';


if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}


export const ENABLE_LOGSTASH = false
