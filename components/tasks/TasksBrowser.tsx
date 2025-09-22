'use client';

import { useEffect, useMemo, useState } from 'react';

import { BudgetSlider } from '@/components/BudgetSlider';
import { TagSelector } from '@/components/TagSelector';
import { TaskCard } from '@/components/TaskCard';

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  game: string;
  budgetMin: number;
  budgetMax: number;
  status: string;
  owner?: { name: string | null };
  taskTags?: { tagId: string }[];
};

export function TasksBrowser() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState('');
  const [language, setLanguage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [budget, setBudget] = useState({ min: 0, max: 10000 });
  const [minHours, setMinHours] = useState(0);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (game) params.set('game', game);
    if (language) params.set('language', language);
    if (tags.length > 0) params.set('tags', tags.join(','));
    if (budget.min > 0) params.set('minBudget', String(budget.min));
    if (budget.max < 20000) params.set('maxBudget', String(budget.max));
    if (minHours > 0) params.set('minHours', String(minHours));
    return params.toString();
  }, [game, language, tags, budget, minHours]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const res = await fetch(`/api/tasks${query ? `?${query}` : ''}`);
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    };

    fetchTasks();
  }, [query]);

  return (
    <div className="grid gap-6 md:grid-cols-[280px,1fr]">
      <aside className="card space-y-4">
        <h2 className="text-lg font-semibold text-white">Filters</h2>
        <div className="space-y-2 text-sm">
          <label className="text-slate-400">Game</label>
          <input value={game} onChange={(event) => setGame(event.target.value)} placeholder="League of Legends" />
        </div>
        <div className="space-y-2 text-sm">
          <label className="text-slate-400">Language</label>
          <input value={language} onChange={(event) => setLanguage(event.target.value)} placeholder="en" />
        </div>
        <div className="space-y-2 text-sm">
          <label className="text-slate-400">Budget range</label>
          <BudgetSlider min={budget.min} max={budget.max} onChange={(min, max) => setBudget({ min, max })} />
        </div>
        <div className="space-y-2 text-sm">
          <label className="text-slate-400">Minimum scheduled hours</label>
          <input
            type="number"
            min={0}
            max={168}
            value={minHours}
            onChange={(event) => setMinHours(Number(event.target.value))}
          />
        </div>
        <div className="space-y-2 text-sm">
          <label className="text-slate-400">Tags</label>
          <TagSelector value={tags} onChange={setTags} />
        </div>
      </aside>
      <section className="space-y-4">
        {loading && <p className="text-sm text-slate-400">Loading tasks...</p>}
        {!loading && tasks.length === 0 && <p className="text-sm text-slate-400">No tasks match your filters.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>
    </div>
  );
}
