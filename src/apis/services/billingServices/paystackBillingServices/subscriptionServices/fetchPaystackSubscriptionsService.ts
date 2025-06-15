// src/apis/services/billingServices/paystackBillingServices/subscriptionServices/fetchPaystackSubscriptionsService.ts
import axios, { AxiosResponse } from 'axios';
import { PAYSTACK_SECRET_KEY } from '../../../../../config/config';
import PaystackBillingSubscriptionModel
    from "../../../../../models/billingModels/paystackBillingModels/PaystackBillingSubscriptionModel";
import {BillingSubscriptionStatusModel} from "../../../../../models/billingModels/BillingSubscriptionStatus";

interface PaystackCustomer {
    customer_code: string;
}

interface PaystackPlan {
    plan_code: string;
}

interface PaystackAuthorization {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name: string | null;
}

interface PaystackSubscription {
    subscription_code: string;
    email_token: string;
    customer: PaystackCustomer;
    plan: PaystackPlan;
    integration: number;
    domain: string;
    status: string;
    start: number;
    quantity: number;
    amount: number;
    authorization: PaystackAuthorization;
    easy_cron_id?: string | null;
    cron_expression?: string;
    next_payment_date?: string;
    open_invoice?: string | null;
    createdAt: string;
    updatedAt: string;
}

interface PaystackSubscriptionResponse {
    status: boolean;
    message: string;
    data: PaystackSubscription[];
    meta: {
        total: number;
        skipped: number;
        perPage: number;
        page: number;
        pageCount: number;
    };
}

export const fetchAndStorePaystackSubscriptions = async (): Promise<void> => {
    let page = 1;
    const perPage = 50;
    let hasMore = true;

    while (hasMore) {
        const response: AxiosResponse<PaystackSubscriptionResponse> = await axios.get('https://api.paystack.co/subscription', {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
            params: {
                perPage,
                page,
            },
        });

        const subscriptions = response.data.data;

        for (const sub of subscriptions) {
            await PaystackBillingSubscriptionModel.findOneAndUpdate(
                { paystackSubscriptionId: sub.subscription_code },
                {
                    subscriptionCode: sub.subscription_code,
                    emailToken: sub.email_token,
                    customerId: sub.customer.customer_code,
                    planId: sub.plan.plan_code,
                    integration: sub.integration,
                    domain: sub.domain,
                    status: sub.status,
                    start: sub.start,
                    quantity: sub.quantity,
                    amount: sub.amount,
                    authorization: {
                        authorizationCode: sub.authorization.authorization_code,
                        bin: sub.authorization.bin,
                        last4: sub.authorization.last4,
                        expMonth: sub.authorization.exp_month,
                        expYear: sub.authorization.exp_year,
                        channel: sub.authorization.channel,
                        cardType: sub.authorization.card_type,
                        bank: sub.authorization.bank,
                        countryCode: sub.authorization.country_code,
                        brand: sub.authorization.brand,
                        reusable: sub.authorization.reusable,
                        signature: sub.authorization.signature,
                        accountName: sub.authorization.account_name,
                    },
                    easyCronId: sub.easy_cron_id,
                    cronExpression: sub.cron_expression,
                    nextPaymentDate: sub.next_payment_date,
                    openInvoice: sub.open_invoice,
                    paystackSubscriptionId: sub.subscription_code,
                    createdAt: sub.createdAt,
                    updatedAt: sub.updatedAt,
                },
                { upsert: true, new: true }
            );

            await BillingSubscriptionStatusModel.findOneAndUpdate(
                { paymentGwCustomerId: sub.customer.customer_code },
                {
                    subscriptionId: sub.subscription_code,
                    subscriptionStatus: sub.status,
                    nextBillingDate: sub.next_payment_date,
                    // trialing: sub.status === "trialing",
                    // active: sub.status === "active",
                    syncedFromGatewayAt: new Date(),
                },
                { upsert: true, new: true }
            );
        }

        const { page: currentPage, pageCount } = response.data.meta;
        hasMore = currentPage < pageCount;
        page++;
    }

    console.log(`[PaystackSubscriptionSync] Synced all subscriptions`);
};
