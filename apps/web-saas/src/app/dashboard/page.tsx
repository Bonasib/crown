import Link from 'next/link';
import { Package, Ship, CreditCard, Plus, ArrowRight, CheckCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@ronda/ui';

export default function ImporterDashboard() {
  const stats = [
    { label: 'Active shipments', value: '—', icon: Ship, href: '/dashboard/shipments' },
    { label: 'Pending invoices', value: '—', icon: CreditCard, href: '/dashboard/invoices' },
    { label: 'Products', value: '—', icon: Package, href: '/dashboard/products' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back. Here's what's happening.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add product
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold">{s.value}</p>
                </div>
                <s.icon className="h-8 w-8 text-muted-foreground/40" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent shipments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/shipments">View all <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted-foreground">
              <Ship className="h-10 w-10 opacity-30" />
              <p>No shipments yet.</p>
              <p className="text-xs">Add products and your admin will create your first shipment.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Pending invoices</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/invoices">View all <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted-foreground">
              <CreditCard className="h-10 w-10 opacity-30" />
              <p>No pending invoices.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Getting started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { step: 1, label: 'Add your products', desc: 'Name, dimensions, image — AI suggests the HS Code.', href: '/dashboard/products/new' },
              { step: 2, label: 'Share barcodes', desc: 'Send your product barcode to your supplier via WhatsApp.', href: '/dashboard/products' },
              { step: 3, label: 'Track & pay', desc: 'Follow your shipment and pay invoices via Stripe.', href: '/dashboard/shipments' },
            ].map((item) => (
              <Link key={item.step} href={item.href} className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:border-primary hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {item.step}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
