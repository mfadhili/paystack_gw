
import {
    PaystackWebhookEventModel
} from "../../../../../models/billingModels/paystackBillingModels/PaystackWebhookEventModel";
import {
    PaystackBillingTransactionModel
} from "../../../../../models/billingModels/paystackBillingModels/PaystackBillingTransactionModel";
import PaystackBillingCustomerModel
    from "../../../../../models/billingModels/paystackBillingModels/PaystackBillingCustomerModel";
import PaystackBillingSubscriptionModel
    , {
    IPaystackBillingSubscription
} from "../../../../../models/billingModels/paystackBillingModels/PaystackBillingSubscriptionModel";
import PaystackBillingInvoiceModel
    from "../../../../../models/billingModels/paystackBillingModels/PaystackBillingInvoiceModel";
import {BillingSubscriptionStatusModel} from "../../../../../models/billingModels/BillingSubscriptionStatus";


export const processPaystackWebhookEventService = async (eventId: string) => {
    const event = await PaystackWebhookEventModel.findById(eventId);
    if (!event) throw new Error("Webhook event not found");

    const { event: eventType, data } = event as any;
    console.log(`[Webhook] Processing event ${eventType} with ID: ${eventId}`);


    switch (eventType) {
        case "invoice.create":
        case "invoice.update":
        case "invoice.payment_failed":
            console.log(`[Webhook:Invoice] Handling ${eventType} for invoice ${data.invoice_code}`);
            await PaystackBillingInvoiceModel.findOneAndUpdate(
                { invoiceCode: data.invoice_code },
                {
                    invoiceCode: data.invoice_code,
                    domain: data.domain,
                    amount: data.amount,
                    status: data.status,
                    paid: data.paid,
                    paidAt: data.paid_at,
                    periodStart: data.period_start,
                    periodEnd: data.period_end,
                    description: data.description,
                    authorization: data.authorization,
                    subscription: data.subscription,
                    customer: data.customer,
                    transaction: data.transaction,
                    createdAt: data.created_at,
                    updatedAt: new Date()
                },
                { upsert: true, new: true }
            );
            break;

        case "charge.success":
            console.log(`[Webhook:Charge] Received payment success for ${data.reference}`);
            await PaystackBillingTransactionModel.findOneAndUpdate(
                { reference: data.reference },
                {
                    reference: data.reference,
                    status: data.status,
                    amount: data.amount,
                    currency: data.currency,
                    customer: {
                        id: data.customer.id,
                        email: data.customer.email,
                        customerCode: data.customer.customer_code,
                        firstName: data.customer.first_name,
                        lastName: data.customer.last_name,
                        phone: data.customer.phone,
                    },
                    channel: data.channel,
                    gatewayResponse: data.gateway_response,
                    paidAt: data.paid_at,
                    createdAt: data.created_at,
                    updatedAt: new Date(),
                    metadata: data.metadata,
                    fees: data.fees,
                    integration: 0, // Set from config/context
                    domain: data.domain,
                    authorization: data.authorization
                },
                { upsert: true, new: true }
            );
            break;

        case "subscription.create":
        case "subscription.disable":
        case "subscription.not_renew":
            console.log(`[Webhook:Subscription] Processing ${eventType} for subscription ${data.subscription_code}`);
            const subscriptionUpdate: Partial<IPaystackBillingSubscription> = {
                status: data.status,
                nextPaymentDate: data.next_payment_date,
                cronExpression: data.cron_expression,
                amount: data.amount,
                planId: data.plan?.id ?? 0,
                authorization: data.authorization,
                updatedAt: new Date()
            };

            if (eventType === "subscription.create") {
                subscriptionUpdate.createdAt = isValidDate(data.createdAt) ? new Date(data.createdAt) : new Date();
                subscriptionUpdate.start = isValidDate(data.createdAt) ? new Date(data.createdAt) : new Date();
                subscriptionUpdate.subscriptionCode = data.subscription_code;
                subscriptionUpdate.emailToken = data.email_token;
                subscriptionUpdate.customerId = data.customer?.id ?? 0;
                subscriptionUpdate.integration = 0;
                subscriptionUpdate.domain = data.domain;
                subscriptionUpdate.quantity = 1;
                subscriptionUpdate.paystackSubscriptionId = data.id || 0;
            }

            await PaystackBillingSubscriptionModel.findOneAndUpdate(
                { subscriptionCode: data.subscription_code },
                subscriptionUpdate,
                { upsert: true, new: true }
            );
            const customer = await PaystackBillingCustomerModel.findOne({ paystackCustomerId: data.customer?.id });
            if (customer) {
                let isActive = false;
                let isTrialing = false;

                console.log(`[Webhook:Subscription] Updating status for customer ${customer.customerCode}`);


                switch (data.status) {
                    case "active":
                    case "non-renewing":
                    case "attention":
                        isActive = true;
                        break;
                    case "completed":
                    case "cancelled":
                        isActive = false;
                        break;
                    default:
                        isActive = false;
                        break;
                }

                await BillingSubscriptionStatusModel.findOneAndUpdate(
                    { paymentGwCustomerId: customer.customerCode },
                    {
                        // billingCustomerId: customer._id.toString(),
                        // paymentGwCustomerId: customer.customerCode,
                        subscriptionId: data.subscription_code,
                        subscriptionStatus: data.status,
                        nextBillingDate: data.next_payment_date,
                        trialing: isTrialing,
                        active: isActive,
                        syncedFromGatewayAt: new Date(),
                        updatedAt: new Date()
                    },
                    { upsert: true, new: true }
                );
            } else {
                console.warn(`[Webhook:Subscription] Customer not found for ID ${data.customer?.id}`);
            }
            break;

        case "customeridentification.success":
        case "customeridentification.failed":
            console.log(`[Webhook:CustomerID] Identification event for customer ${data.customer_code}`);
            await PaystackBillingCustomerModel.findOneAndUpdate(
                { customerCode: data.customer_code },
                {
                    email: data.email,
                    domain: "live",
                    customerCode: data.customer_code,
                    paystackCustomerId: data.customer_id,
                    integration: 0,
                    identifications: data.identification,
                    identified: eventType === "customeridentification.success",
                    updatedAt: new Date()
                },
                { upsert: true, new: true }
            );
            break;

        default:
            console.log(`[Webhook] Unhandled event type: ${eventType}`);
            break;
    }
    // Mark as processed (optional)
    event.processed = true;
    event.processedAt = new Date();
    await event.save();

    console.log(`[Webhook] Completed processing of event ${eventType} (ID: ${eventId})`);

    return { message: "Webhook event processed", eventType };
};


function isValidDate(value: any): value is string {
    return typeof value === "string" && !isNaN(Date.parse(value));
}
