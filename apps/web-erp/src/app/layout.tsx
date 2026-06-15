import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Warehouse, LayoutDashboard, ScanLine, History, LogOut } from 'lucide-react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Import — Warehouse',
  description: 'Warehouse receiving portal for Smart Import Platform',
};

const NAV = [
  { href: '/warehouse', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/warehouse/receive', icon: ScanLine, label: 'Receive goods' },
  { href: '/warehouse/history', icon: History, label: 'History' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <div className="flex min-h-screen">
          <aside className="hidden w-60 flex-col border-r bg-card md:flex">
            <div className="flex h-16 items-center gap-2 border-b px-4">
              <Warehouse className="h-6 w-6 text-primary" />
              <span className="font-bold">Warehouse</span>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
              {NAV.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="border-t px-2 py-3">
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </aside>

          <div className="flex flex-1 flex-col">
            <header className="flex h-14 items-center gap-2 border-b bg-background px-4 md:hidden">
              <Warehouse className="h-5 w-5 text-primary" />
              <span className="font-bold">Warehouse</span>
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
