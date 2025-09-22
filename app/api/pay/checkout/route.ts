import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

const schema = z.object({
  orderId: z.string()
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { task: true }
  });
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (order.buyerId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: session.user.email || undefined,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Order for ${order.task.title}`
          },
          unit_amount: order.totalAmount
        },
        quantity: 1
      }
    ],
    metadata: {
      orderId: order.id,
      taskId: order.taskId
    },
    success_url: `${baseUrl}/orders?success=1`,
    cancel_url: `${baseUrl}/orders?canceled=1`
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkoutSession.id }
  });

  await prisma.task.update({
    where: { id: order.taskId },
    data: { status: 'IN_PAYMENT' }
  });

  return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url });
}
