'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { TagSelector } from '@/components/TagSelector';

const toScheduleBits = (input: string) => {
  const hours = input
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => !Number.isNaN(value) && value >= 0 && value < 168);
  const bits = Array(168).fill('0');
  hours.forEach((hour) => {
    bits[hour] = '1';
  });
  return bits.join('');
};

export function NewTaskForm() {
  const router = useRouter();
  const [game, setGame] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(0);
  const [languages, setLanguages] = useState('en');
  const [schedule, setSchedule] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const scheduleBits = schedule ? toScheduleBits(schedule) : undefined;
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        game,
        title,
        description,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        languageReq: languages.split(',').map((lang) => lang.trim()).filter(Boolean),
        scheduleBits,
        tags
      })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ? JSON.stringify(data.error) : 'Failed to create task');
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push('/tasks');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div>
        <label className="text-sm text-slate-400">Game</label>
        <input value={game} onChange={(event) => setGame(event.target.value)} required className="w-full" />
      </div>
      <div>
        <label className="text-sm text-slate-400">Title</label>
        <input value={title} onChange={(event) => setTitle(event.target.value)} required className="w-full" />
      </div>
      <div>
        <label className="text-sm text-slate-400">Description</label>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} required className="w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-400">Budget min (cents)</label>
          <input
            type="number"
            min={0}
            value={budgetMin}
            onChange={(event) => setBudgetMin(Number(event.target.value))}
            required
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">Budget max (cents)</label>
          <input
            type="number"
            min={0}
            value={budgetMax}
            onChange={(event) => setBudgetMax(Number(event.target.value))}
            required
            className="w-full"
          />
        </div>
      </div>
      <div>
        <label className="text-sm text-slate-400">Languages (comma separated)</label>
        <input value={languages} onChange={(event) => setLanguages(event.target.value)} className="w-full" />
      </div>
      <div>
        <label className="text-sm text-slate-400">Schedule hours (comma separated, 0-167)</label>
        <input value={schedule} onChange={(event) => setSchedule(event.target.value)} className="w-full" />
      </div>
      <div>
        <label className="text-sm text-slate-400">Tags</label>
        <TagSelector value={tags} onChange={setTags} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create task'}
      </button>
    </form>
  );
}
