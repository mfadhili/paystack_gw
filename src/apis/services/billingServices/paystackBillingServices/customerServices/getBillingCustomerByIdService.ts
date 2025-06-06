import mongoose from 'mongoose';
import {BillingCustomerModel} from "../../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";

export const getBillingCustomerByIdService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid customer ID');
    }

    const customer = await BillingCustomerModel.findById(id).lean();
    return customer;
};
