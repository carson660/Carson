import '../styles/globals.css';

import Link from 'next/link';
import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import type { Metadata } from 'next';

import { Providers } from '@/components/providers';
import { SignOutButton } from '@/components/SignOutButton';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'GameQuest',
  description: 'Match players with game experts for coaching and task fulfillment.'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <Providers session={session}>
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6">
            <header className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-4 shadow-lg shadow-brand/10">
              <Link href="/" className="text-2xl font-bold text-white">
                GameQuest
              </Link>
              <nav className="flex items-center gap-4 text-sm text-slate-300">
                <Link href="/tasks" className="hover:text-white">
                  Browse Tasks
                </Link>
                <Link href="/tasks/new" className="hover:text-white">
                  Post Task
                </Link>
                {session?.user && (
                  <>
                    <Link href="/dashboard" className="hover:text-white">
                      Dashboard
                    </Link>
                    <Link href="/orders" className="hover:text-white">
                      Orders
                    </Link>
                    <Link href="/profile" className="hover:text-white">
                      Profile
                    </Link>
                    {session.user.roles?.includes('ADMIN') && (
                      <Link href="/admin" className="hover:text-white">
                        Admin
                      </Link>
                    )}
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-300">{session.user.email}</span>
                    <SignOutButton />
                  </>
                )}
                {!session?.user && (
                  <Link href="/auth/signin" className="hover:text-white">
                    Sign in
                  </Link>
                )}
              </nav>
            </header>
            <main className="mt-8 flex-1">{children}</main>
            <footer className="mt-8 text-center text-xs text-slate-600">
              © {new Date().getFullYear()} GameQuest. Level up together.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
