'use client';

import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

type Tag = {
  id: string;
  label: string;
};

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function TagSelector({ value, onChange }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/tags')
      .then((res) => res.json())
      .then((data) => setTags(data));
  }, []);

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return tags.filter((tag) => tag.label.toLowerCase().includes(lower) || tag.id.toLowerCase().includes(lower));
  }, [tags, search]);

  const toggleTag = (tagId: string) => {
    if (value.includes(tagId)) {
      onChange(value.filter((item) => item !== tagId));
    } else {
      onChange([...value, tagId]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className="rounded-full bg-brand/20 px-3 py-1 text-sm text-brand hover:bg-brand/30"
          >
            {tag} ×
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Search tags"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/70 p-2">
        {filtered.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggleTag(tag.id)}
            className={cn(
              'mb-2 mr-2 inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs',
              value.includes(tag.id) ? 'border-brand text-brand' : 'text-slate-300'
            )}
          >
            {tag.label}
          </button>
        ))}
        {filtered.length === 0 && <p className="text-xs text-slate-500">No tags found</p>}
      </div>
    </div>
  );
}
