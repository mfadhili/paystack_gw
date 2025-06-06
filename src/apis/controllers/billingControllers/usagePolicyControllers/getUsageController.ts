// src/controllers/billingControllers/paddleBillingControllers/usageController.ts

import { Request, Response } from "express";
// import {AuthenticatedRequest} from "../../../middlewares/authMiddleware/authenticateUser";
import {getUsageService} from "../../../services/billingServices/usagePolicyServices/getUsageService";

export const getUsageController = async (req: Request, res: Response) => {
/*    try {
        const accountId = req.user.account; // 🔐 assuming it's attached by `authenticateRequest`

        const usage = await getUsageService({ accountId });

        return res.status(200).json({
            success: true,
            message: "Usage data retrieved successfully",
            data: usage,
        });
    } catch (error: any) {
        console.error("❌ Error in getUsageController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve usage data",
        });
    }*/
};
