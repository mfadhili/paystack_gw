// src/controllers/billingControllers/productPriceController.ts

import { Request, Response } from "express";
import {
    getProductsWithPricesService
} from "../../../../services/billingServices/paddleBillingServices/customerServices/getProductsWithPricesService";

export const getProductsWithPricesController = async (_req: Request, res: Response) => {
    try {
        const data = await getProductsWithPricesService();

        return res.status(200).json({
            success: true,
            message: "Fetched all active products with their prices",
            data,
        });
    } catch (error: any) {
        console.error("Error fetching products and prices:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
