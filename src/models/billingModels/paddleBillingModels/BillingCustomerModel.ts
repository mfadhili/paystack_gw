// src/models/billing/BillingCustomerModel.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IBillingCustomer extends Document {
    id: string; // Paddle customer ID
    status: string;
    custom_data: Record<string, any> | null;
    name: string;
    email: string;
    marketing_consent: boolean;
    locale: string;
    import_meta: Record<string, any> | null;
    created_at: Date;
    updated_at: Date;
}

const BillingCustomerSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true }, // Paddle customer ID
        status: { type: String, required: true, enum: ['active', 'inactive', 'past_due'] },
        custom_data: { type: Schema.Types.Mixed, default: null },
        name: { type: String, required: true },
        email: { type: String, required: true },
        marketing_consent: { type: Boolean, default: false },
        locale: { type: String, default: 'en' },
        import_meta: { type: Schema.Types.Mixed, default: null },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, required: true },
    },
    { timestamps: false } // Use timestamps from Paddle
);

const BillingCustomerModel: Model<IBillingCustomer> = mongoose.model<IBillingCustomer>('BillingCustomer', BillingCustomerSchema);
export { IBillingCustomer, BillingCustomerModel };
