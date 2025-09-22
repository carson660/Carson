'use client';

import { useState } from 'react';

export function OrderStatusActions({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [rating, setRating] = useState<number | undefined>(undefined);

  const markCompleted = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED', rating })
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || 'Failed to update order');
    } else {
      setMessage('Order updated. Refresh to see changes.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <input
        type="number"
        min={1}
        max={5}
        value={rating ?? ''}
        onChange={(event) => setRating(event.target.value ? Number(event.target.value) : undefined)}
        placeholder="Rating (1-5)"
        className="w-full"
      />
      <button onClick={markCompleted} disabled={loading}>
        {loading ? 'Updating...' : 'Mark completed'}
      </button>
      {message && <p className="text-xs text-slate-400">{message}</p>}
    </div>
  );
}
