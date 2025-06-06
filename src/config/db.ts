import mongoose from 'mongoose';
import {MONGODB_URI} from "./config";


export const connectDB = async () => {

    try {
        await mongoose.connect(MONGODB_URI as string, {
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error', err);
        process.exit(1);
    }
};