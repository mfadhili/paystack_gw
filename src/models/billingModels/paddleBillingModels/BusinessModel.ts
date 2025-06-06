// src/models/billingModels/BusinessModel.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface IContact {
    name: string;
    email: string;
}

interface IBusiness extends Document {
    id: string; // Business ID
    status: string; // e.g., "active"
    customer: mongoose.Types.ObjectId; // Reference to the BillingCustomer
    name: string; // Business name
    company_number: string; // Company registration number
    tax_identifier: string; // Tax identifier
    contacts: IContact[]; // List of contacts
    custom_data: Record<string, any> | null; // Custom metadata
    created_at: Date; // Business creation date
    updated_at: Date; // Business last updated date
    import_meta: Record<string, any> | null; // Metadata for imported data
}

const ContactSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
    { _id: false } // No separate ID for contact sub-documents
);

const BusinessSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true }, // Business ID from Paddle
        status: { type: String, required: true, enum: ["active", "inactive", "archived"] },
        customer: { type: mongoose.Types.ObjectId, ref: "BillingCustomer", required: true }, // Reference to BillingCustomer
        name: { type: String, required: true },
        company_number: { type: String, required: true },
        tax_identifier: { type: String, required: true },
        contacts: { type: [ContactSchema], default: [] },
        custom_data: { type: Schema.Types.Mixed, default: null },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, required: true },
        import_meta: { type: Schema.Types.Mixed, default: null },
    },
    { timestamps: false } // Use timestamps from Paddle
);

const BusinessModel: Model<IBusiness> = mongoose.model<IBusiness>("Business", BusinessSchema);

export { IBusiness, BusinessModel };


/**
 * const business = new BusinessModel({
 *     id: "biz_01hv8j0z17hv4ew8teebwjmfcb",
 *     status: "active",
 *     customer: billingCustomer._id, // Link to BillingCustomer
 *     name: "HighFly LLC.",
 *     company_number: "555829503785",
 *     tax_identifier: "555810433",
 *     contacts: [{ name: "Blair Lopez", email: "blair@example.com" }],
 *     created_at: new Date(),
 *     updated_at: new Date(),
 * });
 * await business.save();
 * */