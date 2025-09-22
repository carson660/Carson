import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-10 text-center shadow-xl shadow-brand/10">
        <h1 className="text-4xl font-bold text-white sm:text-6xl">Power up your squad on GameQuest</h1>
        <p className="mt-4 text-lg text-slate-300">
          Post tasks, match with elite gamers, and finish your ranked goals faster with trusted pros.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/tasks/new" className="bg-brand px-6 py-3 text-lg font-semibold text-white hover:bg-brand-dark">
            Post a Task
          </Link>
          <Link href="/tasks" className="rounded-md border border-slate-700 px-6 py-3 text-lg text-slate-200 hover:border-brand">
            Browse Open Tasks
          </Link>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Smart matching',
            description: 'Tag-driven scoring and availability overlap help you find the perfect partner in seconds.'
          },
          {
            title: 'Secure payments',
            description: 'Stripe-powered checkout keeps your payments safe with a simple 10% platform fee.'
          },
          {
            title: 'In-app chat',
            description: 'Coordinate strategies and share updates in real time once an order is accepted.'
          }
        ].map((feature) => (
          <div key={feature.title} className="card text-left">
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
          </div>
        ))}
      </section>
      <section className="card grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold text-white">For Players</h2>
          <ul className="mt-4 space-y-2 text-slate-300">
            <li>• Post tasks with schedule, tags, and budget</li>
            <li>• Review offers and accept the best fit</li>
            <li>• Pay securely and rate your experience</li>
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-white">For Providers</h2>
          <ul className="mt-4 space-y-2 text-slate-300">
            <li>• Build a profile with games, tags, and availability</li>
            <li>• Filter tasks by language, budget, and tags</li>
            <li>• Chat with clients and complete orders fast</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
