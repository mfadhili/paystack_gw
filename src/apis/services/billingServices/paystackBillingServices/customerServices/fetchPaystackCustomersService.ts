// src/apis/services/billingServices/paystackBillingServices/customerServices/fetchPaystackCustomersService.ts
import axios, { AxiosResponse } from "axios";
import { PAYSTACK_SECRET_KEY } from "../../../../../config/config";
import PaystackBillingCustomerModel, {
    IPaystackBillingCustomer
} from "../../../../../models/billingModels/paystackBillingModels/PaystackBillingCustomerModel";

interface PaystackCustomer {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    metadata: any;
    domain: string;
    customer_code: string;
    id: number;
    integration: number;
    risk_action: string;
    createdAt: string;
    updatedAt: string;
}

interface PaystackCustomerResponse {
    status: boolean;
    message: string;
    data: PaystackCustomer[];
    meta: {
        next: string | null;
        perPage: number;
    };
}

export const fetchAndStorePaystackCustomers = async (): Promise<void> => {
    try {
        let nextCursor: string | null = null;
        let hasMore = true;

        while (hasMore) {
            const res: AxiosResponse<PaystackCustomerResponse> = await axios.get("https://api.paystack.co/customer", {
                headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
                params: {
                    use_cursor: true,
                    perPage: 50,
                    ...(nextCursor ? { next: nextCursor } : {})
                }
            });

            const customers = res.data.data;

            for (const cust of customers) {
                const existing = await PaystackBillingCustomerModel.findOne({ customerCode: cust.customer_code });

                const payload: Partial<IPaystackBillingCustomer> = {
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
                    await PaystackBillingCustomerModel.updateOne({ customerCode: cust.customer_code }, payload);
                } else {
                    await PaystackBillingCustomerModel.create(payload);
                }
            }

            nextCursor = res.data.meta?.next || null;
            hasMore = !!nextCursor;
        }

        console.log(`[PaystackCustomerSync] Synced all customers`);
    } catch (error) {
        console.error(`[PaystackCustomerSync] Failed to fetch customers`, error);
    }
};

