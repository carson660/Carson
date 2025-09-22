import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const offerSchema = z.object({
  note: z.string().optional(),
  price: z.number().int().optional()
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const task = await prisma.task.findUnique({ where: { id: params.id } });
  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (task.ownerId === session.user.id) {
    return NextResponse.json({ error: 'Cannot offer on own task' }, { status: 400 });
  }

  const data = await request.json();
  const parsed = offerSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const offer = await prisma.offer.create({
    data: {
      taskId: params.id,
      userId: session.user.id,
      note: parsed.data.note,
      price: parsed.data.price ?? null
    },
    include: { user: true }
  });

  return NextResponse.json(offer, { status: 201 });
}
