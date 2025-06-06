// src/utils/cronJobs/cronJob.ts

import cron from "node-cron";
import { logCronJobExecution } from "../../apis/services/cronServices/cronJobLoggingService";
import {
    fetchAndStorePaystackPlans
} from "../../apis/services/billingServices/paystackBillingServices/planServices/fetchPaystackPlansService";
import {
    fetchAndStorePaystackCustomers
} from "../../apis/services/billingServices/paystackBillingServices/customerServices/fetchPaystackCustomersService";
import {
    fetchAndStorePaystackSubscriptions
} from "../../apis/services/billingServices/paystackBillingServices/subscriptionServices/fetchPaystackSubscriptionsService";
import {
    fetchAndStorePaystackTransactions
} from "../../apis/services/billingServices/paystackBillingServices/transactionServices/fetchPaystackTransactionsService";


export const startPaystackPlanSyncJob = () => {
    const jobName = "PaystackPlanSyncJob";

    // Schedule to run every 12 hours
    cron.schedule("0 */12 * * *", async () => {
        const start = new Date();
        try {
            await fetchAndStorePaystackPlans();
            console.log(`[${start.toISOString()}] Cron completed: ${jobName}`);
        } catch (err) {
            console.error(`[${start.toISOString()}] Cron failed: ${jobName}`, err);
        }
    });

    // Run once immediately
    (async () => {
        try {
            console.log(`[Init] Running ${jobName} immediately...`);
            await fetchAndStorePaystackPlans();
        } catch (err) {
            console.error(`[Init] Failed ${jobName}`, err);
        }
    })();
};

export const startPaystackCustomerSyncJob = () => {
    const jobName = "PaystackCustomerSyncJob";

    // Run every 12 hours
    cron.schedule("0 */12 * * *", async () => {
        const start = new Date();
        try {
            await fetchAndStorePaystackCustomers();
            console.log(`[${start.toISOString()}] Cron completed: ${jobName}`);
        } catch (err) {
            console.error(`[${start.toISOString()}] Cron failed: ${jobName}`, err);
        }
    });

    // Run once immediately
    (async () => {
        try {
            console.log(`[Init] Running ${jobName} immediately...`);
            await fetchAndStorePaystackCustomers();
        } catch (err) {
            console.error(`[Init] Failed ${jobName}`, err);
        }
    })();
};

export const startPaystackSubscriptionSyncJob = () => {
    const jobName = "PaystackSubscriptionSyncJob";

    cron.schedule("0 */12 * * *", async () => {
        const start = new Date();
        try {
            await fetchAndStorePaystackSubscriptions();
            console.log(`[${start.toISOString()}] Cron completed: ${jobName}`);
        } catch (err) {
            console.error(`[${start.toISOString()}] Cron failed: ${jobName}`, err);
        }
    });

    (async () => {
        try {
            console.log(`[Init] Running ${jobName} immediately...`);
            await fetchAndStorePaystackSubscriptions();
        } catch (err) {
            console.error(`[Init] Failed ${jobName}`, err);
        }
    })();
};

export const startPaystackTransactionSyncJob = () => {
    const jobName = "PaystackTransactionSyncJob";

    cron.schedule("0 */12 * * *", async () => {
        const start = new Date();
        try {
            await fetchAndStorePaystackTransactions();
            console.log(`[${start.toISOString()}] Cron completed: ${jobName}`);
        } catch (err) {
            console.error(`[${start.toISOString()}] Cron failed: ${jobName}`, err);
        }
    });

    (async () => {
        try {
            console.log(`[Init] Running ${jobName} immediately...`);
            await fetchAndStorePaystackTransactions();
        } catch (err) {
            console.error(`[Init] Failed ${jobName}`, err);
        }
    })();
};

export const runAllCronJobs = () => {
    startPaystackPlanSyncJob();
    startPaystackCustomerSyncJob(); // ✅ Now included
    startPaystackSubscriptionSyncJob(); // ✅ Now included
    startPaystackTransactionSyncJob(); // ✅ Include this line
};