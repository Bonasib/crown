import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  StatCard,
  Badge,
  PageHeader,
  ShipmentStatusBadge,
  DataTable,
} from '@ronda/ui';
import {
  Ship,
  DollarSign,
  TrendingUp,
  Package,
  FileText,
  Users,
  Anchor,
  BarChart3,
} from 'lucide-react';

type ShipmentRow = {
  id: string;
  org: string;
  route: string;
  status: string;
  eta: string;
  revenue: string;
};

const shipmentRows: ShipmentRow[] = [
  { id: 'SHP-2025-001', org: 'ACME Imports', route: 'SHA → JED', status: 'IN_TRANSIT', eta: 'Mar 9', revenue: '$2,850' },
  { id: 'SHP-2025-002', org: 'Global Trade Co', route: 'NGB → DXB', status: 'CUSTOMS_IMPORT', eta: 'Mar 2', revenue: '$1,120' },
  { id: 'SHP-2025-003', org: 'Sunrise LLC', route: 'SZX → LAX', status: 'BOOKED', eta: 'Apr 15', revenue: '$3,400' },
  { id: 'SHP-2025-004', org: 'ACME Imports', route: 'SHA → HAM', status: 'STUFFED', eta: 'Mar 22', revenue: '$2,200' },
];

export default function ErpHome() {
  return (
    <div className="flex min-h-screen">
      {/* Dark Navy Sidebar */}
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Anchor className="h-5 w-5 text-sidebar-primary" />
          <div>
            <p className="text-sm font-bold text-white">Ronda Ship ERP</p>
            <p className="text-xs text-sidebar-foreground/60">Operations</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {[
            { href: '/', label: 'Dashboard', icon: BarChart3, active: true },
            { href: '/shipments', label: 'Shipments', icon: Ship },
            { href: '/quotes', label: 'Quotes', icon: FileText },
            { href: '/inspections', label: 'Inspections', icon: Package },
            { href: '/finance', label: 'Finance', icon: DollarSign },
            { href: '/tenants', label: 'Tenants', icon: Users },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="border-b bg-card px-6 py-4">
          <PageHeader
            title="Operations Dashboard"
            description="All active shipments across all tenants"
            action={
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button size="sm">New Shipment</Button>
              </div>
            }
          />
        </div>

        <div className="p-6">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              title="Active Shipments"
              value="24"
              icon={<Ship className="h-4 w-4" />}
              trend={{ value: 4, label: 'vs last week', positive: true }}
            />
            <StatCard
              title="Monthly Revenue"
              value="$84,200"
              icon={<DollarSign className="h-4 w-4" />}
              trend={{ value: 12, label: 'vs last month', positive: true }}
            />
            <StatCard
              title="Gross Margin"
              value="18.4%"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{ value: -0.8, label: 'vs last month', positive: false }}
            />
            <StatCard
              title="Pending Inspections"
              value="7"
              icon={<Package className="h-4 w-4" />}
              description="3 overdue"
            />
          </div>

          {/* Shipments Table */}
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">All Active Shipments</h2>
            <DataTable
              columns={[
                { key: 'id', header: 'Shipment ID' },
                { key: 'org', header: 'Organization' },
                { key: 'route', header: 'Route' },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => (
                    <ShipmentStatusBadge status={row.status as any} />
                  ),
                },
                { key: 'eta', header: 'ETA' },
                { key: 'revenue', header: 'Revenue' },
                {
                  key: 'actions',
                  header: '',
                  render: (row) => (
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  ),
                },
              ]}
              data={shipmentRows}
            />
          </div>

          {/* Finance Summary */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Base Freight', amount: '$52,400', pct: '62%' },
                    { label: 'Service Fees', amount: '$18,600', pct: '22%' },
                    { label: 'Insurance', amount: '$8,200', pct: '10%' },
                    { label: 'Inspection', amount: '$5,000', pct: '6%' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.amount} <Badge variant="secondary">{item.pct}</Badge></span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Top Tenants (MTD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {[
                    { name: 'ACME Imports', revenue: '$28,400', shipments: 8 },
                    { name: 'Global Trade Co', revenue: '$19,200', shipments: 6 },
                    { name: 'Sunrise LLC', revenue: '$14,600', shipments: 5 },
                    { name: 'Orient Star', revenue: '$12,000', shipments: 4 },
                  ].map((t) => (
                    <div key={t.name} className="flex justify-between">
                      <span className="text-muted-foreground">{t.name}</span>
                      <span className="font-medium">{t.revenue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Shipments by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { status: 'IN_TRANSIT' as const, count: 8 },
                    { status: 'CUSTOMS_IMPORT' as const, count: 4 },
                    { status: 'BOOKED' as const, count: 6 },
                    { status: 'STUFFED' as const, count: 3 },
                    { status: 'ARRIVED' as const, count: 3 },
                  ].map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <ShipmentStatusBadge status={item.status} />
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
