'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type Message = {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null };
};

type Props = {
  taskId: string;
  currentUserId: string;
};

export function MessageList({ taskId, currentUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    let isActive = true;

    const fetchMessages = async () => {
      const res = await fetch(`/api/messages?taskId=${taskId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (isActive) {
        setMessages(data);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [taskId]);

  return (
    <div className="space-y-2 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/80 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex flex-col rounded-lg px-3 py-2 text-sm',
            message.user.id === currentUserId ? 'ml-auto bg-brand/20 text-brand' : 'bg-slate-800 text-slate-200'
          )}
        >
          <span className="text-xs uppercase tracking-wide text-slate-400">
            {message.user.id === currentUserId ? 'You' : message.user.name ?? 'Partner'}
          </span>
          <p>{message.content}</p>
        </div>
      ))}
      {messages.length === 0 && <p className="text-xs text-slate-500">No messages yet.</p>}
    </div>
  );
}
