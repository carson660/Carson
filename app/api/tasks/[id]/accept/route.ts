import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  offerId: z.string()
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: { offers: true, orders: true }
  });
  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (task.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const data = await request.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (task.orders.some((item) => item.status !== 'CANCELED')) {
    return NextResponse.json({ error: 'Order already exists for this task' }, { status: 400 });
  }

  const offer = task.offers.find((item) => item.id === parsed.data.offerId);
  if (!offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
  }

  const totalAmount = offer.price ?? task.budgetMax;
  const platformFee = Math.round(totalAmount * 0.1);

  const order = await prisma.order.create({
    data: {
      taskId: task.id,
      buyerId: task.ownerId,
      sellerId: offer.userId,
      status: 'PENDING_PAYMENT',
      totalAmount,
      platformFee
    }
  });

  await prisma.task.update({
    where: { id: task.id },
    data: { status: 'ACCEPTED' }
  });

  return NextResponse.json(order, { status: 201 });
}
