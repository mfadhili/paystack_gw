// src/apis/services/billingServices/paddleBillingServices/syncBusinessesService.ts
import axios, {AxiosError} from "axios";
import { PADDLE_API_KEY, PADDLE_BASE_URL } from "../../../../../config/config";
import {BillingCustomerModel} from "../../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";
import {BusinessModel} from "../../../../../models/billingModels/paddleBillingModels/BusinessModel";

export const syncBusinesses = async () => {
    const customers = await BillingCustomerModel.find({});
    for (const customer of customers) {
        let url = `${PADDLE_BASE_URL}/customers/${customer.id}/businesses`;

        try {
            while (url) {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${PADDLE_API_KEY}`,
                        Accept: "application/json",
                    },
                });

                const { data, meta } = response.data;

                for (const business of data) {
                    await BusinessModel.updateOne(
                        { id: business.id },
                        {
                            $set: {
                                status: business.status,
                                customer: customer._id,
                                name: business.name,
                                company_number: business.company_number,
                                tax_identifier: business.tax_identifier,
                                contacts: business.contacts,
                                custom_data: business.custom_data,
                                created_at: business.created_at,
                                updated_at: business.updated_at,
                                import_meta: business.import_meta,
                            },
                        },
                        { upsert: true }
                    );
                }

                url = meta.pagination.has_more ? meta.pagination.next : null;
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                console.error("Error syncing business details from Paddle:", err.response?.data || err.message);
            } else if (err instanceof Error) {
                console.error("Error syncing business details:", err.message);
            } else {
                console.error("Unknown error occurred while syncing business details.");
            }
            throw err; // Re-throw the error for handling elsewhere
        }
    }
};
