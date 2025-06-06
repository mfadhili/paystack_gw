// src/apis/services/billingServices/paddleBillingServices/syncSubscriptionsService.ts

import axios, { AxiosError } from "axios";
import {SubscriptionModel} from "../../../../../models/billingModels/paddleBillingModels/SubscriptionModel";
import {BillingCustomerModel} from "../../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";
import {PADDLE_API_KEY, PADDLE_BASE_URL} from "../../../../../config/config";


export const syncSubscriptions = async () => {
    let url = `${PADDLE_BASE_URL}/subscriptions`;

    try {
        while (url) {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${PADDLE_API_KEY}`,
                    Accept: "application/json",
                },
            });

            const { data, meta } = response.data;

            for (const sub of data) {
                const customer = await BillingCustomerModel.findOne({ id: sub.customer_id });

                if (!customer) {
                    console.warn(`Skipping subscription ${sub.id}: Billing customer ${sub.customer_id} not found`);
                    continue;
                }

                await SubscriptionModel.updateOne(
                    { id: sub.id },
                    {
                        $set: {
                            status: sub.status,
                            customer: sub.customer_id,
                            address_id: sub.address_id,
                            business: sub.business_id || null,
                            currency_code: sub.currency_code,
                            created_at: sub.created_at,
                            updated_at: sub.updated_at,
                            started_at: sub.started_at,
                            first_billed_at: sub.first_billed_at,
                            next_billed_at: sub.next_billed_at,
                            paused_at: sub.paused_at,
                            canceled_at: sub.canceled_at,
                            collection_mode: sub.collection_mode,
                            billing_details: sub.billing_details || null,
                            current_billing_period: sub.current_billing_period,
                            billing_cycle: sub.billing_cycle,
                            scheduled_change: sub.scheduled_change || null,
                            items: sub.items,
                            custom_data: sub.custom_data || null,
                            management_urls: sub.management_urls,
                            discount: sub.discount || null,
                            import_meta: sub.import_meta || null,
                        },
                    },
                    { upsert: true }
                );
            }

            url = meta.pagination?.has_more ? meta.pagination.next : null;
        }
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            console.error("Error syncing subscriptions from Paddle:", err.response?.data || err.message);
        } else if (err instanceof Error) {
            console.error("Error syncing subscriptions:", err.message);
        } else {
            console.error("Unknown error occurred while syncing subscriptions.");
        }
        throw err;
    }
};
