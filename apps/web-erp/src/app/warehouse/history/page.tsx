import Link from 'next/link';
import { Package, ScanLine } from 'lucide-react';
import { Button, Card, CardContent } from '@ronda/ui';

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Receiving history</h1>
          <p className="text-sm text-muted-foreground">All goods received at this warehouse.</p>
        </div>
        <Button asChild>
          <Link href="/warehouse/receive">
            <ScanLine className="mr-2 h-4 w-4" /> Receive goods
          </Link>
        </Button>
      </div>

      {/* Date filter */}
      <div className="flex gap-2 border-b">
        {['Today', 'This week', 'This month', 'All time'].map((tab) => (
          <button
            key={tab}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'Today' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Package className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No receivings yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Scan a product barcode to record your first receiving. All history will appear here.
            </p>
          </div>
          <Button asChild>
            <Link href="/warehouse/receive">Start receiving</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
