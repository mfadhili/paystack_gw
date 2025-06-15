// src/apis/services/billingServices/paystackBillingServices/planServices/fetchPaystackPlansService.ts
import axios from "axios";
import { PAYSTACK_SECRET_KEY } from "../../../../../config/config";
import PaystackBillingPlanModel
    , {IPaystackBillingPlan} from "../../../../../models/billingModels/paystackBillingModels/PaystackBillingPlanModel";


export const fetchAndStorePaystackPlans = async (): Promise<void> => {
    try {
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await axios.get("https://api.paystack.co/plan", {
                headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
                params: { page, perPage: 50 }
            });

            const plans: any[] = response.data?.data || [];

            for (const plan of plans) {
                const existing = await PaystackBillingPlanModel.findOne({ planCode: plan.plan_code });

                const payload: Partial<IPaystackBillingPlan> = {
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
                    await PaystackBillingPlanModel.updateOne({ planCode: plan.plan_code }, payload);
                } else {
                    await PaystackBillingPlanModel.create(payload);
                }
            }

            const { page: currentPage, pageCount } = response.data.meta;
            hasMore = currentPage < pageCount;
            page++;
        }

        console.log(`[PaystackPlanSync] Synced all plans`);
    } catch (error) {
        console.error(`[PaystackPlanSync] Failed to fetch plans`, error);
    }
};
