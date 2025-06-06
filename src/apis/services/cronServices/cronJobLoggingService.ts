// src/apis/services/cronServices/cronJobLoggingService.ts

import { CronJobExecution } from '../../../models/cronModels/cronJobExecutionModel';

export const logCronJobExecution = async (
    jobName: string,
    status: 'success' | 'failure',
    executionTime: Date,
    durationMs: number,
    errorDetails?: string
) => {
    try {
        const logEntry = new CronJobExecution({
            jobName,
            status,
            executionTime,
            durationMs,
            errorDetails,
        });

        await logEntry.save();
        // console.log(`Cron job log saved for job: ${jobName}, status: ${status}`);
    } catch (error) {
        console.error(`Error logging cron job execution: ${error}`);
    }
};
