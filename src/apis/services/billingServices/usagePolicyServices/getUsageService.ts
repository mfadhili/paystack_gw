// src/apis/services/billingServices/paddleBillingServices/getUsageService.ts
import mongoose from "mongoose";
import { BillingCustomerModel } from "../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";
import { SubscriptionModel } from "../../../../models/billingModels/paddleBillingModels/SubscriptionModel";
import { Contact } from "../../../../models/contactsModels/contactsModel";
import { Broadcast } from "../../../../models/broadcastModels/whatsAppBroadcastModels/broadcastModel";
import { WhatsAppIntegration } from "../../../../models/integrationsModels/outboundIntergrationModels/whatsappIntegrationModel";
import { UsageModel } from "../../../../models/billingModels/usagePolicyModel/UsageModel";
import { UsagePolicyModel } from "../../../../models/billingModels/usagePolicyModel/UsagePolicyModel";
import { Account } from "../../../../models/accountModels/accountModel";

interface GetUsageInput {
    accountId: mongoose.Types.ObjectId;
}

export const getUsageService = async ({ accountId }: GetUsageInput) => {
    const account = await Account.findById(accountId);
    if (!account || !account.billingCustomerId) {
        throw new Error("Account or billing customer not found.");
    }

    const billingCustomer = await BillingCustomerModel.findById(account.billingCustomerId);
    if (!billingCustomer) throw new Error("Billing customer not found.");

    const subscription = await SubscriptionModel.findOne({ customer: billingCustomer.id })
        .sort({ updated_at: -1 });

    if (!subscription || !subscription.items || subscription.items.length === 0) {
        throw new Error("No valid subscription found for usage check.");
    }

    const productId = subscription.items[0]?.price?.product_id;
    if (!productId) throw new Error("Missing product ID in subscription item");

    // Count actual usage
    const [contactsUsed, broadcastsUsed, whatsappNumbersUsed] = await Promise.all([
        Contact.countDocuments({ account: accountId, deletedAt: null }),
        Broadcast.countDocuments({ account: accountId, deletedAt: null }),
        WhatsAppIntegration.countDocuments({ account: accountId, deletedAt: null }),
    ]);

    // Upsert usage record
    const usage = await UsageModel.findOneAndUpdate(
        { accountId },
        {
            accountId,
            productId,
            contactsUsed,
            broadcastsUsed,
            whatsappNumbersUsed,
            updatedAt: new Date(),
        },
        { upsert: true, new: true }
    );

    // Fetch usage policy
    const policy = await UsagePolicyModel.findOne({ productId });
    if (!policy) throw new Error("No usage policy found for product");

    // Return both
    return {
        usage,
        limits: {
            contactLimit: policy.contactLimit,
            broadcastLimit: policy.broadcastLimit,
            whatsappNumberLimit: policy.whatsappNumberLimit,
        }
    };
};
