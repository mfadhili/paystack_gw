// src/queues/bullMQ.ts
// src/queues/bullMQ.ts
import { createBullBoard } from "bull-board";
import { BullMQAdapter } from "bull-board/bullMQAdapter";
import { Express } from "express";
import {Queue} from "bullmq";
import {connection} from "../utils/queueUtils/connection";

// Setup BullMQ Dashboard
export const setupBullBoard = (app: Express) => {
    try {
        const { router } = createBullBoard([
            //@ts-ignore
            new BullMQAdapter(paddleWebhookQueue),

        ]);

        app.use("/api/admin/queues", router);
        console.log(`🚀 BullMQ Dashboard running at http://localhost:5057/api/admin/queues`);
    } catch (error) {
        console.error('Error setting up Bull Board:', error);

    }

};

export const paddleWebhookQueue = new Queue("paddle-webhook-queue", {
    connection
});
