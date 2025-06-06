// src/apis/routes/index.ts
import { Express } from 'express';

import usagePolicyRoute from "./billingRoutes/usagePolicyRoute";
import paystackWebhookRoutes from "./billingRoutes/paystackWebhookRoutes";


// http://localhost:5041/paystack

export const setupRoutes = (app: Express) => {

    // app.use('/pay/billing', paddleBillingRoute);
    app.use('/paystack/billing', paystackWebhookRoutes);
    app.use('/paystack/usage', usagePolicyRoute);
    app.get('/paystack/test', (req, res) => {
        res.send('Live test OK!');
    });
};
