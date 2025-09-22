import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { CheckoutButton } from '@/components/orders/CheckoutButton';
import { OrderStatusActions } from '@/components/orders/OrderStatusActions';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }]
    },
    include: {
      task: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">My Orders</h1>
        <p className="text-sm text-slate-400">Manage payments, progress, and completion for your active quests.</p>
      </div>
      <div className="space-y-4">
        {orders.length === 0 && <p className="text-sm text-slate-400">No orders yet.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <div key={order.id} className="card space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span className="font-semibold text-white">{order.task.title}</span>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase">{order.status}</span>
              </div>
              <p className="text-xs text-slate-500">Total {formatCurrency(order.totalAmount)} · Fee {formatCurrency(order.platformFee)}</p>
              {order.status === 'PENDING_PAYMENT' && order.buyerId === session.user.id && (
                <CheckoutButton orderId={order.id} />
              )}
              {order.status === 'IN_PROGRESS' && <OrderStatusActions orderId={order.id} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
