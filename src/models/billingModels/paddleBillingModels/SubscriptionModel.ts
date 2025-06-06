// src/models/billingModels/SubscriptionModel.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface ISubscriptionItemPrice {
    id: string;
    product_id: string;
    type: string; // e.g., "standard"
    description: string;
    name: string;
    tax_mode: string; // e.g., "account_setting"
    billing_cycle: {
        frequency: number;
        interval: string; // e.g., "month", "year"
    };
    trial_period: {
        interval: string;
        frequency: number;
    } | null;
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

interface ISubscriptionItem {
    status: string;
    quantity: number;
    recurring: boolean;
    created_at: Date;
    updated_at: Date;
    previously_billed_at: Date | null;
    next_billed_at: Date | null;
    trial_dates: Record<string, any> | null;
    price: ISubscriptionItemPrice;
    product: {
        id: string;
        name: string;
        type: string; // e.g., "standard"
        tax_category: string;
        description: string;
        image_url: string;
        custom_data: Record<string, any> | null;
        status: string;
        import_meta: Record<string, any> | null;
        created_at: Date;
        updated_at: Date;
    };
}

interface ISubscription extends Document {
    id: string; // Subscription ID
    status: string;
    customer: string; // Reference to the BillingCustomer
    address_id: string; // Associated address ID
    business: mongoose.Types.ObjectId | null; // Optional reference to a Business
    currency_code: string; // e.g., "USD"
    created_at: Date;
    updated_at: Date;
    started_at: Date;
    first_billed_at: Date | null;
    next_billed_at: Date | null;
    paused_at: Date | null;
    canceled_at: Date | null;
    collection_mode: string; // e.g., "automatic"
    billing_details: Record<string, any> | null;
    current_billing_period: {
        starts_at: Date;
        ends_at: Date;
    };
    billing_cycle: {
        frequency: number;
        interval: string; // e.g., "month", "year"
    };
    scheduled_change: Record<string, any> | null;
    items: ISubscriptionItem[];
    custom_data: Record<string, any> | null;
    management_urls: {
        update_payment_method: string;
        cancel: string;
    };
    discount: Record<string, any> | null;
    import_meta: Record<string, any> | null;
}

const SubscriptionItemPriceSchema: Schema = new Schema(
    {
        id: { type: String, required: false },
        product_id: { type: String, required: false },
        type: { type: String, required: false },
        description: { type: String },
        name: { type: String, required: false },
        tax_mode: { type: String, required: false },
        billing_cycle: {
            frequency: { type: Number, required: false },
            interval: { type: String, required: false },
        },
        trial_period: {
            interval: { type: String, required: false },
            frequency: { type: Number, required: false },
        },
        unit_price: {
            amount: { type: String, required: false },
            currency_code: { type: String, required: false },
        },
        unit_price_overrides: { type: [Schema.Types.Mixed], default: [] },
        custom_data: { type: Schema.Types.Mixed, default: null },
        status: { type: String, required: false },
        quantity: {
            minimum: { type: Number, required: false },
            maximum: { type: Number, required: false },
        },
        import_meta: { type: Schema.Types.Mixed, default: null },
        created_at: { type: Date, required: false },
        updated_at: { type: Date, required: false },
    },
    { _id: false } // Prevent a separate _id for sub-documents
);

const SubscriptionItemSchema: Schema = new Schema(
    {
        status: { type: String, required: false },
        quantity: { type: Number, required: false },
        recurring: { type: Boolean, required: false },
        created_at: { type: Date, required: false },
        updated_at: { type: Date, required: false },
        previously_billed_at: { type: Date, default: null },
        next_billed_at: { type: Date, default: null },
        trial_dates: { type: Schema.Types.Mixed, default: null },
        price: { type: SubscriptionItemPriceSchema, required: false },
        product: {
            id: { type: String, required: false },
            name: { type: String, required: false },
            type: { type: String, required: false },
            tax_category: { type: String, required: false },
            description: { type: String },
            image_url: { type: String },
            custom_data: { type: Schema.Types.Mixed, default: null },
            status: { type: String, required: false },
            import_meta: { type: Schema.Types.Mixed, default: null },
            created_at: { type: Date, required: false },
            updated_at: { type: Date, required: false },
        },
    },
    { _id: false } // Prevent a separate _id for sub-documents
);

const SubscriptionSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        status: { type: String, required: true },
        customer: { type: String, required: true },
        address_id: { type: String, required: false },
        business: { type: mongoose.Types.ObjectId, ref: "Business", default: null },
        currency_code: { type: String, required: false },
        created_at: { type: Date, required: false },
        updated_at: { type: Date, required: false },
        started_at: { type: Date, required: false },
        first_billed_at: { type: Date, default: null },
        next_billed_at: { type: Date, default: null },
        paused_at: { type: Date, default: null },
        canceled_at: { type: Date, default: null },
        collection_mode: { type: String, required: false }, // e.g., "automatic"
        billing_details: { type: Schema.Types.Mixed, default: null },
        current_billing_period: {
            starts_at: { type: Date, required: false },
            ends_at: { type: Date, required: false },
        },
        billing_cycle: {
            frequency: { type: Number, required: false },
            interval: { type: String, required: false },
        },
        scheduled_change: { type: Schema.Types.Mixed, default: null },
        items: { type: [SubscriptionItemSchema], required: false },
        custom_data: { type: Schema.Types.Mixed, default: null },
        management_urls: {
            update_payment_method: { type: String, required: false },
            cancel: { type: String, required: false },
        },
        discount: { type: Schema.Types.Mixed, default: null },
        import_meta: { type: Schema.Types.Mixed, default: null },
    },
    { timestamps: false } // Use Paddle's timestamps
);

const SubscriptionModel: Model<ISubscription> = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export { ISubscription, SubscriptionModel };
