// src/apis/services/billingServices/paddleBillingServices/webhookServices/processPaddleWebhookEventService.ts

import {processSubscriptionEvent} from "./subscriptionHandler";
import {PaddleWebhookEventModel} from "../../../../../models/billingModels/paddleBillingModels/webhookEventModel";

export const processPaddleWebhookEventService = async (eventId: string) => {
    const event = await PaddleWebhookEventModel.findById(eventId);
    if (!event) throw new Error("Webhook event not found");

    const { eventType, parsedData } = event as any;

    switch (eventType) {
        case "subscription.created":
        case "subscription.updated":
        case "subscription.cancelled":
        case "subscription.past_due":
        case "subscription.imported":
        case "subscription.activated":
        case "subscription.paused":
        case "subscription.resumed":
        case "subscription.trialing":
            await processSubscriptionEvent(eventType, parsedData);
            break;
/*
        case "transaction.completed":
        case "transaction.failed":
            await processTransactionEvent(eventType, payload);
            break;
        // Add more cases for events like payment_method, invoice, etc.
*/
        default:
            console.warn(`Unhandled Paddle event type: ${eventType}`);
            break;
    }
    // Mark as processed (optional)
    event.processed = true;
    event.processedAt = new Date();
    await event.save();

    return { message: "Webhook event processed", eventType };
};
