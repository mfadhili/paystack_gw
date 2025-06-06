import mongoose, { Schema } from 'mongoose';

const PaddleWebhookEventSchema = new Schema({
    eventId: { type: String, required: true, unique: true },
    eventType: { type: String, required: true },
    notificationId: { type: String, required: true },
    occurredAt: { type: Date, required: true },
    rawBody: { type: String, required: true },
    parsedData: { type: Object, required: true },
    processed: { type: Boolean, default: false },
    processedAt: { type: Date, default: null },
    error: { type: String, default: null },
}, { timestamps: true });

export const PaddleWebhookEventModel = mongoose.model('PaddleWebhookEvent', PaddleWebhookEventSchema);
