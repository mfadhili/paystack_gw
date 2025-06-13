// src/services/billingServices/paystackBillingServices/generateSubscriptionUpdateLinkService.ts

import axios from "axios";
import { PAYSTACK_SECRET_KEY } from "../../../../../config/config";

export const generateSubscriptionUpdateLinkService = async (subscriptionCode: string): Promise<string> => {
    const response = await axios.get(
        `https://api.paystack.co/subscription/${subscriptionCode}/manage/link`,
        {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        }
    );

    if (!response.data.status || !response.data.data?.link) {
        throw new Error("Could not generate link from Paystack");
    }

    return response.data.data.link;
};
