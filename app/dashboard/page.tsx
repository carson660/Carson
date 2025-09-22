import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { TaskCard } from '@/components/TaskCard';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const [myTasks, myOrders] = await Promise.all([
    prisma.task.findMany({
      where: { ownerId: session.user.id },
      include: { taskTags: true }
    }),
    prisma.order.findMany({
      where: { OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }] },
      include: { task: true }
    })
  ]);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/tasks/new" className="card text-center text-lg font-semibold text-white hover:border-brand">
          Post a new task
        </Link>
        <Link href="/tasks" className="card text-center text-lg font-semibold text-white hover:border-brand">
          Explore open tasks
        </Link>
        <Link href="/orders" className="card text-center text-lg font-semibold text-white hover:border-brand">
          Manage orders
        </Link>
      </section>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">My Tasks</h2>
          <Link href="/tasks/new" className="text-sm text-brand hover:text-brand-dark">
            Create task
          </Link>
        </div>
        {myTasks.length === 0 && <p className="text-sm text-slate-400">No tasks yet. Create one to get started.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {myTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Recent Orders</h2>
        {myOrders.length === 0 && <p className="text-sm text-slate-400">No orders yet.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {myOrders.map((order) => (
            <div key={order.id} className="card space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{order.task.title}</span>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase">{order.status}</span>
              </div>
              <p className="text-xs text-slate-500">Created {order.createdAt.toDateString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
