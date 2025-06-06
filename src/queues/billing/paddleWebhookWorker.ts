import { Worker, Job } from "bullmq";
import { processPaddleWebhookEventService } from "../../apis/services/billingServices/paddleBillingServices/webhookServices/processPaddleWebhookEventService";
import {connection} from "../../utils/queueUtils/connection";

new Worker(
    "paddle-webhook-queue",
    async (job: Job) => {
        const { eventId } = job.data;
        return await processPaddleWebhookEventService(eventId);
    },
    { connection }
);
