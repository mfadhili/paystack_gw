import { Request, Response } from "express";
import {
    handlePaddleWebhookService
} from "../../../../services/billingServices/paddleBillingServices/webhookServices/handlePaddleWebhookService";
import {PADDLE_WEBHOOK_SECRET_KEY} from "../../../../../config/config";

export const paddleWebhookController = async (req: Request, res: Response) => {
    try {
        const result = await handlePaddleWebhookService(req.body);

        if (result.ignored) return res.status(204).send(); // Ignored event

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Webhook processing error", err);
        return res.status(400).json({ error: (err as Error).message });
    }
};
