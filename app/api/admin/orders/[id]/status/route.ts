import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({ status: z.string() });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes('ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
    include: { task: true }
  });

  if (parsed.data.status === 'COMPLETED') {
    await prisma.task.update({ where: { id: order.taskId }, data: { status: 'COMPLETED' } });
  }
  if (parsed.data.status === 'CANCELED') {
    await prisma.task.update({ where: { id: order.taskId }, data: { status: 'CANCELED' } });
  }

  return NextResponse.json(order);
}
