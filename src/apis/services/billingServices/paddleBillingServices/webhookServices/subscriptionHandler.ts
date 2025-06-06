// src/apis/services/billingServices/paddleBillingServices/webhookServices/subscriptionHandler.ts
import {SubscriptionModel} from "../../../../../models/billingModels/paddleBillingModels/SubscriptionModel";
import {BillingCustomerModel} from "../../../../../models/billingModels/paddleBillingModels/BillingCustomerModel";

export const processSubscriptionEvent = async (
    eventType: string,
    payload: any
) => {
    const subscriptionId = payload.id;
    const customerId = payload.customer_id;

    const customer = await BillingCustomerModel.findOne({ paddleCustomerId: customerId });
    if (!customer) throw new Error("Customer not found");

    const baseUpdate = {
        status: payload.status,
        nextBillingDate: payload.next_billed_at,
        rawPayload: payload,
    };

    switch (eventType) {
        case "subscription.created":
        case "subscription.imported": {
            const sub = payload.data;
            await SubscriptionModel.create({
                id: sub.id,
                status: sub.status,
                customer: sub.customer_id,
                address_id: sub.address_id,
                business: null, // or extract if applicable
                currency_code: sub.currency_code,
                created_at: new Date(sub.created_at),
                updated_at: new Date(sub.updated_at),
                started_at: new Date(sub.started_at),
                first_billed_at: sub.first_billed_at ? new Date(sub.first_billed_at) : null,
                next_billed_at: sub.next_billed_at ? new Date(sub.next_billed_at) : null,
                paused_at: sub.paused_at ? new Date(sub.paused_at) : null,
                canceled_at: sub.canceled_at ? new Date(sub.canceled_at) : null,
                collection_mode: sub.collection_mode,
                billing_details: sub.billing_details || null,
                current_billing_period: {
                    starts_at: new Date(sub.current_billing_period.starts_at),
                    ends_at: new Date(sub.current_billing_period.ends_at),
                },
                billing_cycle: {
                    frequency: sub.billing_cycle.frequency,
                    interval: sub.billing_cycle.interval,
                },
                scheduled_change: sub.scheduled_change || null,
                items: sub.items || [],
                custom_data: sub.custom_data || null,
                management_urls: {
                    update_payment_method: sub.management_urls?.update_payment_method || '',
                    cancel: sub.management_urls?.cancel || '',
                },
                discount: sub.discount || null,
                import_meta: sub.import_meta || null,
            });
            break;
        }

        case "subscription.updated":
        case "subscription.past_due":
        case "subscription.trialing":
        case "subscription.paused":
        case "subscription.resumed":
        case "subscription.activated":
            await SubscriptionModel.findOneAndUpdate(
                { paddleSubscriptionId: subscriptionId },
                baseUpdate
            );
            break;

        case "subscription.cancelled":
            await SubscriptionModel.findOneAndUpdate(
                { id: subscriptionId },
                {
                    ...baseUpdate,
                    status: "cancelled",
                    cancellationEffectiveDate: payload.cancellation_effective_date,
                }
            );
            break;

        default:
            console.warn(`Unhandled subscription event type: ${eventType}`);
            break;
    }
};

