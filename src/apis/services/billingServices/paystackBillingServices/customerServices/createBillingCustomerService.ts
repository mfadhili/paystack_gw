import axios from 'axios';
import {BillingCustomerModel} from "../../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export const createBillingCustomerService = async (payload: {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    metadata?: Record<string, any>;
}) => {
    const response = await axios.post('https://api.paystack.co/customer', payload, {
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to create customer on Paystack');
    }

    const {
        email,
        first_name,
        last_name,
        phone,
        metadata
    } = payload;

    const {
        integration,
        domain,
        customer_code,
        id: paystackCustomerId,
        identified,
        identifications,
        createdAt,
        updatedAt
    } = response.data.data;

    const customer = new BillingCustomerModel({
        email,
        firstName: first_name,
        lastName: last_name,
        phone,
        metadata,
        domain,
        customerCode: customer_code,
        paystackCustomerId,
        integration,
        identified,
        identifications,
        createdAt,
        updatedAt
    });

    const saved = await customer.save();

    return {
        _id: saved._id,
        email: saved.email,
    };
};
