import mongoose, {Document, Model, Schema} from 'mongoose';

interface IPaystackWebhookEvent extends Document {
    event: string;
    data: Record<string, any>;
    receivedAt: Date;
    processed: boolean;
    retries?: number;
    processedAt: Date
}

const PaystackWebhookEventSchema = new Schema({
    event: { type: String, required: true }, // e.g. charge.success, invoice.create
    data: { type: Schema.Types.Mixed, required: true },
    receivedAt: { type: Date, default: Date.now },
    processed: { type: Boolean, default: false },
    retries: { type: Number, default: 0 },
    processedAt: { type: Date, default: null },
});


const PaystackWebhookEventModel : Model<IPaystackWebhookEvent> = mongoose.model<IPaystackWebhookEvent>(
    'PaystackWebhookEvent',
    PaystackWebhookEventSchema
);

export { PaystackWebhookEventModel, IPaystackWebhookEvent };
