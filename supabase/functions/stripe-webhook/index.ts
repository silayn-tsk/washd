import Stripe from "npm:stripe@22";
import { adminClient, stripeClient } from "../_shared/services.ts";

const stripe = stripeClient();
const cryptoProvider = Stripe.createSubtleCryptoProvider();

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!signature || !webhookSecret) return new Response("Webhook is not configured", { status: 400 });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      webhookSecret,
      undefined,
      cryptoProvider,
    );
  } catch (error) {
    console.error("stripe signature verification", error instanceof Error ? error.message : error);
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = adminClient();
  const { error: claimError } = await supabase.from("stripe_events").insert({
    id: event.id,
    type: event.type,
    status: "processing",
    event_created: event.created,
  });
  if (claimError) {
    if (claimError.code !== "23505") {
      console.error("stripe event claim", claimError.message);
      return new Response("Webhook claim failed", { status: 500 });
    }
    const { data: existing } = await supabase.from("stripe_events").select("status").eq("id", event.id).maybeSingle();
    if (existing?.status === "processed") return Response.json({ received: true, duplicate: true });
    if (existing?.status === "failed") {
      const { data: reclaimed } = await supabase.from("stripe_events").update({ status: "processing", last_error: null, processed_at: new Date().toISOString() }).eq("id", event.id).eq("status", "failed").select("id").maybeSingle();
      if (!reclaimed) return new Response("Webhook is already retrying", { status: 409 });
    } else {
      return new Response("Webhook is already processing", { status: 409 });
    }
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await syncCheckout(event.data.object as Stripe.Checkout.Session, event.created);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(event.data.object as Stripe.Subscription, event.created);
        break;
      case "invoice.payment_succeeded":
      case "invoice.payment_failed":
        await syncInvoice(event.data.object as Stripe.Invoice, event.created);
        break;
      default:
        break;
    }
    const { error: processedError } = await supabase.from("stripe_events").update({ status: "processed", last_error: null, processed_at: new Date().toISOString() }).eq("id", event.id);
    if (processedError) throw processedError;
    return Response.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await supabase.from("stripe_events").update({ status: "failed", last_error: message.slice(0, 500), processed_at: new Date().toISOString() }).eq("id", event.id);
    console.error("stripe webhook handler", message);
    return new Response("Webhook handler failed", { status: 500 });
  }
});

async function syncCheckout(session: Stripe.Checkout.Session, eventCreated: number) {
  const userId = session.client_reference_id || session.metadata?.supabaseUserId;
  if (!userId) return;
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  const { error } = await adminClient().from("profiles").update({
    stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
    stripe_subscription_id: subscriptionId,
    plan_id: session.metadata?.planId || null,
    active_addons: (session.metadata?.addonIds || "").split(",").filter(Boolean),
    pending_plan_id: null,
    checkout_session_id: session.id,
    checkout_event_created: eventCreated,
    updated_at: new Date().toISOString(),
  }).eq("id", userId).lt("checkout_event_created", eventCreated);
  if (error) throw error;
  if (subscriptionId) await syncSubscription(await stripe.subscriptions.retrieve(subscriptionId), eventCreated);
}

async function syncSubscription(subscription: Stripe.Subscription, eventCreated: number) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const userId = subscription.metadata?.supabaseUserId || await userForCustomer(customerId);
  if (!userId) return;

  const expanded = await stripe.subscriptions.retrieve(subscription.id, { expand: ["default_payment_method"] });
  const paymentMethod = typeof expanded.default_payment_method === "object" ? expanded.default_payment_method : null;
  const itemPeriodEnd = expanded.items.data.reduce((latest, item) => Math.max(latest, item.current_period_end || 0), 0);

  const { error } = await adminClient().from("profiles").update({
    stripe_customer_id: customerId,
    stripe_subscription_id: expanded.id,
    subscription_status: expanded.status,
    plan_id: expanded.metadata?.planId || null,
    active_addons: (expanded.metadata?.addonIds || "").split(",").filter(Boolean),
    payment_brand: paymentMethod && "card" in paymentMethod ? paymentMethod.card?.brand || null : null,
    payment_last4: paymentMethod && "card" in paymentMethod ? paymentMethod.card?.last4 || null : null,
    current_period_end: itemPeriodEnd ? new Date(itemPeriodEnd * 1000).toISOString() : null,
    subscription_event_created: eventCreated,
    updated_at: new Date().toISOString(),
  }).eq("id", userId).lt("subscription_event_created", eventCreated);
  if (error) throw error;
}

async function syncInvoice(invoice: Stripe.Invoice, eventCreated: number) {
  const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  const userId = await userForCustomer(customerId);
  if (!userId) return;
  const subscriptionValue = invoice.parent?.subscription_details?.subscription;
  const subscriptionId = typeof subscriptionValue === "string" ? subscriptionValue : subscriptionValue?.id;
  let currentSubscription: Stripe.Subscription | null = null;
  if (subscriptionId) currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);

  const { error } = await adminClient().from("profiles").update({
    latest_invoice_status: invoice.status,
    latest_invoice_id: invoice.id,
    subscription_status: currentSubscription?.status || (invoice.status === "paid" ? "active" : "payment_attention"),
    invoice_event_created: eventCreated,
    updated_at: new Date().toISOString(),
  }).eq("id", userId).lt("invoice_event_created", eventCreated);
  if (error) throw error;
  if (currentSubscription) await syncSubscription(currentSubscription, eventCreated);
}

async function userForCustomer(customerId?: string | null) {
  if (!customerId) return null;
  const { data } = await adminClient().from("profiles").select("id").eq("stripe_customer_id", customerId).maybeSingle();
  return data?.id || null;
}
