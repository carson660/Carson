import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes('ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const tasks = await prisma.task.findMany({
    include: {
      owner: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(tasks);
}
