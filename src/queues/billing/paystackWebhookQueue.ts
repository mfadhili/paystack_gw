import { Queue } from "bullmq";
import {connection} from "../../utils/queueUtils/connection";

export const paystackWebhookQueue = new Queue("paystack-webhook-queue", {
    connection: connection
});
