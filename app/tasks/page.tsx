import { TasksBrowser } from '@/components/tasks/TasksBrowser';

export const dynamic = 'force-dynamic';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Browse Tasks</h1>
        <p className="text-sm text-slate-400">Filter by game, budget, languages, tags, and schedule to find your next quest.</p>
      </div>
      <TasksBrowser />
    </div>
  );
}
