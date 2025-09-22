import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    console.error('Stripe webhook error', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { id: string; metadata?: Record<string, string> };
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'IN_PROGRESS' }
      });
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (order) {
        await prisma.task.update({
          where: { id: order.taskId },
          data: { status: 'IN_PROGRESS' }
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}

export const dynamic = 'force-dynamic';
