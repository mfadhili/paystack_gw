// src/models/billingModels/paddleBillingModels/ProductModel.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IProduct extends Document {
    id: string; // Paddle product ID
    name: string;
    tax_category: string;
    type: string;
    description: string;
    image_url: string;
    custom_data: Record<string, any> | null;
    status: string;
    import_meta: Record<string, any> | null;
    created_at: Date;
    updated_at: Date;
}

const ProductSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        tax_category: { type: String, required: true },
        type: { type: String, required: true }, // e.g., "standard"
        description: { type: String },
        image_url: { type: String },
        custom_data: { type: Schema.Types.Mixed, default: null },
        status: { type: String, required: true, enum: ["active", "inactive", "archived"] },
        import_meta: { type: Schema.Types.Mixed, default: null },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, required: true },
    },
    { timestamps: false } // Use the timestamps from Paddle instead
);

const ProductModel: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);
export { IProduct, ProductModel };
