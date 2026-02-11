const features = [
  'File-based routing with the App Router',
  'Reusable React components',
  'Fast refresh in development mode',
];

export default function HomePage() {
  return (
    <main className="container">
      <h1>React + Next.js Example</h1>
      <p>
        This example app gives you a quick starting point you can run and modify.
      </p>

      <section>
        <h2>What this demonstrates</h2>
        <ul>
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Run it locally</h2>
        <pre>
{`cd nextjs-example
npm install
npm run dev`}
        </pre>
      </section>
    </main>
  );
}
