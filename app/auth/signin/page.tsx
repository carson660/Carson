import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { EmailSignInForm } from '@/components/auth/EmailSignInForm';
import { authOptions } from '@/lib/auth';

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
      <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
      <p className="text-sm text-slate-400">Sign in with your email address. We&apos;ll send you a magic link.</p>
      <EmailSignInForm />
    </div>
  );
}
