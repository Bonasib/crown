import type { ReactNode } from 'react';
import Link from 'next/link';
import { Package, Ship, FileText, CreditCard, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/products', icon: Package, label: 'Products' },
  { href: '/dashboard/shipments', icon: Ship, label: 'Shipments' },
  { href: '/dashboard/invoices', icon: CreditCard, label: 'Invoices' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-bold">Smart Import</span>
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

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-2 border-b bg-background px-4 md:hidden">
          <Package className="h-5 w-5 text-primary" />
          <span className="font-bold">Smart Import</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
