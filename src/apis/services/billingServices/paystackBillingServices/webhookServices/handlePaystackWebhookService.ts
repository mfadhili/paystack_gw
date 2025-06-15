// src/apis/services/billingServices/paystackBillingServices/webhookServices/handlePaystackWebhookService.ts
import { paystackWebhookQueue } from "../../../../../queues/billing/paystackWebhookQueue";
import {
    IPaystackWebhookEvent,
    PaystackWebhookEventModel
} from "../../../../../models/billingModels/paystackBillingModels/PaystackWebhookEventModel";
import mongoose from "mongoose";

export const handlePaystackWebhookService = async (parsed: any): Promise<void> => {
    console.log(`[Webhook] Received Paystack event: ${parsed.event}`);

    const saved: IPaystackWebhookEvent = await PaystackWebhookEventModel.create({
        event: parsed.event,
        data: parsed.data,
        receivedAt: new Date(),
        processed: false
    });

    const id = saved._id as unknown as mongoose.Types.ObjectId;

    console.log(`[Webhook] Saved event ${parsed.event} with ID: ${id.toString()}`);

    // Queue for async processing
    await paystackWebhookQueue.add("paystack-webhook-queue", {
        eventId: id.toString()
    });

    console.log(`[Webhook] Queued event ${parsed.event} for processing`);
};
