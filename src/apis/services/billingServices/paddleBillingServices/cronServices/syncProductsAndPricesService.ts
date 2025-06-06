import axios, { AxiosError } from "axios";
import {PADDLE_API_KEY, PADDLE_BASE_URL} from "../../../../../config/config";
import {ProductModel} from "../../../../../models/billingModels/paddleBillingModels/ProductModel";
import {PriceModel} from "../../../../../models/billingModels/paddleBillingModels/PriceModel";


export const syncProductsAndPrices = async () => {
    try {
        console.log("Starting Paddle product and price sync...");

        // Fetch Products
        const productResponse = await axios.get(`${PADDLE_BASE_URL}/products`, {
            headers: {
                Authorization: `Bearer ${PADDLE_API_KEY}`,
                Accept: "application/json",
            },
        });

        const products = productResponse.data.data;

        for (const product of products) {
            await ProductModel.updateOne(
                { id: product.id },
                {
                    $set: {
                        name: product.name,
                        tax_category: product.tax_category,
                        type: product.type,
                        description: product.description,
                        image_url: product.image_url,
                        custom_data: product.custom_data,
                        status: product.status,
                        import_meta: product.import_meta,
                        created_at: product.created_at,
                        updated_at: product.updated_at,
                    },
                },
                { upsert: true } // Insert if not found
            );
        }

        console.log("Products synced successfully.");

        // Fetch Prices
        const priceResponse = await axios.get(`${PADDLE_BASE_URL}/prices`, {
            headers: {
                Authorization: `Bearer ${PADDLE_API_KEY}`,
                Accept: "application/json",
            },
        });

        const prices = priceResponse.data.data;

        for (const price of prices) {
            await PriceModel.updateOne(
                { id: price.id },
                {
                    $set: {
                        product_id: price.product_id,
                        type: price.type,
                        description: price.description,
                        name: price.name,
                        billing_cycle: price.billing_cycle,
                        trial_period: price.trial_period,
                        tax_mode: price.tax_mode,
                        unit_price: price.unit_price,
                        unit_price_overrides: price.unit_price_overrides,
                        custom_data: price.custom_data,
                        status: price.status,
                        quantity: price.quantity,
                        import_meta: price.import_meta,
                        created_at: price.created_at,
                        updated_at: price.updated_at,
                    },
                },
                { upsert: true } // Insert if not found
            );
        }

        console.log("Prices synced successfully.");
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            console.error("Error syncing products and prices from Paddle:", err.response?.data || err.message);
        } else if (err instanceof Error) {
            console.error("Error syncing products and prices:", err.message);
        } else {
            console.error("Unknown error occurred while syncing products and prices.");
        }
        throw err; // Re-throw the error for handling elsewhere
    }
};
