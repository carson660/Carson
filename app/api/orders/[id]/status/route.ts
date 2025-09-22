import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  status: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional()
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { task: true }
  });
  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const isParticipant = order.buyerId === session.user.id || order.sellerId === session.user.id;
  const isAdmin = session.user.roles?.includes('ADMIN');
  if (!isParticipant && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data: any = {};
  if (parsed.data.status) {
    data.status = parsed.data.status;
    if (parsed.data.status === 'COMPLETED') {
      data.completedAt = new Date();
    }
  }
  let ratingTargetId: string | null = null;
  if (parsed.data.rating) {
    if (session.user.id === order.buyerId && order.ratingByBuyer == null) {
      data.ratingByBuyer = parsed.data.rating;
      ratingTargetId = order.sellerId;
    } else if (session.user.id === order.sellerId && order.ratingBySeller == null) {
      data.ratingBySeller = parsed.data.rating;
      ratingTargetId = order.buyerId;
    }
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data,
    include: { task: true }
  });

  if (parsed.data.status === 'COMPLETED') {
    await prisma.task.update({
      where: { id: order.taskId },
      data: { status: 'COMPLETED' }
    });
  }

  if (ratingTargetId) {
    const target = await prisma.user.findUnique({
      where: { id: ratingTargetId },
      select: { ratingAvg: true, ratingCount: true }
    });
    if (target) {
      const prevCount = target.ratingCount ?? 0;
      const nextCount = prevCount + 1;
      const prevAvg = target.ratingAvg ?? 0;
      const nextAvg = (prevAvg * prevCount + parsed.data.rating!) / nextCount;
      await prisma.user.update({
        where: { id: ratingTargetId },
        data: { ratingAvg: nextAvg, ratingCount: nextCount }
      });
    }
  }

  return NextResponse.json(updated);
}
