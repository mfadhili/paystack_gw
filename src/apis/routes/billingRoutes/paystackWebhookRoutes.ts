import express from "express";
import {
    paystackWebhookController
} from "../../controllers/billingControllers/paystackBillingControllers/webhookControllers/paystackWebhookController";
import {
    createBillingCustomerController
} from "../../controllers/billingControllers/paystackBillingControllers/customersControllers/createBillingCustomerController";
import {
    getBillingCustomerByIdController
} from "../../controllers/billingControllers/paystackBillingControllers/customersControllers/getBillingCustomerByIdController";

const router = express.Router();

// POST /api/billing/webhook-paystack
router.post("/webhook-paystack-qwsa", paystackWebhookController);

router.post('/create-customer', createBillingCustomerController);
router.post('/get-customer/:id', getBillingCustomerByIdController);



export default router;
