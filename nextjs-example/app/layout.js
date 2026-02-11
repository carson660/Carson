import './globals.css';

export const metadata = {
  title: 'Next.js Example App',
  description: 'A simple React/Next.js example app.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
