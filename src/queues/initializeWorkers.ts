import { Worker, Job } from "bullmq";
import { connection } from "../utils/queueUtils/connection";
import {
    processPaystackWebhookEventService
} from "../apis/services/billingServices/paystackBillingServices/webhookServices/processPaystackWebhookEventService";

let paystackWebhookWorker: Worker | null = null;

export const initializeWorkers = () => {

    if (!paystackWebhookWorker) {
        console.log("🚀 Initializing Paystack Webhook Worker...");

        paystackWebhookWorker = new Worker(
            "paystack-webhook-queue",
            async (job:Job) => {
                console.log(`➡️ Processing Paddle Webhook Event: ${job.id}`);
                const { eventId } = job.data;
                return await processPaystackWebhookEventService(eventId);
            },
            { connection }
        );

        paystackWebhookWorker.on("completed", (job) =>
            console.log(`✅ Paystack Webhook Job ${job.id} completed!`)
        );

        // @ts-ignore
        paystackWebhookWorker.on("failed", (job, err) =>
            //@ts-ignore
            console.error(`❌ Paystack Webhook Job ${job.id} failed: ${err.message}`)
        );
    }
};
