import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoice extends Document {
    invoiceCode: string;
    domain: string;
    amount: number;
    status: 'success' | 'pending' | 'failed' | string;
    paid: boolean;
    paidAt?: Date;
    periodStart: Date;
    periodEnd: Date;
    description?: string;

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

    subscription: {
        status: string;
        subscriptionCode: string;
        emailToken?: string;
        amount: number;
        cronExpression: string;
        nextPaymentDate?: Date;
        openInvoice?: string;
    };

    customer: {
        id?: number;
        firstName?: string;
        lastName?: string;
        email: string;
        customerCode: string;
        phone?: string;
        metadata?: Record<string, any>;
        riskAction?: string;
    };

    transaction: {
        reference?: string;
        status?: string;
        amount?: number;
        currency?: string;
    };

    createdAt: Date;
    updatedAt: Date;
}

const BillingInvoiceSchema = new Schema<IInvoice>({
    invoiceCode: { type: String, required: true, unique: true },
    domain: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    paid: { type: Boolean, required: true },
    paidAt: { type: Date },

    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    description: { type: String },

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
        accountName: { type: String }
    },

    subscription: {
        status: { type: String },
        subscriptionCode: { type: String },
        emailToken: { type: String },
        amount: { type: Number },
        cronExpression: { type: String },
        nextPaymentDate: { type: Date },
        openInvoice: { type: String }
    },

    customer: {
        id: { type: Number },
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String, required: true },
        customerCode: { type: String, required: true },
        phone: { type: String },
        metadata: { type: Schema.Types.Mixed },
        riskAction: { type: String }
    },

    transaction: {
        reference: { type: String },
        status: { type: String },
        amount: { type: Number },
        currency: { type: String }
    },

    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
});

export default mongoose.model<IInvoice>('BillingInvoice', BillingInvoiceSchema);
