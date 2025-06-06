// src/apis/services/billingServices/paddleBillingServices/getSubscriptionStatusService.ts
import mongoose from "mongoose";
import {Account} from "../../../../../models/accountModels/accountModel";
import {BillingCustomerModel} from "../../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";
import {SubscriptionModel} from "../../../../../models/billingModels/paddleBillingModels/SubscriptionModel";


export const getSubscriptionStatusService = async (accountId: mongoose.Types.ObjectId) => {
    const account = await Account.findById(accountId);
    if (!account) throw new Error("Account not found");

    if (!account.billingCustomerId) {
        return {
            billingCustomerId: null,
            subscriptionStatus: null,
            subscriptionId: null,
            trialing: false,
            active: false,
        };
    }

    const billingCustomer = await BillingCustomerModel.findById(account.billingCustomerId);
    if (!billingCustomer) {
        return {
            billingCustomerId: account.billingCustomerId,
            subscriptionStatus: null,
            subscriptionId: null,
            trialing: false,
            active: false,
        };
    }

    const subscription = await SubscriptionModel.findOne({ customer: billingCustomer.id })
        .sort({ updated_at: -1 });

    if (!subscription) {
        return {
            billingCustomerId: billingCustomer.id,
            subscriptionStatus: null,
            subscriptionId: null,
            trialing: false,
            active: false,
        };
    }

    return {
        billingCustomerId: billingCustomer.id,
        subscriptionStatus: subscription.status,
        subscriptionId: subscription.id,
        nextBillingDate: subscription.next_billed_at,
        trialing: subscription.status === "trialing",
        active: subscription.status === "active",
    };
};