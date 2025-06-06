// src/services/billingServices/paddleBillingServices/usagePolicyService.ts

import {UsagePolicyModel} from "../../../../models/billingModels/usagePolicyModel/UsagePolicyModel";

export const getAllUsagePoliciesService = async () => {
    return await UsagePolicyModel.find().sort({ productId: 1 }); // Optional: sort alphabetically
};
