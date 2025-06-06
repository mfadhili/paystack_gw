// src/apis/services/billingServices/paddleBillingServices/syncCustomersService.ts
import axios, {AxiosError} from "axios";
import { PADDLE_API_KEY, PADDLE_BASE_URL } from "../../../../../config/config";
import {BillingCustomerModel} from "../../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";

export const syncCustomers = async () => {
    let url = `${PADDLE_BASE_URL}/customers`;
    try {
        while (url) {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${PADDLE_API_KEY}`,
                    Accept: "application/json",
                },
            });

            const { data, meta } = response.data;

            for (const customer of data) {
                await BillingCustomerModel.updateOne(
                    { id: customer.id },
                    {
                        $set: {
                            status: customer.status,
                            custom_data: customer.custom_data,
                            name: customer.name,
                            email: customer.email,
                            marketing_consent: customer.marketing_consent,
                            locale: customer.locale,
                            created_at: customer.created_at,
                            updated_at: customer.updated_at,
                            import_meta: customer.import_meta,
                        },
                    },
                    { upsert: true }
                );
            }

            url = meta.pagination.has_more ? meta.pagination.next : null;
        }
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            console.error("Error syncing customer details from Paddle:", err.response?.data || err.message);
        } else if (err instanceof Error) {
            console.error("Error syncing customer details:", err.message);
        } else {
            console.error("Unknown error occurred while syncing customer details.");
        }
        throw err; // Re-throw the error for handling elsewhere
    }
};
