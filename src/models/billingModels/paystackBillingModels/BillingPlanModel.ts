import mongoose, { Schema, Document } from 'mongoose';

export interface IBillingPlan extends Document {
    name: string;
    description?: string;
    amount: number;
    interval: 'daily' | 'weekly' | 'monthly' | 'annually' | string;
    planCode: string;
    integration: number;
    domain: string;
    currency: string;
    sendInvoices: boolean;
    sendSms: boolean;
    hostedPage: boolean;
    hostedPageUrl?: string;
    hostedPageSummary?: string;
    paystackPlanId: number;
    createdAt: Date;
    updatedAt: Date;
}

const BillingPlanSchema = new Schema<IBillingPlan>({
    name: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    interval: { type: String, required: true },
    planCode: { type: String, required: true, unique: true },
    integration: { type: Number, required: true },
    domain: { type: String, required: true },
    currency: { type: String, required: true },
    sendInvoices: { type: Boolean, default: false },
    sendSms: { type: Boolean, default: false },
    hostedPage: { type: Boolean, default: false },
    hostedPageUrl: { type: String },
    hostedPageSummary: { type: String },
    paystackPlanId: { type: Number, required: true, unique: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

export default mongoose.model<IBillingPlan>('BillingPlan', BillingPlanSchema);
