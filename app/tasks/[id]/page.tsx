import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { CheckoutButton } from '@/components/orders/CheckoutButton';
import { MessageInput } from '@/components/MessageInput';
import { MessageList } from '@/components/MessageList';
import { AcceptOfferButton } from '@/components/tasks/AcceptOfferButton';
import { MatchCandidates } from '@/components/tasks/MatchCandidates';
import { OfferForm } from '@/components/tasks/OfferForm';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      taskTags: { include: { tag: true } },
      offers: { include: { user: true } },
      orders: true
    }
  });

  if (!task) {
    notFound();
  }

  const isOwner = task.ownerId === session.user.id;
  const order = task.orders.find((item) => item.status !== 'CANCELED');
  const isBuyer = order?.buyerId === session.user.id;
  const isSeller = order?.sellerId === session.user.id;
  const canChat = isOwner || isBuyer || isSeller;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">{task.title}</h1>
          <span className="rounded-full bg-brand/20 px-3 py-1 text-xs uppercase text-brand">{task.status}</span>
        </div>
        <p className="text-sm text-slate-300">{task.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          <span className="rounded-full bg-slate-800 px-3 py-1">{task.game}</span>
          <span className="rounded-full bg-slate-800 px-3 py-1">
            Budget {formatCurrency(task.budgetMin)} – {formatCurrency(task.budgetMax)}
          </span>
          {task.languageReq.map((lang) => (
            <span key={lang} className="rounded-full bg-slate-800 px-3 py-1">
              {lang}
            </span>
          ))}
          {task.taskTags.map((tag) => (
            <span key={tag.id} className="rounded-full bg-slate-800 px-3 py-1">
              {tag.tag?.label ?? tag.tagId}
            </span>
          ))}
        </div>
        <div className="space-y-2 text-sm text-slate-400">
          <p>Owner: {task.owner.name || task.owner.email}</p>
          {task.scheduleBits && <p>Scheduled hours: {task.scheduleBits.split('').filter((bit) => bit === '1').length}</p>}
        </div>
        {isOwner && <MatchCandidates taskId={task.id} />}
      </section>
      <aside className="space-y-6">
        {!isOwner && !order && (
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold text-white">Submit an offer</h2>
            <OfferForm taskId={task.id} />
          </div>
        )}
        {isOwner && task.offers.length > 0 && (
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold text-white">Offers</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              {task.offers.map((offer) => (
                <li key={offer.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{offer.user.name || offer.user.email}</span>
                    <span>{offer.price ? formatCurrency(offer.price) : 'No price'}</span>
                  </div>
                  {offer.note && <p className="mt-2 text-xs text-slate-400">{offer.note}</p>}
                  <AcceptOfferButton taskId={task.id} offerId={offer.id} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {isBuyer && order && order.status === 'PENDING_PAYMENT' && (
          <div className="card space-y-3">
            <h2 className="text-xl font-semibold text-white">Ready to pay</h2>
            <p className="text-sm text-slate-400">Complete checkout to start the engagement.</p>
            <CheckoutButton orderId={order.id} />
          </div>
        )}
      </aside>
      {canChat && (
        <section className="card space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold text-white">Task chat</h2>
          <MessageList taskId={task.id} currentUserId={session.user.id} />
          <MessageInput taskId={task.id} />
        </section>
      )}
    </div>
  );
}
