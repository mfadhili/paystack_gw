// src/services/billingServices/paddleBillingServices/updateUsagePolicyService.ts
import {UsagePolicyModel} from "../../../../models/billingModels/usagePolicyModel/UsagePolicyModel";

interface UsagePolicyInput {
    productId: string;
    contactLimit: number;
    flowLimit: number;
    broadcastLimit: number;
    inboxSeats: number;
    whatsappNumberLimit: number;
}

export const createOrUpdateUsagePolicyService = async (input: UsagePolicyInput) => {
    const existing = await UsagePolicyModel.findOne({ productId: input.productId });

    if (existing) {
        // Update
        Object.assign(existing, input);
        await existing.save();
        return existing;
    }

    // Create new
    const newPolicy = await UsagePolicyModel.create(input);
    return newPolicy;
};
