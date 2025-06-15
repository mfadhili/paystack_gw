import { BillingSubscriptionStatusModel } from "../../../../../models/billingModels/BillingSubscriptionStatus";

export const checkAndEndTrialsService = async () => {
    const now = new Date();

    const result = await BillingSubscriptionStatusModel.updateMany(
        {
            trialing: true,
            nextBillingDate: { $lte: now }
        },
        {
            $set: {
                trialing: false,
                updatedAt: new Date()
            }
        }
    );

    console.log(`[TrialCron] ✅ Ended trials for ${result.modifiedCount} customer(s) at ${now.toISOString()}`);
};
