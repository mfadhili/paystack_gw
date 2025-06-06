import {paystackWebhookQueue} from "../../../../../queues/billing/paystackWebhookQueue";
import {IPaystackWebhookEvent, PaystackWebhookEventModel}
    from "../../../../../models/billingModels/paystackBillingModels/PaystackWebhookEventModel";
import mongoose from "mongoose";


export const handlePaystackWebhookService = async (
    parsed: any,
): Promise<void> => {
    const saved: IPaystackWebhookEvent = await PaystackWebhookEventModel.create({
        event: parsed.event,
        data: parsed.data,
        receivedAt: new Date(),
        processed: false
    });

    const id = saved._id as unknown as mongoose.Types.ObjectId;

    // Queue for async processing
    await paystackWebhookQueue.add("paystack-webhook-queue", {
        eventId: id.toString()
    });
};
