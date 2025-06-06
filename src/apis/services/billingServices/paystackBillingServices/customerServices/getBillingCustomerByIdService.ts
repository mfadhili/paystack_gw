import mongoose from 'mongoose';
import PaystackBillingCustomerModel
    from "../../../../../models/billingModels/paystackBillingModels/PaystackBillingCustomerModel";

export const getBillingCustomerByIdService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid customer ID');
    }

    const customer = await PaystackBillingCustomerModel.findById(id).lean();
    return customer;
};
