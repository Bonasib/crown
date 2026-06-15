import Link from 'next/link';
import { Ship, CreditCard, Package, FileText, Tag, Users, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';

export default function AdminDashboard() {
  const kpis = [
    { label: 'Active shipments', value: '—', icon: Ship, href: '/admin/shipments' },
    { label: 'Pending invoices', value: '—', icon: CreditCard, href: '/admin/invoices' },
    { label: 'Docs to review', value: '—', icon: FileText, href: '/admin/documents' },
    { label: 'HS codes to approve', value: '—', icon: Tag, href: '/admin/hs-codes' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform-wide operations overview.</p>
      </div>

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{k.label}</p>
                  <p className="text-3xl font-bold">{k.value}</p>
                </div>
                <k.icon className="h-8 w-8 text-muted-foreground/40" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI queues */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">AI queues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Link href="/admin/hs-codes" className="flex items-center justify-between rounded-md border p-3 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">HS Code suggestions</p>
                    <p className="text-xs text-muted-foreground">AI-suggested codes pending admin approval</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/admin/documents" className="flex items-center justify-between rounded-md border p-3 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Document OCR review</p>
                    <p className="text-xs text-muted-foreground">Extracted data from uploaded documents</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted-foreground">
              <Clock className="h-10 w-10 opacity-30" />
              <p>No recent events.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { href: '/admin/shipments', icon: Ship, label: 'Manage shipments', desc: 'Update status, track progress' },
              { href: '/admin/invoices', icon: CreditCard, label: 'Create invoice', desc: 'Issue invoice with Stripe link' },
              { href: '/admin/users', icon: Users, label: 'User management', desc: 'View importers, toggle access' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:border-primary hover:bg-muted/50"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
