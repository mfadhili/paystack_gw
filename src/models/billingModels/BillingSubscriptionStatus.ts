// models/billingModels/BillingSubscriptionStatusModel.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IBillingSubscriptionStatus extends Document {
    billingCustomerId: string| null;
    paymentGwCustomerId: string| null;
    subscriptionId: string | null;
    subscriptionStatus: string | null;
    nextBillingDate?: Date;
    trialing: boolean;
    active: boolean;
    syncedFromGatewayAt?: Date;
    updatedAt: Date;
    createdAt: Date;
}

const BillingSubscriptionStatusSchema = new Schema({
    billingCustomerId: { type: String, default: null },
    paymentGwCustomerId: { type: String, default: null },
    subscriptionId: { type: String, default: null },
    subscriptionStatus: { type: String, default: null },
    nextBillingDate: { type: Date },
    trialing: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    syncedFromGatewayAt: { type: Date },
}, { timestamps: true });

export const BillingSubscriptionStatusModel = mongoose.model<IBillingSubscriptionStatus>(
    "BillingSubscriptionStatus",
    BillingSubscriptionStatusSchema
);
