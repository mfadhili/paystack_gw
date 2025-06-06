// src/utils/cronJobs/startBillingSyncCron.ts
import cron from "node-cron";
import {
    syncProductsAndPrices
} from "../../apis/services/billingServices/paddleBillingServices/cronServices/syncProductsAndPricesService";
import { syncCustomers } from "../../apis/services/billingServices/paddleBillingServices/cronServices/syncCustomersService";
import { syncBusinesses } from "../../apis/services/billingServices/paddleBillingServices/cronServices/syncBusinessesService";
import { syncPaymentMethods } from "../../apis/services/billingServices/paddleBillingServices/cronServices/syncPaymentMethodsService";
import {
    syncSubscriptions
} from "../../apis/services/billingServices/paddleBillingServices/cronServices/syncSubscriptionsService";
import {
    syncTransactions
} from "../../apis/services/billingServices/paddleBillingServices/cronServices/syncTransactionsService";

export const startBillingSyncJob = async () => {
    const jobName = "BillingSyncJob";

    // Run the job immediately
    console.log(`[${new Date().toISOString()}] Running ${jobName} immediately...`);
    try {
        await syncProductsAndPrices();
        console.log(`[${new Date().toISOString()}] Products and Prices Sync completed successfully.`);

        await syncCustomers();
        console.log(`[${new Date().toISOString()}] Customers Sync completed successfully.`);

        await syncBusinesses();
        console.log(`[${new Date().toISOString()}] Businesses Sync completed successfully.`);

        await syncPaymentMethods();
        console.log(`[${new Date().toISOString()}] Payment Methods Sync completed successfully.`);

        await syncSubscriptions();
        console.log(`[${new Date().toISOString()}] Subscriptions Sync completed successfully.`);

        await syncTransactions();
        console.log(`[${new Date().toISOString()}] Transactions Sync completed successfully.`);

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error during immediate run of ${jobName}:`, error);
    }

    // Schedule the job to run at the top of every hour
    cron.schedule("0 * * * *", async () => {
        const executionStart = new Date();

        console.log(`[${executionStart.toISOString()}] Starting cron job: ${jobName}`);

        try {
            await syncProductsAndPrices();
            console.log(`[${new Date().toISOString()}] Products and Prices Sync completed successfully.`);

            await syncCustomers();
            console.log(`[${new Date().toISOString()}] Customers Sync completed successfully.`);

            await syncBusinesses();
            console.log(`[${new Date().toISOString()}] Businesses Sync completed successfully.`);

            await syncPaymentMethods();
            console.log(`[${new Date().toISOString()}] Payment Methods Sync completed successfully.`);

            await syncSubscriptions();
            console.log(`[${new Date().toISOString()}] Subscriptions Sync completed successfully.`);

            await syncTransactions();
            console.log(`[${new Date().toISOString()}] Transactions Sync completed successfully.`);

            const executionEnd = new Date();
            console.log(`[${executionEnd.toISOString()}] Cron job completed successfully: ${jobName}`);

        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in cron job: ${jobName}`, error);
        }
    });
};
