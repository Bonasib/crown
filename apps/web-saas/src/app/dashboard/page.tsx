import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatCard,
  Badge,
  PageHeader,
  ShipmentStatusBadge,
} from '@ronda/ui';
import { Ship, Package, FileText, Bell } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Ship className="h-5 w-5 text-sidebar-primary" />
          <span className="font-semibold text-sidebar-foreground">Ronda Ship</span>
        </div>
        <nav className="space-y-1 p-3">
          {[
            { href: '/dashboard', label: 'Dashboard', active: true },
            { href: '/shipments', label: 'Shipments' },
            { href: '/quotes', label: 'Quotes' },
            { href: '/documents', label: 'Documents' },
            { href: '/invoices', label: 'Invoices' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <PageHeader
            title="Dashboard"
            description="Welcome back, Ahmed"
            action={
              <Button size="sm" asChild>
                <Link href="/quotes/new">New Quote</Link>
              </Button>
            }
          />

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              title="Active Shipments"
              value="3"
              icon={<Ship className="h-4 w-4" />}
              trend={{ value: 2, label: 'new this week', positive: true }}
            />
            <StatCard
              title="Pending Quotes"
              value="2"
              icon={<Package className="h-4 w-4" />}
              description="1 expiring in 2 days"
            />
            <StatCard
              title="Open Documents"
              value="4"
              icon={<FileText className="h-4 w-4" />}
              description="2 awaiting approval"
            />
            <StatCard
              title="Notifications"
              value="7"
              icon={<Bell className="h-4 w-4" />}
              description="3 unread"
            />
          </div>

          {/* Active Shipments */}
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Active Shipments</h2>
            <div className="space-y-3">
              {[
                {
                  id: 'SHP-2025-001',
                  bl: 'MAEUSHAJ2500001',
                  origin: 'Shanghai',
                  dest: 'Jeddah',
                  status: 'IN_TRANSIT' as const,
                  eta: 'Mar 9, 2025',
                  cbm: 28.5,
                  mode: 'FCL 40FT',
                },
                {
                  id: 'SHP-2025-002',
                  bl: 'MSKU9876543',
                  origin: 'Ningbo',
                  dest: 'Dubai',
                  status: 'CUSTOMS_IMPORT' as const,
                  eta: 'Mar 2, 2025',
                  cbm: 6.2,
                  mode: 'LCL',
                },
              ].map((s) => (
                <Card key={s.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <Ship className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{s.id}</p>
                        <p className="text-sm text-muted-foreground">
                          BL: {s.bl} · {s.origin} → {s.dest} · {s.mode} · {s.cbm} CBM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">ETA</p>
                        <p className="font-medium">{s.eta}</p>
                      </div>
                      <ShipmentStatusBadge status={s.status} />
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/shipments/${s.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
