'use client';

import { useState } from 'react';

export function MatchCandidates({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/match?taskId=${taskId}`);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to fetch matches');
    } else {
      const data = await res.json();
      setResults(data);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <button type="button" onClick={fetchMatches} disabled={loading}>
        {loading ? 'Scanning...' : 'Find top providers'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <ul className="space-y-2 text-sm text-slate-300">
        {results.map((item) => (
          <li key={item.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">{item.name || item.email}</span>
              <span className="text-xs text-brand">Score {(item.score * 100).toFixed(0)}%</span>
            </div>
            <p className="text-xs text-slate-500">
              Rate ${(item.hourlyRate ?? 0) / 100}/hr · Rating {item.ratingAvg?.toFixed(1) ?? '—'} ({item.ratingCount ?? 0})
            </p>
          </li>
        ))}
        {results.length === 0 && !loading && <li className="text-xs text-slate-500">No matches yet.</li>}
      </ul>
    </div>
  );
}
