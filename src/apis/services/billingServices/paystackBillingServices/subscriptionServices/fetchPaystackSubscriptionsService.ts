import axios from 'axios';
import { PAYSTACK_SECRET_KEY } from '../../../../../config/config';
import PaystackBillingSubscriptionModel
    from "../../../../../models/billingModels/paystackBillingModels/PaystackBillingSubscriptionModel";


export const fetchAndStorePaystackSubscriptions = async (): Promise<void> => {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await axios.get('https://api.paystack.co/subscription', {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
            params: {
                perPage: 50,
                page,
            },
        });

        const subscriptions = response.data.data;

        for (const sub of subscriptions) {
            await PaystackBillingSubscriptionModel.findOneAndUpdate(
                { paystackSubscriptionId: sub.id },
                {
                    subscriptionCode: sub.subscription_code,
                    emailToken: sub.email_token,
                    customerId: sub.customer.id,
                    planId: sub.plan.id,
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
                    paystackSubscriptionId: sub.id,
                    createdAt: sub.createdAt,
                    updatedAt: sub.updatedAt,
                },
                { upsert: true, new: true }
            );
        }

        hasMore = response.data.meta.page < response.data.meta.pageCount;
        page++;
    }
};
