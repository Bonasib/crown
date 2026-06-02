import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  Badge,
  PageHeader,
  DataTable,
} from '@ronda/ui';
import {
  Users,
  Building2,
  Shield,
  Activity,
  Settings,
  Flag,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Key,
  BookOpen,
} from 'lucide-react';

type OrgRow = {
  name: string;
  slug: string;
  plan: string;
  shipments: string;
  mrr: string;
  status: string;
};

const orgRows: OrgRow[] = [
  { name: 'ACME Imports Ltd', slug: 'acme-imports', plan: 'Pro', shipments: '24', mrr: '$840', status: 'active' },
  { name: 'Global Trade Co', slug: 'global-trade-co', plan: 'Starter', shipments: '8', mrr: '$240', status: 'active' },
  { name: 'Sunrise LLC', slug: 'sunrise-llc', plan: 'Pro', shipments: '16', mrr: '$840', status: 'active' },
  { name: 'Orient Star', slug: 'orient-star', plan: 'Enterprise', shipments: '42', mrr: '$2,400', status: 'active' },
  { name: 'Lagoon Import', slug: 'lagoon-import', plan: 'Starter', shipments: '3', mrr: '$240', status: 'suspended' },
];

const featureFlags = [
  { key: 'ai_quote_suggestions', description: 'AI Quote Suggestions', enabled: false },
  { key: 'stripe_payments', description: 'Stripe Payments', enabled: false },
  { key: 'vessel_tracking_api', description: 'Live Vessel Tracking', enabled: false },
  { key: 'whatsapp_notifications', description: 'WhatsApp Notifications', enabled: false },
  { key: 'multi_currency', description: 'Multi-Currency Invoicing', enabled: true },
];

export default function AdminHome() {
  return (
    <div className="flex min-h-screen">
      {/* Deep Purple Sidebar */}
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Shield className="h-5 w-5 text-sidebar-primary" />
          <div>
            <p className="text-sm font-bold text-white">Ronda Admin</p>
            <p className="text-xs text-sidebar-foreground/60">Super Admin</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {[
            { href: '/', label: 'Dashboard', icon: BarChart3, active: true },
            { href: '/organizations', label: 'Organizations', icon: Building2 },
            { href: '/users', label: 'Users', icon: Users },
            { href: '/feature-flags', label: 'Feature Flags', icon: Flag },
            { href: '/api-keys', label: 'API Keys', icon: Key },
            { href: '/audit-log', label: 'Audit Log', icon: Activity },
            { href: '/database', label: 'Database', icon: Database },
            { href: '/security-tools', label: 'Security Tools', icon: BookOpen },
            { href: '/settings', label: 'Settings', icon: Settings },
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
            title="Platform Overview"
            description="System-wide metrics and controls"
            action={
              <div className="flex items-center gap-2">
                <Badge variant="success">All Systems Operational</Badge>
                <Button variant="outline" size="sm">System Health</Button>
              </div>
            }
          />
        </div>

        <div className="p-6">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              title="Total Organizations"
              value="5"
              icon={<Building2 className="h-4 w-4" />}
              trend={{ value: 1, label: 'new this month', positive: true }}
            />
            <StatCard
              title="Active Users"
              value="23"
              icon={<Users className="h-4 w-4" />}
              trend={{ value: 3, label: 'vs last month', positive: true }}
            />
            <StatCard
              title="Monthly ARR"
              value="$4,560"
              icon={<BarChart3 className="h-4 w-4" />}
              trend={{ value: 8, label: 'vs last month', positive: true }}
            />
            <StatCard
              title="API Calls (24h)"
              value="12,840"
              icon={<Activity className="h-4 w-4" />}
            />
          </div>

          {/* Organizations Table */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Organizations</h2>
              <Button size="sm">
                <Building2 className="mr-2 h-3.5 w-3.5" />
                Add Organization
              </Button>
            </div>
            <DataTable
              columns={[
                { key: 'name', header: 'Organization' },
                { key: 'slug', header: 'Slug', render: (r) => <code className="rounded bg-muted px-1 text-xs">{r.slug}</code> },
                { key: 'plan', header: 'Plan', render: (r) => <Badge variant="secondary">{r.plan}</Badge> },
                { key: 'shipments', header: 'Shipments (MTD)' },
                { key: 'mrr', header: 'MRR' },
                {
                  key: 'status',
                  header: 'Status',
                  render: (r) =>
                    r.status === 'active' ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Suspended</Badge>
                    ),
                },
                {
                  key: 'actions',
                  header: '',
                  render: () => (
                    <Button variant="ghost" size="sm">Manage</Button>
                  ),
                },
              ]}
              data={orgRows}
            />
          </div>

          {/* Feature Flags */}
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Feature Flags</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {featureFlags.map((flag) => (
                    <div
                      key={flag.key}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{flag.description}</p>
                        <p className="text-xs text-muted-foreground font-mono">{flag.key}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {flag.enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Badge variant={flag.enabled ? 'success' : 'secondary'}>
                          {flag.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        <Button variant="ghost" size="sm">Toggle</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Recent Audit Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {[
                    { action: 'USER_LOGIN', actor: 'owner@acme-imports.com', time: '2m ago' },
                    { action: 'QUOTE_CREATED', actor: 'logistics@acme-imports.com', time: '15m ago' },
                    { action: 'SHIPMENT_STATUS_UPDATE', actor: 'system', time: '1h ago' },
                    { action: 'INVOICE_ISSUED', actor: 'sales@ronda.ship', time: '2h ago' },
                    { action: 'USER_INVITED', actor: 'owner@global-trade-co.com', time: '4h ago' },
                  ].map((event, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        <span className="font-medium font-mono text-xs bg-muted rounded px-1">{event.action}</span>
                        {' '}
                        <span className="text-muted-foreground">by {event.actor}</span>
                      </span>
                      <span className="text-muted-foreground text-xs">{event.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Background Workers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {[
                    { name: 'email-notifications', status: 'running', jobs: 2 },
                    { name: 'vessel-tracker', status: 'running', jobs: 0 },
                    { name: 'document-generator', status: 'running', jobs: 1 },
                    { name: 'fx-rate-sync', status: 'running', jobs: 0 },
                    { name: 'invoice-reminder', status: 'idle', jobs: 0 },
                  ].map((worker) => (
                    <div key={worker.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            worker.status === 'running' ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        <span className="font-mono text-xs">{worker.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {worker.jobs} job{worker.jobs !== 1 ? 's' : ''}
                      </span>
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
