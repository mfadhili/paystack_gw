// src/services/billingServices/customerPortalService.ts

// src/services/billingServices/paddleBillingServices/customerPortalService.ts

import axios from "axios";
import {PADDLE_API_KEY, PADDLE_BASE_URL} from "../../../../../config/config";
import {CustomerPortalModel} from "../../../../../models/billingModels/paddleBillingModels/CustomerPortalModel";
import {SubscriptionModel} from "../../../../../models/billingModels/paddleBillingModels/SubscriptionModel";
import {Account} from "../../../../../models/accountModels/accountModel";
import {IBillingCustomer} from "../../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";

interface GetCustomerPortalInput {
    userId: string;
    accountId: string;
}

export const getCustomerPortalService = async ({ userId, accountId }: GetCustomerPortalInput) => {
    // Step 1: Get the Account with populated billingCustomerId
    const account = await Account.findOne({
        _id: accountId,
        deletedAt: null,
    }).populate("billingCustomerId");

    if (!account) {
        const error = new Error("Account not found");
        (error as any).statusCode = 404;
        throw error;
    }

    if (!account.billingCustomerId) {
        const error = new Error("No billing customer linked to this account");
        (error as any).statusCode = 400;
        throw error;
    }

    const billingCustomer = account.billingCustomerId as unknown as IBillingCustomer;
    const paddleCustomerId = billingCustomer.id; // e.g., "cus_xxx"

    // Step 2: Get the subscription by billing customer _id
    const subscription = await SubscriptionModel.findOne({
        customer: billingCustomer.id,
    }).sort({updated_at: -1});

    if (!subscription) {
        return null
    }

    // Step 3: Call Paddle API to create portal session
    try {
        const response = await axios.post(
            `${PADDLE_BASE_URL}/customers/${paddleCustomerId}/portal-sessions`,
            { subscription_ids: [subscription.id] },
            {
                headers: {
                    Authorization: `Bearer ${PADDLE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const portalData = response.data.data;

        return await CustomerPortalModel.findOneAndUpdate(
            {id: portalData.id},
            {
                id: portalData.id,
                customer: billingCustomer._id,
                subscription: subscription._id,
                urls: portalData.urls,
                created_at: portalData.created_at,
            },
            {upsert: true, new: true}
        );
    } catch (err) {
        console.error("Error creating Paddle customer portal:", err);
        const error = new Error("Failed to create customer portal session");
        (error as any).statusCode = 502;
        throw error;
    }
};

