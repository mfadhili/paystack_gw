import { Request, Response } from 'express';
import {
    getBillingCustomerByIdService
} from "../../../../services/billingServices/paystackBillingServices/customerServices/getBillingCustomerByIdService";
import {handleControllerError} from "../../../../middlewares/errorHandlerMiddleware/handleControllerError";

export const getBillingCustomerByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const customer = await getBillingCustomerByIdService(id);
        if (!customer) {
            return res.status(404).json({ status: false, message: 'Customer not found' });
        }

        return res.status(200).json({ status: true, data: customer });
    } catch (error: any) {
        console.error('Get customer failed');
        const message = "Error getting customer";
        handleControllerError(res, error, message);
    }
};
