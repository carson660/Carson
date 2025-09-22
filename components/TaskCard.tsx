import Link from 'next/link';

import { cn, formatCurrency } from '@/lib/utils';

type TaskCardProps = {
  task: {
    id: string;
    title: string;
    game: string;
    description: string;
    budgetMin: number;
    budgetMax: number;
    status: string;
    owner?: { name: string | null };
    taskTags?: { tagId: string }[];
  };
  className?: string;
};

export function TaskCard({ task, className }: TaskCardProps) {
  return (
    <div className={cn('card space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">{task.title}</h3>
          <p className="text-sm text-slate-400">{task.game}</p>
        </div>
        <span className="rounded-full bg-brand/20 px-3 py-1 text-xs uppercase tracking-wide text-brand">
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-sm text-slate-300 line-clamp-3">{task.description}</p>
      <div className="flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full bg-slate-800 px-3 py-1">
          {formatCurrency(task.budgetMin)} - {formatCurrency(task.budgetMax)}
        </span>
        {task.taskTags?.map((tag) => (
          <span key={tag.tagId} className="rounded-full bg-slate-800 px-3 py-1">
            {tag.tagId}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>Owner: {task.owner?.name ?? 'Anonymous'}</span>
        <Link href={`/tasks/${task.id}`} className="text-brand hover:text-brand-dark">
          View details
        </Link>
      </div>
    </div>
  );
}
