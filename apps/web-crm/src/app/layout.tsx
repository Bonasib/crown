import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ronda Ship — Sales CRM',
  description: 'CRM for freight sales and lead management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">{children}</body>
    </html>
  );
}
