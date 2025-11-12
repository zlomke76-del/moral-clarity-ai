// pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';

// ---- keep your helper functions exactly as you have them ----
// (toISO, extractFromSubscription, sendResendEmail, sendMagicLinkInvite,
//  resolveUserIdForCustomer, upsertSubscriptionRecord)
// Just paste them in here unchanged.

// Webhook handler (Pages API – always Node runtime)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const signature = req.headers['stripe-signature'];
  if (!signature) return res.status(400).json({ error: 'Missing signature' });

  try {
    const event = stripe.webhooks.constructEvent(
      (req as any).rawBody ?? req.body, // Vercel injects rawBody; Next dev uses body
      String(signature),
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription' && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(String(session.subscription));
          await upsertSubscriptionRecord({ stripe, sub });
        }
        if (session.customer_details?.email) {
          await sendMagicLinkInvite(session.customer_details.email);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscriptionRecord({ stripe, sub });
        break;
      }

      default:
        break;
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('[stripe-webhook] error:', err?.message ?? err);
    return res.status(400).json({ error: err?.message ?? 'Signature/handler error' });
  }
}

// Tell Next/Vercel to keep the raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
