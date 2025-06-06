// src/apis/services/billingServices/paddleBillingServices/syncPaymentMethodsService.ts
import axios, {AxiosError} from "axios";
import { PADDLE_API_KEY, PADDLE_BASE_URL } from "../../../../../config/config";
import {BillingCustomerModel} from "../../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";
import {PaymentMethodModel} from "../../../../../models/billingModels/paddleBillingModels/PaymentMethodModel";

export const syncPaymentMethods = async () => {
    const customers = await BillingCustomerModel.find({});
    for (const customer of customers) {
        let url = `${PADDLE_BASE_URL}/customers/${customer.id}/payment-methods`;

        try {
            while (url) {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${PADDLE_API_KEY}`,
                        Accept: "application/json",
                    },
                });

                const { data, meta } = response.data;

                for (const paymentMethod of data) {
                    await PaymentMethodModel.updateOne(
                        { id: paymentMethod.id },
                        {
                            $set: {
                                customer: customer._id,
                                address_id: paymentMethod.address_id,
                                type: paymentMethod.type,
                                card: paymentMethod.card,
                                paypal: paymentMethod.paypal,
                                origin: paymentMethod.origin,
                                saved_at: paymentMethod.saved_at,
                                updated_at: paymentMethod.updated_at,
                            },
                        },
                        { upsert: true }
                    );
                }

                url = meta.pagination.has_more ? meta.pagination.next : null;
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                console.error("Error syncing payment methods from Paddle:", err.response?.data || err.message);
            } else if (err instanceof Error) {
                console.error("Error syncing payment methods:", err.message);
            } else {
                console.error("Unknown error occurred while syncing payment methods.");
            }
            throw err; // Re-throw the error for handling elsewhere
        }
    }
};
