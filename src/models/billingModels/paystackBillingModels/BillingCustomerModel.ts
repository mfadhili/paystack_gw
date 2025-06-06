import mongoose, { Schema, Document } from 'mongoose';

export interface IBillingCustomer extends Document {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    metadata?: Record<string, any>;
    domain: string;
    customerCode: string;
    paystackCustomerId: number;
    integration: number;
    riskAction?: string;
    identified?: boolean;
    identifications?: any;
    authorizations?: {
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
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const BillingCustomerSchema: Schema<IBillingCustomer> = new Schema({
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    metadata: { type: Schema.Types.Mixed },
    domain: { type: String, required: true },
    customerCode: { type: String, required: true, unique: true },
    paystackCustomerId: { type: Number, required: true },
    integration: { type: Number, required: true },
    riskAction: { type: String },
    identified: { type: Boolean },
    identifications: { type: Schema.Types.Mixed },
    authorizations: [
        {
            authorizationCode: String,
            bin: String,
            last4: String,
            expMonth: String,
            expYear: String,
            channel: String,
            cardType: String,
            bank: String,
            countryCode: String,
            brand: String,
            reusable: Boolean,
            signature: String,
            accountName: String,
        },
    ],
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

export default mongoose.model<IBillingCustomer>('BillingCustomer', BillingCustomerSchema);
