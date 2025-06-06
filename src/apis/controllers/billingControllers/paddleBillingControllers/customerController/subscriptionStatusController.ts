// src/apis/controllers/billingControllers/subscriptionStatusController.ts
import { Request, Response } from "express";
import {
    getSubscriptionStatusService
} from "../../../../services/billingServices/paddleBillingServices/customerServices/getSubscriptionStatusService";
import {AuthenticatedRequest} from "../../../../middlewares/authMiddleware/authenticateUser";

export const getSubscriptionStatusController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user; // From authenticateUser middleware
        const result = await getSubscriptionStatusService(user.account);

        return res.status(200).json({
            message: "Subscription status retrieved successfully",
            ...result,
        });
    } catch (error) {
        return res.status(404).json({
            message: (error as Error).message || "Subscription not found",
        });
    }
};
