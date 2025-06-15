// src/apis/services/billingServices/paystackBillingServices/transactionServices/fetchPaystackTransactionsService.ts

import axios, { AxiosResponse } from "axios";
import { PAYSTACK_SECRET_KEY } from "../../../../../config/config";
import { PaystackBillingTransactionModel } from "../../../../../models/billingModels/paystackBillingModels/PaystackBillingTransactionModel";

interface PaystackTransaction {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    customer: {
        id: number;
        email: string;
        customer_code: string;
        first_name: string;
        last_name: string;
        phone: string;
    };
    channel: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    updated_at: string;
    metadata: any;
    fees: number;
    integration: number;
    domain: string;
    authorization?: any;
}

interface PaystackTransactionResponse {
    status: boolean;
    message: string;
    data: PaystackTransaction[];
    meta: {
        next?: string | null;
        perPage: number;
    };
}

export const fetchAndStorePaystackTransactions = async () => {
    let nextCursor: string | null = null;
    let hasMore = true;

    while (hasMore) {
        const res: AxiosResponse<PaystackTransactionResponse> = await axios.get("https://api.paystack.co/transaction", {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
            params: {
                use_cursor: true,
                perPage: 50,
                ...(nextCursor ? { next: nextCursor } : {})
            }
        });

        const transactions = res.data?.data || [];

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

            await PaystackBillingTransactionModel.findOneAndUpdate(
                { reference: tx.reference },
                update,
                { upsert: true, new: true }
            );
        }

        nextCursor = res.data.meta?.next || null;
        hasMore = !!nextCursor;
    }

    console.log(`[PaystackTransactionSync] Synced transactions with cursor pagination`);
};
