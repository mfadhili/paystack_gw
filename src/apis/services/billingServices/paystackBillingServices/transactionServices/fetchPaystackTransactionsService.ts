// src/apis/services/billingServices/paystackBillingServices/transactionServices/fetchPaystackTransactionsService.ts

import axios from "axios";
import { PAYSTACK_SECRET_KEY } from "../../../../../config/config";
import {
    BillingTransactionModel
} from "../../../../../models/billingModels/paystackBillingModels/BillingTransactionModel";

export const fetchAndStorePaystackTransactions = async () => {
    let page = 1;
    const perPage = 50;
    let hasMore = true;

    while (hasMore) {
        const res = await axios.get("https://api.paystack.co/transaction", {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            },
            params: {
                page,
                perPage
            }
        });

        const transactions = res.data.data;
        if (!transactions.length) break;

        for (const tx of transactions) {
            const update = {
                reference: tx.reference,
                status: tx.status,
                amount: tx.amount,
                currency: tx.currency,
                customer: {
                    id: tx.customer.id,
                    email: tx.customer.email,
                    customerCode: tx.customer.customer_code,
                    firstName: tx.customer.first_name,
                    lastName: tx.customer.last_name,
                    phone: tx.customer.phone
                },
                channel: tx.channel,
                gatewayResponse: tx.gateway_response,
                paidAt: tx.paid_at,
                createdAt: tx.created_at,
                updatedAt: tx.updated_at,
                metadata: tx.metadata,
                fees: tx.fees,
                integration: tx.integration,
                domain: tx.domain,
                authorization: tx.authorization || undefined
            };

            await BillingTransactionModel.findOneAndUpdate(
                { reference: tx.reference },
                update,
                { upsert: true, new: true }
            );
        }

        page++;
        hasMore = transactions.length === perPage;
    }
};
