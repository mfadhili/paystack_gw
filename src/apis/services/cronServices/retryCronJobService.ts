import {
    processWebhookJob
} from "../integrationServices/outbound/whatsAppIntegrationServices/whatsAppRoutingServices/processWebhookJobService";
import {handleServiceError} from "../../middlewares/errorHandlerMiddleware/handleServiceError";

export const retryCronJob = async (jobName: string) => {
    try {
        console.log(`Retrying cron job: ${jobName}`);
        // Call the specific job's service function here
        if (jobName === 'processWebhookData') {
            await processWebhookJob(); // Pass required parameters
        } else {
            throw new Error(`Cron job ${jobName} not recognized`);
        }
        console.log(`Cron job ${jobName} retried successfully`);
    } catch (error) {
        handleServiceError("Error retrying cron job ${jobName}:", error);
    }
};
