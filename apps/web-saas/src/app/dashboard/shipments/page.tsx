import Link from 'next/link';
import { Ship, Clock, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';

const STAGE_LABELS = [
  'Ready to ship',
  'Departed',
  'In transit',
  'Customs clearance',
  'Arrived',
  'Delivered',
];

function MiniTimeline({ currentStage }: { currentStage: number }) {
  return (
    <div className="flex items-center gap-1">
      {STAGE_LABELS.map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < currentStage ? 'bg-primary' : i === currentStage ? 'bg-primary/50' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );
}

export default function ShipmentsPage() {
  // In production: fetch from importer.shipments.list API
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Shipments</h1>
        <p className="text-sm text-muted-foreground">Track your active and completed shipments.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b">
        {['All', 'Active', 'Delivered'].map((tab) => (
          <button
            key={tab}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'All'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Ship className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No shipments yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Once your admin creates a shipment for you, it will appear here with a live tracking timeline.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shipment stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {STAGE_LABELS.map((label, i) => (
              <div key={label} className="flex min-w-0 flex-col items-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {i + 1}
                </div>
                <span className="whitespace-nowrap text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            You'll receive a WhatsApp notification at each stage change.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
