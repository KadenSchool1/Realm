import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Realm - Private Web Browser',
  description: 'A privacy-focused web browser with free search engines (no API keys)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
