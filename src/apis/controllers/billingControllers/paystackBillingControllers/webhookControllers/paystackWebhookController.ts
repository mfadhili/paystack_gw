import { Request, Response } from "express";
import crypto from "crypto";
import { PAYSTACK_SECRET_KEY } from "../../../../../config/config";
import {
    handlePaystackWebhookService
} from "../../../../services/billingServices/paystackBillingServices/webhookServices/handlePaystackWebhookService";

export const paystackWebhookController = async (req: Request, res: Response) => {
    try {
        await handlePaystackWebhookService(req.body); // Only pass parsed body
        res.sendStatus(200); // Acknowledge receipt
    } catch (err) {
        console.error("Paystack webhook error", err);
        res.status(400).json({ error: (err as Error).message });
    }
};
