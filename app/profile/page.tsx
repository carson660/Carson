import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { ProfileForm } from '@/components/profile/ProfileForm';
import { authOptions } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">My Profile</h1>
        <p className="text-sm text-slate-400">Update your languages, games, availability, and expertise tags.</p>
      </div>
      <div className="card">
        <ProfileForm />
      </div>
    </div>
  );
}
