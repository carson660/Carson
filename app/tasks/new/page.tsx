import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { NewTaskForm } from '@/components/tasks/NewTaskForm';
import { authOptions } from '@/lib/auth';

export default async function NewTaskPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Create a new task</h1>
        <p className="text-sm text-slate-400">Describe your request and match with the perfect partner.</p>
      </div>
      <div className="card">
        <NewTaskForm />
      </div>
    </div>
  );
}
