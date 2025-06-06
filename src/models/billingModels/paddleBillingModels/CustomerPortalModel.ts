// src/models/billingModels/CustomerPortalModel.ts

import mongoose, { Schema, Document, Model } from "mongoose";

interface ICustomerPortalUrls {
    general: {
        overview: string;
    };
    subscriptions: Array<{
        id: string;
        cancel_subscription: string;
        update_subscription_payment_method: string;
    }>;
}

interface ICustomerPortal extends Document {
    id: string; // Portal ID
    customer: mongoose.Types.ObjectId; // Reference to the BillingCustomer
    subscription: mongoose.Types.ObjectId; // Reference to the Subscription
    urls: ICustomerPortalUrls;
    created_at: Date;
}

const CustomerPortalUrlsSchema: Schema = new Schema(
    {
        general: {
            overview: { type: String, required: true },
        },
        subscriptions: [
            {
                id: { type: String, required: true },
                cancel_subscription: { type: String, required: true },
                update_subscription_payment_method: { type: String, required: true },
            },
        ],
    },
    { _id: false } // Prevents _id creation for subdocuments
);

const CustomerPortalSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true }, // Portal ID
        customer: { type: mongoose.Types.ObjectId, ref: "BillingCustomer", required: true },
        subscription: { type: mongoose.Types.ObjectId, ref: "Subscription", required: true },
        urls: { type: CustomerPortalUrlsSchema, required: true },
        created_at: { type: Date, required: true },
    },
    { timestamps: false } // Use the timestamps from the Paddle API
);

const CustomerPortalModel: Model<ICustomerPortal> = mongoose.model<ICustomerPortal>("CustomerPortal", CustomerPortalSchema);

export { ICustomerPortal, CustomerPortalModel };
