import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ronda Ship — Operations & Finance',
  description: 'ERP system for freight operations and financial management',
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
