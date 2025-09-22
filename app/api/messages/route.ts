import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const postSchema = z.object({
  taskId: z.string(),
  content: z.string().min(1)
});

async function ensureTaskAccess(userId: string, taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      ownerId: true,
      orders: {
        select: {
          buyerId: true,
          sellerId: true,
          status: true
        }
      }
    }
  });
  if (!task) return false;
  if (task.ownerId === userId) return true;
  return task.orders.some((order) => order.buyerId === userId || order.sellerId === userId);
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  if (!taskId) {
    return NextResponse.json({ error: 'taskId required' }, { status: 400 });
  }

  const allowed = await ensureTaskAccess(session.user.id, taskId);
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { taskId },
    orderBy: { createdAt: 'asc' },
    include: { user: true }
  });

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const allowed = await ensureTaskAccess(session.user.id, parsed.data.taskId);
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      taskId: parsed.data.taskId,
      userId: session.user.id,
      content: parsed.data.content
    },
    include: { user: true }
  });

  return NextResponse.json(message, { status: 201 });
}
