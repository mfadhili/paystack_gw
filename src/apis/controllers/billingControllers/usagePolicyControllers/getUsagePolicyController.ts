// src/controllers/billingControllers/paddle/usagePolicyController.ts

import { Request, Response } from "express";
import {getAllUsagePoliciesService} from "../../../services/billingServices/usagePolicyServices/getUsagePolicyService";


export const getAllUsagePoliciesController = async (_req: Request, res: Response) => {
    try {
        const policies = await getAllUsagePoliciesService();
        return res.status(200).json({
            success: true,
            message: "All usage policies retrieved",
            data: policies
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message || "Failed to retrieve usage policies",
        });
    }
};
