'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ScanLine, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@ronda/ui';

type ScanState = 'idle' | 'manual' | 'loading' | 'found' | 'error' | 'done';

type ProductInfo = {
  id: string;
  barcode: string;
  productName: string;
  orgName: string;
  weightKg?: number;
};

export default function ReceivePage() {
  const [state, setState] = useState<ScanState>('idle');
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [form, setForm] = useState({ quantity: '1', condition: 'GOOD', notes: '' });
  const [error, setError] = useState('');

  function setField(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function lookup(code: string) {
    setState('loading');
    setError('');
    try {
      const token = sessionStorage.getItem('accessToken');
      const orgId = sessionStorage.getItem('orgId');
      const res = await fetch(
        `${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'}/trpc/warehouse.get?input=${encodeURIComponent(JSON.stringify({ json: { barcode: code } }))}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(orgId ? { 'x-org-id': orgId } : {}),
          },
        }
      );
      const data = await res.json();
      if (!res.ok || data.error) {
        setError('Barcode not found. Check the code and try again.');
        setState('error');
        return;
      }
      setProduct(data.result?.data?.json ?? null);
      setState('found');
    } catch {
      setError('Network error. Please try again.');
      setState('error');
    }
  }

  async function submitReceiving() {
    if (!product) return;
    setState('loading');
    try {
      const token = sessionStorage.getItem('accessToken');
      const orgId = sessionStorage.getItem('orgId');
      await fetch(`${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'}/trpc/warehouse.recordReceiving`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(orgId ? { 'x-org-id': orgId } : {}),
        },
        body: JSON.stringify({
          json: {
            barcodeId: product.id,
            quantityReceived: parseInt(form.quantity),
            condition: form.condition,
            notes: form.notes || undefined,
          },
        }),
      });
      setState('done');
    } catch {
      setError('Failed to record receiving. Please try again.');
      setState('found');
    }
  }

  function reset() {
    setState('idle');
    setBarcode('');
    setProduct(null);
    setForm({ quantity: '1', condition: 'GOOD', notes: '' });
    setError('');
  }

  if (state === 'done') {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Link href="/warehouse" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Dashboard
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <CheckCircle className="h-16 w-16 text-green-600" />
            <div>
              <p className="text-xl font-bold">Receiving recorded</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {product?.productName} has been recorded. The importer has been notified via WhatsApp.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={reset}>Scan another</Button>
              <Button asChild>
                <Link href="/warehouse">Back to dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/warehouse" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Receive goods</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Step 1: scan / enter barcode */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Step 1 — Scan or enter barcode</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Camera scan placeholder */}
              <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed bg-muted/30">
                <ScanLine className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Camera scanner (mobile)</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/warehouse/receive/scan">Open camera scanner</Link>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or enter manually</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="flex gap-2">
                <input
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && barcode && lookup(barcode)}
                  placeholder="PRD-… or CTN-…"
                  className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={() => lookup(barcode)} disabled={!barcode || state === 'loading'}>
                  {state === 'loading' ? 'Looking up…' : 'Look up'}
                </Button>
              </div>

              {state === 'error' && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product info */}
          {product && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="flex items-start gap-3 p-4">
                <Package className="mt-0.5 h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">{product.productName}</p>
                  <p className="text-sm text-green-700">{product.orgName}</p>
                  <p className="text-xs text-green-600 mt-1">{product.barcode}</p>
                  {product.weightKg && (
                    <p className="text-xs text-green-600">{product.weightKg} kg</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Step 2: receiving details */}
        {state === 'found' && product && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Step 2 — Confirm receiving details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Quantity received</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setField('quantity', e.target.value)}
                  className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => setField('condition', e.target.value)}
                  className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="GOOD">Good</option>
                  <option value="DAMAGED">Damaged</option>
                  <option value="PARTIAL">Partial</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  placeholder="e.g. 2 units had damaged packaging"
                  rows={3}
                  className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button onClick={submitReceiving} className="w-full">
                Record receiving & notify importer
              </Button>
            </CardContent>
          </Card>
        )}

        {state !== 'found' && (
          <Card className="flex flex-col items-center justify-center text-center">
            <CardContent className="py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-3 text-sm text-muted-foreground">
                Scan or enter a barcode on the left to load product details.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
