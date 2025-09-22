'use client';

import { useState } from 'react';

export function AcceptOfferButton({ taskId, offerId }: { taskId: string; offerId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const accept = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/tasks/${taskId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId })
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error ? JSON.stringify(data.error) : 'Failed to accept offer');
    } else {
      setMessage('Offer accepted. Proceed to checkout via Orders page.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <button onClick={accept} disabled={loading}>
        {loading ? 'Accepting...' : 'Accept offer'}
      </button>
      {message && <p className="text-xs text-slate-400">{message}</p>}
    </div>
  );
}
