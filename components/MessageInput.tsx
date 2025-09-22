'use client';

import { FormEvent, useState } from 'react';

export function MessageInput({ taskId }: { taskId: string }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ taskId, content }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    setContent('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Type your message"
        className="flex-1"
      />
      <button type="submit" disabled={loading}>
        Send
      </button>
    </form>
  );
}
