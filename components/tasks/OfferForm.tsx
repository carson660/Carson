'use client';

import { FormEvent, useState } from 'react';

export function OfferForm({ taskId }: { taskId: string }) {
  const [note, setNote] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/tasks/${taskId}/offer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, price: price ? Number(price) : undefined })
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error ? JSON.stringify(data.error) : 'Failed to submit offer');
    } else {
      setMessage('Offer submitted.');
      setNote('');
      setPrice(undefined);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {message && <p className="text-sm text-slate-400">{message}</p>}
      <div>
        <label className="text-sm text-slate-400">Message</label>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} className="w-full" />
      </div>
      <div>
        <label className="text-sm text-slate-400">Proposed price (cents, optional)</label>
        <input
          type="number"
          min={0}
          value={price ?? ''}
          onChange={(event) => setPrice(event.target.value ? Number(event.target.value) : undefined)}
          className="w-full"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit offer'}
      </button>
    </form>
  );
}
