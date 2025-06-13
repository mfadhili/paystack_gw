// src/controllers/billingControllers/paystackControllers/generateSubscriptionUpdateLinkController.ts

import { Request, Response } from "express";
import {
    generateSubscriptionUpdateLinkService
} from "../../../../services/billingServices/paystackBillingServices/subscriptionServices/generateSubscriptionUpdateLinkService";

export const generateSubscriptionUpdateLinkController = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Subscription code is required",
            });
        }

        const link = await generateSubscriptionUpdateLinkService(code);

        return res.status(200).json({
            success: true,
            message: "Link generated",
            data: { link },
        });
    } catch (error: any) {
        console.error("Error generating subscription link:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to generate subscription link",
        });
    }
};
