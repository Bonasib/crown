'use client';

import { useState } from 'react';
import { Ship, ChevronDown } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';

type ShipmentStatus = 'READY_TO_SHIP' | 'DEPARTED' | 'IN_TRANSIT' | 'CUSTOMS_CLEARANCE' | 'ARRIVED' | 'DELIVERED';

const STATUSES: ShipmentStatus[] = ['READY_TO_SHIP', 'DEPARTED', 'IN_TRANSIT', 'CUSTOMS_CLEARANCE', 'ARRIVED', 'DELIVERED'];

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  READY_TO_SHIP: 'Ready to ship',
  DEPARTED: 'Departed',
  IN_TRANSIT: 'In transit',
  CUSTOMS_CLEARANCE: 'Customs clearance',
  ARRIVED: 'Arrived',
  DELIVERED: 'Delivered',
};

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  READY_TO_SHIP: 'bg-slate-100 text-slate-700',
  DEPARTED: 'bg-blue-100 text-blue-700',
  IN_TRANSIT: 'bg-amber-100 text-amber-700',
  CUSTOMS_CLEARANCE: 'bg-purple-100 text-purple-700',
  ARRIVED: 'bg-green-100 text-green-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
};

function StatusUpdateModal({
  shipmentId,
  current,
  onClose,
}: {
  shipmentId: string;
  current: ShipmentStatus;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<ShipmentStatus>(current);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('accessToken');
      await fetch(`${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'}/trpc/admin.shipments.updateStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ json: { shipmentId, status, note: note || undefined } }),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-base">Update shipment status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">New status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Note (sent to importer via WhatsApp)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Container departed Jebel Ali port on schedule."
              rows={3}
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={submit} disabled={loading} className="flex-1">
              {loading ? 'Updating…' : 'Update & notify'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminShipmentsPage() {
  const [updating, setUpdating] = useState<{ id: string; status: ShipmentStatus } | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipments</h1>
          <p className="text-sm text-muted-foreground">Manage all shipments and notify importers on stage changes.</p>
        </div>
        <Button>Create shipment</Button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {(['All', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              s === 'All' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {s === 'All' ? 'All' : STATUS_LABELS[s as ShipmentStatus]}
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
              Create a shipment to begin tracking. Importers are notified at each stage via WhatsApp.
            </p>
          </div>
          <Button>Create first shipment</Button>
        </CardContent>
      </Card>

      {/* Stage legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stage reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">
            {STATUSES.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[s]}`}>
                  {i + 1}
                </span>
                <span className="text-sm">{STATUS_LABELS[s]}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Each stage update triggers a WhatsApp notification to the importer with your note.
          </p>
        </CardContent>
      </Card>

      {updating && (
        <StatusUpdateModal
          shipmentId={updating.id}
          current={updating.status}
          onClose={() => setUpdating(null)}
        />
      )}
    </div>
  );
}
