// src/models/billingModels/paddleBillingModels/UsagePolicyModel.ts

import mongoose, { Schema, Document, Model } from "mongoose";

interface IUsagePolicy extends Document {
    productId: string; // Paddle Product ID
    contactLimit: number;
    flowLimit: number;
    broadcastLimit: number;
    inboxSeats: number;
    whatsappNumberLimit: number;
}

const UsagePolicySchema = new Schema({
    productId: { type: String, required: true, unique: true },
    contactLimit: { type: Number, required: true },
    flowLimit: { type: Number, required: true },
    broadcastLimit: { type: Number, required: true },
    inboxSeats: { type: Number, required: true },
    whatsappNumberLimit: { type: Number, required: true },
});

const UsagePolicyModel: Model<IUsagePolicy> = mongoose.model<IUsagePolicy>("UsagePolicy", UsagePolicySchema);
export { IUsagePolicy, UsagePolicyModel };
