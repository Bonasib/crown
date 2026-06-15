import Link from 'next/link';
import { ScanLine, Package, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@ronda/ui';

export default function WarehouseDashboard() {
  const stats = [
    { label: "Today's receivings", value: '—', icon: Package },
    { label: 'Pending supplier links', value: '—', icon: Clock },
    { label: 'Total received (30d)', value: '—', icon: CheckCircle },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Warehouse Dashboard</h1>
          <p className="text-sm text-muted-foreground">Scan barcodes and record incoming goods.</p>
        </div>
        <Button asChild>
          <Link href="/warehouse/receive">
            <ScanLine className="mr-2 h-4 w-4" /> Receive goods
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-bold">{s.value}</p>
              </div>
              <s.icon className="h-8 w-8 text-muted-foreground/40" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scan CTA */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ScanLine className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Ready to receive goods?</p>
              <p className="text-sm text-muted-foreground">Scan a PRD or CTN barcode to start a receiving record.</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/warehouse/receive">
              Start scanning <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent receivings empty state */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Recent receivings</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/warehouse/history">View all <ArrowRight className="ml-1 h-3 w-3" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 py-10 text-center text-sm text-muted-foreground">
            <Package className="h-10 w-10 opacity-30" />
            <p>No receivings recorded yet.</p>
            <p className="text-xs">Scan a product barcode to record your first receiving.</p>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How to receive goods</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-3">
            {[
              { step: 1, title: 'Scan barcode', desc: 'Use your camera or handheld scanner to scan the PRD or CTN barcode on the shipment.' },
              { step: 2, title: 'Confirm details', desc: 'Verify product name, quantity, and condition. Add any notes.' },
              { step: 3, title: 'Record receiving', desc: 'Save the record — the importer is notified automatically via WhatsApp.' },
            ].map((item) => (
              <li key={item.step} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
