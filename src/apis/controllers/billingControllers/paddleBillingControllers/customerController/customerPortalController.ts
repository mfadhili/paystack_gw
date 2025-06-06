// src/controllers/billingControllers/customerPortalController.ts

// src/controllers/billingControllers/customerPortalController.ts

import { Request, Response } from "express";
import { getCustomerPortalService } from "../../../../services/billingServices/paddleBillingServices/customerServices/customerPortalService";
// import {AuthenticatedRequest} from "../../../../middlewares/authMiddleware/authenticateUser";

export const getCustomerPortalController = async (req: Request, res: Response) => {
/*    const userId = req.user.id;
    const accountId = req.user.account;
    try {
        const portal = await getCustomerPortalService({ userId, accountId });

        // If no subscription but customer exists
        if (portal === null ) {
            return res.status(200).json({
                success: true,
                message: "Customer exists, but no subscription found. Proceed to checkout.",
                data: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Customer portal fetched successfully",
            data: portal,
        });
    } catch (error: any) {
        const status = error.statusCode || 500;
        return res.status(status).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }*/
};


/**
 * GET /api/billing/customer-portal/ctm_01gysfvfy7vqhpzkq8rjmrq7an
 *
 * {
 *   "data": {
 *     "id": "cpls_01h4ge9r64c22exjsx0fy8b48b",
 *     "customer": "64b8c8d5cbb7a731d4e1c9e7",
 *     "subscription": "64b8c8d5cbb7a731d4e1c9e8",
 *     "urls": {
 *       "general": {
 *         "overview": "https://customer-portal.paddle.com/cpl_01j7zbyqs3vah3aafp4jf62qaw?action=overview&token=pga..."
 *       },
 *       "subscriptions": [
 *         {
 *           "id": "sub_01h04vsc0qhwtsbsxh3422wjs4",
 *           "cancel_subscription": "https://customer-portal.paddle.com/cpl_01j7zbyqs3vah3aafp4jf62qaw?action=cancel_subscription...",
 *           "update_subscription_payment_method": "https://customer-portal.paddle.com/cpl_01j7zbyqs3vah3aafp4jf62qaw?action=update_subscription..."
 *         }
 *       ]
 *     },
 *     "created_at": "2024-10-25T06:53:58Z"
 *   }
 * }
 * */
