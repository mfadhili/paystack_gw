// src/models/billing/PaystackBillingTransactionModel.ts
import mongoose, { Schema, Document } from "mongoose";

interface IPaystackBillingTransaction extends Document {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    customer: {
        id: number;
        email: string;
        customerCode: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
    };
    channel: string;
    gatewayResponse: string;
    paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
    fees?: number;
    integration: number;
    domain: string;
    authorization?: {
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
}

const PaystackBillingTransactionSchema = new Schema<IPaystackBillingTransaction>({
    reference: { type: String, required: true, unique: true },
    status: { type: String, required: true }, // success, failed, etc.
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" },
    customer: {
        id: { type: Number, required: true },
        email: { type: String, required: true },
        customerCode: { type: String, required: true },
        firstName: { type: String },
        lastName: { type: String },
        phone: { type: String },
    },
    channel: { type: String },
    gatewayResponse: { type: String },
    paidAt: { type: Date },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    metadata: { type: Schema.Types.Mixed },
    fees: { type: Number },
    integration: { type: Number, required: true },
    domain: { type: String, required: true },
    authorization: {
        authorizationCode: { type: String },
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
        accountName: { type: String },
    },
});

const PaystackBillingTransactionModel = mongoose.model<IPaystackBillingTransaction>(
    "PaystackBillingTransaction",
    PaystackBillingTransactionSchema
);

export { PaystackBillingTransactionModel, IPaystackBillingTransaction };
