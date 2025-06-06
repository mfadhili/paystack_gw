
import {
    PaystackWebhookEventModel
} from "../../../../../models/billingModels/paystackBillingModels/PaystackWebhookEventModel";
import BillingSubscriptionModel
    from "../../../../../models/billingModels/paystackBillingModels/BillingSubscriptionModel";
import {
    BillingTransactionModel
} from "../../../../../models/billingModels/paystackBillingModels/BillingTransactionModel";
import BillingInvoiceModel from "../../../../../models/billingModels/paystackBillingModels/BillingInvoiceModel";
import {BillingCustomerModel} from "../../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";

export const processPaystackWebhookEventService = async (eventId: string) => {
    const event = await PaystackWebhookEventModel.findById(eventId);
    if (!event) throw new Error("Webhook event not found");

    const { event: eventType, data } = event as any;

    switch (eventType) {
        case "invoice.create":
        case "invoice.update":
        case "invoice.payment_failed":
            await BillingInvoiceModel.findOneAndUpdate(
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
            await BillingTransactionModel.findOneAndUpdate(
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
            await BillingSubscriptionModel.findOneAndUpdate(
                { subscriptionCode: data.subscription_code },
                {
                    subscriptionCode: data.subscription_code,
                    emailToken: data.email_token,
                    customerId: data.customer?.id ?? 0,
                    planId: data.plan?.id ?? 0,
                    integration: 0, // Set from context
                    domain: data.domain,
                    status: data.status,
                    start: new Date(data.created_at).getTime(),
                    quantity: 1,
                    amount: data.amount,
                    authorization: data.authorization,
                    cronExpression: data.cron_expression,
                    nextPaymentDate: data.next_payment_date,
                    openInvoice: data.open_invoice,
                    paystackSubscriptionId: data.id || 0,
                    createdAt: new Date(data.created_at),
                    updatedAt: new Date()
                },
                { upsert: true, new: true }
            );
            break;

        case "customeridentification.success":
        case "customeridentification.failed":
            await BillingCustomerModel.findOneAndUpdate(
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
            console.log("Unhandled event:", eventType);
            break;
    }
    // Mark as processed (optional)
    event.processed = true;
    event.processedAt = new Date();
    await event.save();

    return { message: "Webhook event processed", eventType };
};
