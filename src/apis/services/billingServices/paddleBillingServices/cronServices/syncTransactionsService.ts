// src/apis/services/billingServices/paddleBillingServices/syncTransactionsService.ts

import axios, { AxiosError } from "axios";
import {PADDLE_API_KEY, PADDLE_BASE_URL} from "../../../../../config/config";
import {BillingCustomerModel} from "../../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";
import {SubscriptionModel} from "../../../../../models/billingModels/paddleBillingModels/SubscriptionModel";
import {TransactionModel} from "../../../../../models/billingModels/paddleBillingModels/TransactionModel";


export const syncTransactions = async () => {
    let url = `${PADDLE_BASE_URL}/transactions`;

    try {
        while (url) {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${PADDLE_API_KEY}`,
                    Accept: "application/json",
                },
            });

            const { data, meta } = response.data;

            for (const txn of data) {
                const customer = await BillingCustomerModel.findOne({ id: txn.customer_id });
                if (!customer) {
                    console.warn(`Skipping transaction ${txn.id}: Billing customer ${txn.customer_id} not found`);
                    continue;
                }

                const subscription = await SubscriptionModel.findOne({ id: txn.subscription_id });
                if (!subscription) {
                    console.warn(`Skipping transaction ${txn.id}: Subscription ${txn.subscription_id} not found`);
                    continue;
                }

                await TransactionModel.updateOne(
                    { id: txn.id },
                    {
                        $set: {
                            status: txn.status,
                            customer: customer._id,
                            address_id: txn.address_id,
                            business: txn.business_id || null,
                            custom_data: txn.custom_data || null,
                            origin: txn.origin,
                            collection_mode: txn.collection_mode,
                            subscription: subscription._id,
                            invoice_id: txn.invoice_id,
                            invoice_number: txn.invoice_number,
                            billing_details: txn.billing_details || null,
                            billing_period: txn.billing_period,
                            currency_code: txn.currency_code,
                            discount_id: txn.discount_id || null,
                            created_at: txn.created_at,
                            updated_at: txn.updated_at,
                            billed_at: txn.billed_at || null,
                            revised_at: txn.revised_at || null,
                            items: txn.items,
                            details: txn.details,
                            payments: txn.payments,
                            checkout: txn.checkout,
                        },
                    },
                    { upsert: true }
                );
            }

            url = meta.pagination?.has_more ? meta.pagination.next : null;
        }
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            console.error("Error syncing transactions from Paddle:", err.response?.data || err.message);
        } else if (err instanceof Error) {
            console.error("Error syncing transactions:", err.message);
        } else {
            console.error("Unknown error occurred while syncing transactions.");
        }
        throw err;
    }
};
