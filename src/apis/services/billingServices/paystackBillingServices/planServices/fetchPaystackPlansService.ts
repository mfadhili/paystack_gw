import axios from "axios";
import { PAYSTACK_SECRET_KEY } from "../../../../../config/config";
import BillingPlanModel, {
    IBillingPlan
} from "../../../../../models/billingModels/paystackBillingModels/BillingPlanModel";

export const fetchAndStorePaystackPlans = async (): Promise<void> => {
    try {
        const response = await axios.get("https://api.paystack.co/plan", {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        });

        const plans: any[] = response.data?.data || [];

        for (const plan of plans) {
            const existing = await BillingPlanModel.findOne({ planCode: plan.plan_code });

            const payload: Partial<IBillingPlan> = {
                name: plan.name,
                description: plan.description,
                amount: plan.amount,
                interval: plan.interval,
                planCode: plan.plan_code,
                integration: plan.integration,
                domain: plan.domain,
                currency: plan.currency,
                sendInvoices: plan.send_invoices,
                sendSms: plan.send_sms,
                hostedPage: plan.hosted_page,
                hostedPageUrl: plan.hosted_page_url,
                hostedPageSummary: plan.hosted_page_summary,
                paystackPlanId: plan.id,
                createdAt: new Date(plan.createdAt),
                updatedAt: new Date(plan.updatedAt),
            };

            if (existing) {
                await BillingPlanModel.updateOne({ planCode: plan.plan_code }, payload);
            } else {
                await BillingPlanModel.create(payload);
            }
        }

        console.log(`[PaystackPlanSync] Synced ${plans.length} plans from Paystack`);
    } catch (error) {
        console.error(`[PaystackPlanSync] Failed to fetch plans`, error);
    }
};
