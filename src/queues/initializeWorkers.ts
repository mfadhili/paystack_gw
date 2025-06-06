import { Worker, Job } from "bullmq";
import { connection } from "../utils/queueUtils/connection";
import { processPaddleWebhookEventService } from "../apis/services/billingServices/paddleBillingServices/webhookServices/processPaddleWebhookEventService";
import {
    processPaystackWebhookEventService
} from "../apis/services/billingServices/paystackBillingServices/webhookServices/processPaystackWebhookEventService";

let paddleWebhookWorker: Worker | null = null;
let paystackWebhookWorker: Worker | null = null;

export const initializeWorkers = () => {
    if (!paddleWebhookWorker) {
        console.log("🚀 Initializing Paddle Webhook Worker...");

        paddleWebhookWorker = new Worker(
            "paddle-webhook-queue",
            async (job:Job) => {
                console.log(`➡️ Processing Paddle Webhook Event: ${job.id}`);
                const { eventId } = job.data;
                return await processPaddleWebhookEventService(eventId);
            },
            { connection }
        );

        paddleWebhookWorker.on("completed", (job) =>
            console.log(`✅ Paddle Webhook Job ${job.id} completed!`)
        );

        // @ts-ignore
        paddleWebhookWorker.on("failed", (job, err) =>
            //@ts-ignore
            console.error(`❌ Paddle Webhook Job ${job.id} failed: ${err.message}`)
        );
    }

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

        paddleWebhookWorker.on("completed", (job) =>
            console.log(`✅ Paddle Webhook Job ${job.id} completed!`)
        );

        // @ts-ignore
        paddleWebhookWorker.on("failed", (job, err) =>
            //@ts-ignore
            console.error(`❌ Paddle Webhook Job ${job.id} failed: ${err.message}`)
        );
    }
};
