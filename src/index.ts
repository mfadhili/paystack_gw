// src/index.ts
import express, { Application } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';

import { setupRoutes } from "./apis/routes";
import {runAllCronJobs} from "./utils/cronJobs/cronJob";
import { errorHandler } from "./apis/middlewares/errorHandlerMiddleware/errorHandler";
import {NODE_ENV} from "./config/config";

import {setupBullBoard} from "./queues/bullMQ";
import {initializeWorkers} from "./queues/initializeWorkers";
import {setupLogger} from "./logger/logger";
import {customLoggingMiddleware} from "./logger/logging";

const app = express();
app.set("trust proxy", true); // 👈 Add this line

app.use(cors({
    origin: 'http://localhost:5057', // Your backend domain
    credentials: true // Allow credentials (cookies) to be sent
}));

// Logger Setup
let logger = null;


// Connect to the database
connectDB();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());

logger = setupLogger();
if (NODE_ENV === 'production') {
    console.log("logging in production");
    app.use(customLoggingMiddleware(logger));
}


// Setup API routes
setupRoutes(app);

// Error handler middleware (must come last)
app.use(errorHandler);

try {
    runAllCronJobs()
    logger.info("[INFO] Billing Sync Cron Job started successfully.");
} catch (error) {
    logger.error("[ERROR] Failed to start Billing Sync Cron Job:", { error });
}

setupBullBoard(app)
initializeWorkers()

// Start Express server
const PORT = process.env.PORT || 5041;
app.listen(PORT, () => console.log(`🚀 Paystack Server running on port ${PORT}`));
