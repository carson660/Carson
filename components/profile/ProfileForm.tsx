'use client';

import { FormEvent, useEffect, useState } from 'react';

import { TagSelector } from '@/components/TagSelector';

export function ProfileForm() {
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState<number | undefined>(undefined);
  const [availability, setAvailability] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        setName(data.name ?? '');
        setTimezone(data.timezone ?? '');
        setLanguages(data.languages ?? []);
        setGames(data.games ?? []);
        setHourlyRate(data.hourlyRate ?? undefined);
        setAvailability(data.availability ?? '');
        setTags((data.userTags ?? []).map((tag: any) => tag.tagId));
      });
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    const payload = {
      name,
      timezone,
      languages,
      games,
      hourlyRate,
      availability: availability || undefined,
      tags
    };
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error ? JSON.stringify(data.error) : 'Failed to update profile');
      return;
    }
    setMessage('Profile updated');
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {message && <p className="text-sm text-slate-400">{message}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-400">Display name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full" />
        </div>
        <div>
          <label className="text-sm text-slate-400">Timezone</label>
          <input value={timezone} onChange={(event) => setTimezone(event.target.value)} className="w-full" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-400">Languages (comma separated)</label>
          <input value={languages.join(',')} onChange={(event) => setLanguages(event.target.value.split(',').map((v) => v.trim()).filter(Boolean))} className="w-full" />
        </div>
        <div>
          <label className="text-sm text-slate-400">Games (comma separated)</label>
          <input value={games.join(',')} onChange={(event) => setGames(event.target.value.split(',').map((v) => v.trim()).filter(Boolean))} className="w-full" />
        </div>
      </div>
      <div>
        <label className="text-sm text-slate-400">Hourly rate (cents)</label>
        <input
          type="number"
          min={0}
          value={hourlyRate ?? ''}
          onChange={(event) => setHourlyRate(event.target.value ? Number(event.target.value) : undefined)}
          className="w-full"
        />
      </div>
      <div>
        <label className="text-sm text-slate-400">Availability bitmap (168 chars)</label>
        <input value={availability} onChange={(event) => setAvailability(event.target.value)} className="w-full" />
      </div>
      <div>
        <label className="text-sm text-slate-400">Tags</label>
        <TagSelector value={tags} onChange={setTags} />
      </div>
      <button type="submit">Save profile</button>
    </form>
  );
}
