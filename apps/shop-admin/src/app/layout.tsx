import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '../lib/i18n';

export const metadata: Metadata = {
  title: 'Shop Admin Panel',
  description: 'Admin panel for the Telegram digital products & SMM shop bot',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-background antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
