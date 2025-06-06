import mongoose, { Schema, Document } from 'mongoose';

export interface IBillingSubscription extends Document {
    subscriptionCode: string;
    emailToken: string;
    customerId: number;
    planId: number;
    integration: number;
    domain: string;
    status: string;
    start: number;
    quantity: number;
    amount: number;
    authorization: {
        authorizationCode: string;
        bin: string;
        last4: string;
        expMonth: string;
        expYear: string;
        channel: string;
        cardType: string;
        bank: string;
        countryCode: string;
        brand: string;
        reusable: boolean;
        signature: string;
        accountName?: string;
    };
    easyCronId?: string;
    cronExpression?: string;
    nextPaymentDate?: Date;
    openInvoice?: string;
    paystackSubscriptionId: number;
    createdAt: Date;
    updatedAt: Date;
}

const BillingSubscriptionSchema = new Schema<IBillingSubscription>({
    subscriptionCode: { type: String, required: true, unique: true },
    emailToken: { type: String, required: true },
    customerId: { type: Number, required: true },
    planId: { type: Number, required: true },
    integration: { type: Number, required: true },
    domain: { type: String, required: true },
    status: { type: String, required: true },
    start: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    amount: { type: Number, required: true },
    authorization: {
        authorizationCode: { type: String, required: true },
        bin: { type: String },
        last4: { type: String },
        expMonth: { type: String },
        expYear: { type: String },
        channel: { type: String },
        cardType: { type: String },
        bank: { type: String },
        countryCode: { type: String },
        brand: { type: String },
        reusable: { type: Boolean },
        signature: { type: String },
        accountName: { type: String }
    },
    easyCronId: { type: String },
    cronExpression: { type: String },
    nextPaymentDate: { type: Date },
    openInvoice: { type: String },
    paystackSubscriptionId: { type: Number, required: true, unique: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
});

export default mongoose.model<IBillingSubscription>('BillingSubscription', BillingSubscriptionSchema);
