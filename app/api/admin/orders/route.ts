import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes('ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    include: {
      task: true,
      buyer: true,
      seller: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(orders);
}
