// src/config/config.ts
import { config } from 'dotenv';

config();


export const MONGODB_URI = process.env.MONGO_STRING;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const NODE_ENV2 = process.env.NODE_ENV || 'development';

// Paystack billing
export const PAYSTACK_SECRET_KEY = NODE_ENV2 === 'production' ?  process.env.PAYSTACK_LIVE_SECRET_KEY || process.env.PAYSTACK_TEST_SECRET_KEY : '';
export const TRIAL_PERIOD_DAYS = 7;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

export const ENABLE_LOGSTASH = false
