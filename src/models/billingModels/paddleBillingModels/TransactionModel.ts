// src/models/billingModels/TransactionModel.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface ITransactionPrice {
    id: string;
    description: string;
    type: string;
    name: string;
    product_id: string;
    billing_cycle: {
        interval: string;
        frequency: number;
    } | null;
    trial_period: number | null;
    tax_mode: string;
    unit_price: {
        amount: string;
        currency_code: string;
    };
    unit_price_overrides: Array<Record<string, any>>;
    custom_data: Record<string, any> | null;
    quantity: {
        minimum: number;
        maximum: number;
    };
    status: string;
    created_at: Date;
    updated_at: Date;
}

interface ITransactionItem {
    price: ITransactionPrice;
    quantity: number;
}

interface ITransactionDetails {
    tax_rates_used: Array<{
        tax_rate: string;
        totals: {
            subtotal: string;
            discount: string;
            tax: string;
            total: string;
        };
    }>;
    totals: {
        subtotal: string;
        tax: string;
        discount: string;
        total: string;
        grand_total: string;
        fee: string;
        credit: string;
        credit_to_balance: string;
        balance: string;
        earnings: string;
        currency_code: string;
    };
    adjusted_totals: {
        subtotal: string;
        tax: string;
        total: string;
        grand_total: string;
        fee: string;
        earnings: string;
        currency_code: string;
    };
    payout_totals: {
        subtotal: string;
        tax: string;
        discount: string;
        total: string;
        credit: string;
        credit_to_balance: string;
        balance: string;
        grand_total: string;
        fee: string;
        earnings: string;
        currency_code: string;
    };
    adjusted_payout_totals: {
        subtotal: string;
        tax: string;
        total: string;
        fee: string;
        chargeback_fee: {
            amount: string;
            original: any;
        };
        earnings: string;
        currency_code: string;
    };
    line_items: Array<{
        id: string;
        price_id: string;
        quantity: number;
        totals: {
            subtotal: string;
            tax: string;
            discount: string;
            total: string;
        };
        product: {
            id: string;
            name: string;
            description: string;
            type: string;
            tax_category: string;
            image_url: string;
            custom_data: Record<string, any> | null;
            status: string;
            created_at: Date;
            updated_at: Date;
            import_meta: Record<string, any> | null;
        };
        tax_rate: string;
        unit_totals: {
            subtotal: string;
            tax: string;
            discount: string;
            total: string;
        };
    }>;
}

interface IPayment {
    payment_attempt_id: string;
    stored_payment_method_id: string;
    payment_method_id: string;
    amount: string;
    status: string;
    error_code: string | null;
    method_details: {
        type: string;
        card: {
            type: string;
            last4: string;
            expiry_month: number;
            expiry_year: number;
            cardholder_name: string;
        };
    };
    created_at: Date;
    captured_at: Date | null;
}

interface ITransaction extends Document {
    id: string;
    status: string;
    customer: mongoose.Types.ObjectId; // Reference to the BillingCustomer
    address_id: string; // Associated address ID
    business: mongoose.Types.ObjectId | null; // Optional reference to a Business
    custom_data: Record<string, any> | null;
    origin: string; // e.g., "web"
    collection_mode: string; // e.g., "automatic"
    subscription: mongoose.Types.ObjectId; // Reference to the Subscription
    invoice_id: string;
    invoice_number: string;
    billing_details: Record<string, any> | null;
    billing_period: {
        starts_at: Date;
        ends_at: Date;
    };
    currency_code: string; // e.g., "USD"
    discount_id: string | null;
    created_at: Date;
    updated_at: Date;
    billed_at: Date | null;
    revised_at: Date | null;
    items: ITransactionItem[];
    details: ITransactionDetails;
    payments: IPayment[];
    checkout: {
        url: string;
    };
}

const TransactionPriceSchema: Schema = new Schema(
    {
        id: { type: String, required: true },
        description: { type: String },
        type: { type: String, required: true },
        name: { type: String, required: true },
        product_id: { type: String, required: true },
        billing_cycle: {
            interval: { type: String },
            frequency: { type: Number },
        },
        trial_period: { type: Number, default: null },
        tax_mode: { type: String, required: false },
        unit_price: {
            amount: { type: String, required: false },
            currency_code: { type: String, required: false },
        },
        unit_price_overrides: { type: [Schema.Types.Mixed], default: [] },
        custom_data: { type: Schema.Types.Mixed, default: null },
        quantity: {
            minimum: { type: Number, required: false },
            maximum: { type: Number, required: false },
        },
        status: { type: String, required: false },
        created_at: { type: Date, required: false },
        updated_at: { type: Date, required: false },
    },
    { _id: false }
);

const TransactionItemSchema: Schema = new Schema(
    {
        price: { type: TransactionPriceSchema, required: false },
        quantity: { type: Number, required: false },
    },
    { _id: false }
);

const PaymentSchema: Schema = new Schema(
    {
        payment_attempt_id: { type: String, required: false },
        stored_payment_method_id: { type: String, required: false },
        payment_method_id: { type: String, required: false },
        amount: { type: String, required: false },
        status: { type: String, required: false },
        error_code: { type: String, default: null },
        method_details: {
            type: {
                type: String,
                required: false,
            },
            card: {
                type: { type: String, required: false },
                last4: { type: String, required: false },
                expiry_month: { type: Number, required: false },
                expiry_year: { type: Number, required: false },
                cardholder_name: { type: String, required: false },
            },
        },
        created_at: { type: Date, required: false },
        captured_at: { type: Date, default: null },
    },
    { _id: false }
);

const TransactionSchema: Schema = new Schema(
    {
        id: { type: String, required: false, unique: true },
        status: { type: String, required: false },
        customer: { type: mongoose.Types.ObjectId, ref: "BillingCustomer", required: false },
        address_id: { type: String, required: false },
        business: { type: mongoose.Types.ObjectId, ref: "Business", default: null },
        custom_data: { type: Schema.Types.Mixed, default: null },
        origin: { type: String, required: false },
        collection_mode: { type: String, required: false },
        subscription: { type: mongoose.Types.ObjectId, ref: "Subscription", required: false },
        invoice_id: { type: String, required: false },
        invoice_number: { type: String, required: false },
        billing_details: { type: Schema.Types.Mixed, default: null },
        billing_period: {
            starts_at: { type: Date, required: false },
            ends_at: { type: Date, required: false },
        },
        currency_code: { type: String, required: false },
        discount_id: { type: String, default: null },
        created_at: { type: Date, required: false },
        updated_at: { type: Date, required: false },
        billed_at: { type: Date, default: null },
        revised_at: { type: Date, default: null },
        items: { type: [TransactionItemSchema], required: false },
        details: { type: Schema.Types.Mixed, required: false },
        payments: { type: [PaymentSchema], required: false },
        checkout: {
            url: { type: String, required: true },
        },
    },
    { timestamps: false }
);

const TransactionModel: Model<ITransaction> = mongoose.model<ITransaction>("Transaction", TransactionSchema);

export { ITransaction, TransactionModel };
