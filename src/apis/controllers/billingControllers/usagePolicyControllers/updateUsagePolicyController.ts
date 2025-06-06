// src/controllers/billingControllers/paddle/updateUsagePolicyController.ts

import { Request, Response } from "express";
import {
    createOrUpdateUsagePolicyService
} from "../../../services/billingServices/usagePolicyServices/updateUsagePolicyService";

export const createOrUpdateUsagePolicyController = async (req: Request, res: Response) => {
    try {
        const policy = await createOrUpdateUsagePolicyService(req.body);
        return res.status(200).json({
            success: true,
            message: "Usage policy saved successfully",
            data: policy
        });
    } catch (error: any) {
        console.error("Usage policy error:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to save usage policy",
        });
    }
};
