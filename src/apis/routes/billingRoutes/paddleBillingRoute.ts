// src/routes/billingRoutes/customerPortalRoutes.ts
import express from "express";
import {
    getCustomerPortalController
} from "../../controllers/billingControllers/paddleBillingControllers/customerController/customerPortalController";
import {
    getProductsWithPricesController
} from "../../controllers/billingControllers/paddleBillingControllers/customerController/getProductsWithPricesService";
import {
    paddleWebhookController
} from "../../controllers/billingControllers/paddleBillingControllers/webhook/paddleWebhookController";
import {
    verifyPaddleIP
} from "../../services/billingServices/paddleBillingServices/webhookServices/verifyPaddleIPHandler";
import {
    getSubscriptionStatusController
} from "../../controllers/billingControllers/paddleBillingControllers/customerController/subscriptionStatusController";

const router = express.Router();

// http://localhost:5001/api/billling

/**
 * @route GET /api/billing/customer-portal/:customerId
 * @desc Get customer portal details
 * @access Public
 */
// router.get("/customer-portal", authenticateUser,getCustomerPortalController);
router.get("/products-with-prices", getProductsWithPricesController);

router.post("/webhook-paddl-subs",paddleWebhookController);
// router.post("/webhook-paddl-subs", verifyPaddleIP,paddleWebhookController);

// router.get("/subscription-status", authenticateUser, getSubscriptionStatusController);


export default router;
