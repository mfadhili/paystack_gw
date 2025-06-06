// src/models/billing/PriceModel.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IPrice extends Document {
    id: string; // Paddle price ID
    product_id: string; // Reference to the product ID
    type: string;
    description: string;
    name: string;
    billing_cycle: {
        interval: string;
        frequency: number;
    };
    trial_period: {
        interval: { type: String, required: false },
        frequency: { type: Number, required: false },
    },
    tax_mode: string;
    unit_price: {
        amount: string;
        currency_code: string;
    };
    unit_price_overrides: Array<Record<string, any>>;
    custom_data: Record<string, any> | null;
    status: string;
    quantity: {
        minimum: number;
        maximum: number;
    };
    import_meta: Record<string, any> | null;
    created_at: Date;
    updated_at: Date;
}

const PriceSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        product_id: { type: String, required: true, ref: "Product" },
        type: { type: String, required: true }, // e.g., "standard"
        description: { type: String },
        name: { type: String, required: true },
        billing_cycle: {
            interval: { type: String, required: true }, // e.g., "year", "month"
            frequency: { type: Number, required: true }, // e.g., 1
        },
        trial_period: {
            interval: { type: String, required: false },
            frequency: { type: Number, required: false },
        }, // Updated here
        tax_mode: { type: String, required: true }, // e.g., "account_setting"
        unit_price: {
            amount: { type: String, required: true },
            currency_code: { type: String, required: true },
        },
        unit_price_overrides: { type: [Schema.Types.Mixed], default: [] },
        custom_data: { type: Schema.Types.Mixed, default: null },
        status: { type: String, required: true, enum: ["active", "inactive"] },
        quantity: {
            minimum: { type: Number, required: true },
            maximum: { type: Number, required: true },
        },
        import_meta: { type: Schema.Types.Mixed, default: null },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, required: true },
    },
    { timestamps: false } // Use the timestamps from Paddle instead
);

const PriceModel: Model<IPrice> = mongoose.model<IPrice>("Price", PriceSchema);
export { IPrice, PriceModel };
