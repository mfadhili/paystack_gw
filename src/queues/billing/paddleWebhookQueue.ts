import { Queue } from "bullmq";
import {connection} from "../../utils/queueUtils/connection";

export const paddleWebhookQueue = new Queue("paddle-webhook-queue", {
    connection,
});
