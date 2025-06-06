// src/routes/billingRoutes/paddle/usagePolicyRoute.ts

import express from "express";
import {
    createOrUpdateUsagePolicyController
} from "../../controllers/billingControllers/usagePolicyControllers/updateUsagePolicyController";
import {
    getAllUsagePoliciesController
} from "../../controllers/billingControllers/usagePolicyControllers/getUsagePolicyController";
import {getUsageController} from "../../controllers/billingControllers/usagePolicyControllers/getUsageController";
// import {authenticateUser} from "../../middlewares/authMiddleware/authenticateUser";

const router = express.Router();

// router.post("/usage-policy", createOrUpdateUsagePolicyController);
// router.get("/get-usage-policies", getAllUsagePoliciesController); // 🔥 NEW
// router.get("/get-subscription-usage", authenticateUser, getUsageController);

export default router;
