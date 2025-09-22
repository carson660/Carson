'use client';

import { useState } from 'react';

export function CheckoutButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/pay/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to create checkout session');
      setLoading(false);
      return;
    }
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="space-y-2">
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Redirecting...' : 'Go to checkout'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
