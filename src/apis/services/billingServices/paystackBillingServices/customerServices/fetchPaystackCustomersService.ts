import axios from "axios";
import { PAYSTACK_SECRET_KEY } from "../../../../../config/config";
import BillingCustomerModel, {
    IBillingCustomer
} from "../../../../../models/billingModels/paystackBillingModels/BillingCustomerModel";

export const fetchAndStorePaystackCustomers = async (): Promise<void> => {
    try {
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const res = await axios.get(`https://api.paystack.co/customer?page=${page}&perPage=50`, {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            });

            const customers: any[] = res.data?.data || [];

            for (const cust of customers) {
                const existing = await BillingCustomerModel.findOne({ customerCode: cust.customer_code });

                const payload: Partial<IBillingCustomer> = {
                    email: cust.email,
                    firstName: cust.first_name,
                    lastName: cust.last_name,
                    phone: cust.phone,
                    metadata: cust.metadata,
                    domain: cust.domain,
                    customerCode: cust.customer_code,
                    paystackCustomerId: cust.id,
                    integration: cust.integration,
                    riskAction: cust.risk_action,
                    createdAt: new Date(cust.createdAt),
                    updatedAt: new Date(cust.updatedAt),
                };

                if (existing) {
                    await BillingCustomerModel.updateOne({ customerCode: cust.customer_code }, payload);
                } else {
                    await BillingCustomerModel.create(payload);
                }
            }

            hasMore = res.data?.meta?.next !== null;
            page++;
        }

        console.log(`[PaystackCustomerSync] Synced Paystack customers`);
    } catch (error) {
        console.error(`[PaystackCustomerSync] Failed to fetch customers`, error);
    }
};
