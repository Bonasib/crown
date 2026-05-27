import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard, Badge } from '@ronda/ui';
import {
  Package,
  Ship,
  FileText,
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function CustomerPortalHome() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Ship className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-primary">Ronda Ship</span>
            <Badge variant="secondary" className="ml-2 text-xs">Customer Portal</Badge>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="font-medium hover:text-primary">Dashboard</Link>
            <Link href="/shipments" className="text-muted-foreground hover:text-primary">Shipments</Link>
            <Link href="/quotes" className="text-muted-foreground hover:text-primary">Quotes</Link>
            <Link href="/documents" className="text-muted-foreground hover:text-primary">Documents</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/quotes/new">Get Quote</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">China → Saudi Arabia · UAE · USA</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Freight Forwarding,{' '}
            <span className="text-primary">Simplified</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Book, track, and manage your LCL and FCL shipments from China to the Middle East and beyond.
            Real-time tracking, automated documents, and full customs support.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/quotes/new">
                <Package className="mr-2 h-4 w-4" />
                Get Instant Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/track">Track Shipment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            title="Active Shipments"
            value="12"
            description="3 arriving this week"
            icon={<Ship className="h-4 w-4" />}
            trend={{ value: 8, label: 'vs last month', positive: true }}
          />
          <StatCard
            title="Pending Quotes"
            value="3"
            description="2 expiring soon"
            icon={<FileText className="h-4 w-4" />}
          />
          <StatCard
            title="Delivered (YTD)"
            value="47"
            description="On-time rate: 94%"
            icon={<CheckCircle className="h-4 w-4" />}
            trend={{ value: 12, label: 'vs last year', positive: true }}
          />
          <StatCard
            title="Avg Transit"
            value="22 days"
            description="China → Jeddah"
            icon={<Clock className="h-4 w-4" />}
          />
        </div>
      </section>

      {/* Recent Shipments */}
      <section className="container mx-auto px-4 py-4">
        <h2 className="mb-4 text-xl font-semibold">Recent Shipments</h2>
        <div className="space-y-3">
          {[
            {
              id: 'SHP-2025-001',
              origin: 'Shanghai',
              dest: 'Jeddah',
              status: 'IN_TRANSIT',
              eta: 'Mar 9, 2025',
              mode: 'FCL 40FT',
            },
            {
              id: 'SHP-2025-002',
              origin: 'Ningbo',
              dest: 'Dubai',
              status: 'CUSTOMS_IMPORT',
              eta: 'Mar 2, 2025',
              mode: 'LCL',
            },
            {
              id: 'SHP-2025-003',
              origin: 'Shenzhen',
              dest: 'Los Angeles',
              status: 'BOOKED',
              eta: 'Apr 15, 2025',
              mode: 'FCL 20FT',
            },
          ].map((shipment) => (
            <Card key={shipment.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <Ship className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{shipment.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {shipment.origin} → {shipment.dest} · {shipment.mode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">ETA</p>
                    <p className="text-sm font-medium">{shipment.eta}</p>
                  </div>
                  <Badge
                    variant={
                      shipment.status === 'IN_TRANSIT' ? 'default' :
                      shipment.status === 'CUSTOMS_IMPORT' ? 'warning' :
                      'info'
                    }
                  >
                    {shipment.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold">Everything you need</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Real-time Tracking</CardTitle>
              <CardDescription>
                Track your cargo from factory floor to warehouse door with live vessel tracking.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Document Management</CardTitle>
              <CardDescription>
                All your shipping documents in one place. Auto-generate packing lists and commercial invoices.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Instant Quotes</CardTitle>
              <CardDescription>
                Get transparent pricing breakdowns for LCL and FCL shipments across all major trade lanes.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Ronda Ship. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
