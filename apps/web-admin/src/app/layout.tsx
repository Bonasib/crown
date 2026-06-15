import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Shield,
  LayoutDashboard,
  Ship,
  CreditCard,
  FileText,
  Tag,
  Users,
  LogOut,
} from 'lucide-react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Import — Admin',
  description: 'Super admin dashboard for Smart Import Platform',
};

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/shipments', icon: Ship, label: 'Shipments' },
  { href: '/admin/invoices', icon: CreditCard, label: 'Invoices' },
  { href: '/admin/documents', icon: FileText, label: 'Documents' },
  { href: '/admin/hs-codes', icon: Tag, label: 'HS Codes' },
  { href: '/admin/users', icon: Users, label: 'Users' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <div className="flex min-h-screen">
          <aside className="hidden w-60 flex-col border-r bg-slate-900 text-slate-100 md:flex">
            <div className="flex h-16 items-center gap-2 border-b border-slate-700 px-4">
              <Shield className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-bold">Smart Import</p>
                <p className="text-xs text-slate-400">Admin</p>
              </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
              {NAV.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-slate-700 px-2 py-3">
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </aside>

          <div className="flex flex-1 flex-col">
            <header className="flex h-14 items-center gap-2 border-b bg-background px-4 md:hidden">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-bold">Smart Import Admin</span>
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
