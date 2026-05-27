import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ronda Ship — Customer Portal',
  description: 'Book and track your freight shipments with Ronda Ship',
  icons: { icon: '/favicon.ico' },
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
