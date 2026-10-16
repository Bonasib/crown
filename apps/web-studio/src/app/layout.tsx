import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: { default: 'Wilo AI — AI video, image & ad studio', template: '%s · Wilo AI' },
  description:
    'Create cinematic AI video and images with every top model, 80+ motion presets, characters, lip sync and one-click apps.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <TooltipProvider delayDuration={200}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </TooltipProvider>
      </body>
    </html>
  );
}
