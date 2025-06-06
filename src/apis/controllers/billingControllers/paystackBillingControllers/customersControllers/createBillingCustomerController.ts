import { Request, Response } from 'express';
import {
    createBillingCustomerService
} from "../../../../services/billingServices/paystackBillingServices/customerServices/createBillingCustomerService";
import {handleControllerError} from "../../../../middlewares/errorHandlerMiddleware/handleControllerError";

export const createBillingCustomerController = async (req: Request, res: Response) => {
    try {
        const result = await createBillingCustomerService(req.body);
        return res.status(201).json({
            status: true,
            message: 'Customer created',
            data: result
        });
    } catch (error: any) {
        console.error('Customer creation failed');
        const message = "Error: Customer creation failed";
        handleControllerError(res, error, message);
    }
};
