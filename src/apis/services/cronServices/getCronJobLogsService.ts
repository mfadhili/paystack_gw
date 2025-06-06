import {handleServiceError} from "../../middlewares/errorHandlerMiddleware/handleServiceError";
import {CronJobExecution} from "../../../models/cronModels/cronJobExecutionModel";

export const getCronJobLogs = async (filters: any) => {
    try {
        const logs = await CronJobExecution.find(filters).sort({ executionStart: -1 });
        return logs;
    } catch (error) {
        handleServiceError("Error fetching cron job logs:", error);
    }
};
