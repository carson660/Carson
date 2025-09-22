'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

export function EmailSignInForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await signIn('email', { email, callbackUrl: '/dashboard' });
    setSubmitted(true);
  };

  if (submitted) {
    return <p className="text-sm text-brand">Check your inbox for a magic link.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className="w-full"
      />
      <button type="submit" className="w-full">
        Send magic link
      </button>
    </form>
  );
}
