// src/models/cronModels/cronJobExecutionModel.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

interface ICronJobExecution extends Document {
    jobName: string; // Name of the cron job
    status: 'success' | 'failure'; // Execution status
    executionTime: Date; // Timestamp of when the job ran
    durationMs: number; // Execution duration in milliseconds
    errorDetails?: string; // Error message/details (if any)
    createdAt: Date; // Timestamp of when the record was created
}

const cronJobExecutionSchema = new Schema(
    {
        jobName: { type: String, required: true },
        status: { type: String, enum: ['success', 'failure'], required: true },
        executionTime: { type: Date, required: true },
        durationMs: { type: Number, required: true },
        errorDetails: { type: String },
    },
    { timestamps: true }
);

const CronJobExecution: Model<ICronJobExecution> = mongoose.model<ICronJobExecution>(
    'CronJobExecution',
    cronJobExecutionSchema
);

export { CronJobExecution, ICronJobExecution };
