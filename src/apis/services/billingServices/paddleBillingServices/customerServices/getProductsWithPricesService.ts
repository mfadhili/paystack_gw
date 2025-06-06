// src/services/billingServices/paddleBillingServices/getProductsWithPricesService.ts
import {PriceModel} from "../../../../../models/billingModels/paddleBillingModels/PriceModel";
import {ProductModel} from "../../../../../models/billingModels/paddleBillingModels/ProductModel";

export const getProductsWithPricesService = async () => {
    const products = await ProductModel.find({ status: "active" }).lean();

    const productIds = products.map((p) => p.id);

    const prices = await PriceModel.find({ product_id: { $in: productIds }, status: "active" }).lean();

    // Group prices by product_id
    const pricesByProductId = prices.reduce((acc: Record<string, any[]>, price) => {
        if (!acc[price.product_id]) acc[price.product_id] = [];
        acc[price.product_id].push(price);
        return acc;
    }, {});

    // Merge prices into corresponding product
    const compiled = products.map((product) => ({
        ...product,
        prices: pricesByProductId[product.id] || [],
    }));

    return compiled;
};
