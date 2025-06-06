// src/models/billingModels/PaymentMethodModel.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface ICardDetails {
    cardholder_name: string;
    type: string; // e.g., "visa", "mastercard"
    last4: string; // Last 4 digits of the card
    expiry_month: number;
    expiry_year: number;
}

interface IPaymentMethod extends Document {
    id: string; // Payment method ID
    customer: mongoose.Types.ObjectId; // Reference to the BillingCustomer
    address_id: string; // Associated address ID
    type: string; // e.g., "card", "paypal"
    card: ICardDetails | null; // Card details if type is "card"
    paypal: Record<string, any> | null; // PayPal details (if applicable)
    origin: string; // Source of the payment method (e.g., "saved_during_purchase")
    saved_at: Date; // Date when the payment method was saved
    updated_at: Date; // Last updated timestamp
}

const CardDetailsSchema: Schema = new Schema(
    {
        cardholder_name: { type: String, required: true },
        type: { type: String, required: true }, // e.g., "visa", "mastercard"
        last4: { type: String, required: true },
        expiry_month: { type: Number, required: true },
        expiry_year: { type: Number, required: true },
    },
    { _id: false } // Prevent separate _id generation for the sub-document
);

const PaymentMethodSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true }, // Payment method ID
        customer: { type: mongoose.Types.ObjectId, ref: "BillingCustomer", required: true }, // Reference to BillingCustomer
        address_id: { type: String, required: true },
        type: { type: String, required: true, enum: ["card", "paypal"] },
        card: { type: CardDetailsSchema, default: null }, // Card details for card type
        paypal: { type: Schema.Types.Mixed, default: null }, // PayPal details for PayPal type
        origin: { type: String, required: true }, // e.g., "saved_during_purchase"
        saved_at: { type: Date, required: true },
        updated_at: { type: Date, required: true },
    },
    { timestamps: false } // Use Paddle's timestamps
);

const PaymentMethodModel: Model<IPaymentMethod> = mongoose.model<IPaymentMethod>(
    "PaymentMethod",
    PaymentMethodSchema
);

export { IPaymentMethod, PaymentMethodModel };

/**
 * const paymentMethod = new PaymentMethodModel({
 *     id: "paymtd_01j2jff1m3es31sdkejpaym164",
 *     customer: billingCustomer._id,
 *     address_id: "add_01j2jfab8zcjy524w6e4s1knjy",
 *     type: "card",
 *     card: {
 *         cardholder_name: "Sam Miller",
 *         type: "visa",
 *         last4: "4242",
 *         expiry_month: 5,
 *         expiry_year: 2025,
 *     },
 *     paypal: null,
 *     origin: "saved_during_purchase",
 *     saved_at: new Date("2024-07-12T03:23:26Z"),
 *     updated_at: new Date("2024-10-29T14:12:28.018Z"),
 * });
 * await paymentMethod.save();
 * */