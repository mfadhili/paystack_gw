// src/models/billingModels/paddleBillingModels/UsageModel.ts

import mongoose, { Schema, Document, Model } from "mongoose";

interface IUsage extends Document {
    accountId: mongoose.Types.ObjectId;
    productId: string;
    contactsUsed: number;
    // flowsUsed: number;
    broadcastsUsed: number;
    // inboxSeatsUsed: number;
    whatsappNumbersUsed: number;
    updatedAt: Date;
}

const UsageSchema = new Schema({
    accountId: { type: mongoose.Types.ObjectId, ref: "Account", required: true, unique: true },
    productId: { type: String, required: true },
    contactsUsed: { type: Number, default: 0 },
    // flowsUsed: { type: Number, default: 0 },
    broadcastsUsed: { type: Number, default: 0 },
    // inboxSeatsUsed: { type: Number, default: 0 },
    whatsappNumbersUsed: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

const UsageModel: Model<IUsage> = mongoose.model<IUsage>("Usage", UsageSchema);
export { IUsage, UsageModel };
