import {PaddleWebhookEventModel} from "../../../../../models/billingModels/paddleBillingModels/webhookEventModel";
import {paddleWebhookQueue} from "../../../../../queues/billing/paddleWebhookQueue";


export const handlePaddleWebhookService = async (
    parsed: any
): Promise<{ success?: boolean; ignored?: boolean }> => {
    if (!parsed.event_type?.startsWith("subscription.")) {
        return { ignored: true };
    }

    const saved = await PaddleWebhookEventModel.create({
        eventId: parsed.event_id,
        eventType: parsed.event_type,
        notificationId: parsed.notification_id,
        occurredAt: new Date(parsed.occurred_at),
        rawBody: JSON.stringify(parsed),
        parsedData: parsed,
    });

    // Enqueue for processing
    await paddleWebhookQueue.add("paddle-webhook-queue", {
        eventId: saved._id.toString(),
    });

    return { success: true };
};