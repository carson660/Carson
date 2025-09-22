import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { AdminTables } from '@/components/admin/AdminTables';
import { authOptions } from '@/lib/auth';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes('ADMIN')) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Admin Control Center</h1>
        <p className="text-sm text-slate-400">Review users, tasks, and orders. Override statuses to resolve disputes.</p>
      </div>
      <AdminTables />
    </div>
  );
}
