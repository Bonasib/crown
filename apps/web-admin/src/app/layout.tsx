import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ronda Ship — Admin Dashboard',
  description: 'Super admin dashboard for Ronda Ship platform management',
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
