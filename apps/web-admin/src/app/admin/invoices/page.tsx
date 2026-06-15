'use client';

import { useState } from 'react';
import { CreditCard, Plus, ExternalLink, CheckCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';

function CreateInvoiceModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    orgId: '',
    shipmentId: '',
    description: '',
    amountMinor: '',
    currency: 'USD',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function set(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  const subtotal = form.amountMinor ? parseInt(form.amountMinor) : 0;
  const vat = Math.round(subtotal * 0.15);
  const total = subtotal + vat;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const token = sessionStorage.getItem('accessToken');
      await fetch(`${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'}/trpc/admin.invoices.create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          json: {
            organizationId: form.orgId,
            shipmentId: form.shipmentId || undefined,
            description: form.description,
            amountMinor: subtotal,
            currency: form.currency,
            dueDate: form.dueDate,
          },
        }),
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Create invoice</CardTitle>
        </CardHeader>
        <CardContent>
          {done ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
              <p className="font-semibold">Invoice created</p>
              <p className="text-sm text-muted-foreground">Issue a Stripe payment link to make it payable.</p>
              <Button onClick={onClose}>Done</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Organization ID <span className="text-destructive">*</span></label>
                  <input
                    required
                    value={form.orgId}
                    onChange={(e) => set('orgId', e.target.value)}
                    placeholder="org_…"
                    className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Shipment ID (optional)</label>
                  <input
                    value={form.shipmentId}
                    onChange={(e) => set('shipmentId', e.target.value)}
                    placeholder="shp_…"
                    className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Freight charges for shipment SHA → JED, March 2026"
                  rows={2}
                  className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-sm font-medium">Amount (minor units, pre-VAT) <span className="text-destructive">*</span></label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.amountMinor}
                    onChange={(e) => set('amountMinor', e.target.value)}
                    placeholder="285000 = $2,850.00"
                    className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => set('currency', e.target.value)}
                    className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="USD">USD</option>
                    <option value="SAR">SAR</option>
                    <option value="AED">AED</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Due date <span className="text-destructive">*</span></label>
                <input
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => set('dueDate', e.target.value)}
                  className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {subtotal > 0 && (
                <div className="rounded-md bg-muted px-4 py-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{(subtotal / 100).toFixed(2)} {form.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VAT (15%)</span>
                    <span>{(vat / 100).toFixed(2)} {form.currency}</span>
                  </div>
                  <div className="mt-1 flex justify-between border-t pt-1 font-semibold">
                    <span>Total</span>
                    <span>{(total / 100).toFixed(2)} {form.currency}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating…' : 'Create invoice'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminInvoicesPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-muted-foreground">Create, issue, and track all importer invoices.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create invoice
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b">
        {['All', 'Draft', 'Issued', 'Paid', 'Overdue'].map((tab) => (
          <button
            key={tab}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'All' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <CreditCard className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No invoices yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create an invoice, then issue a Stripe payment link. 15% VAT is calculated automatically.
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)}>Create first invoice</Button>
        </CardContent>
      </Card>

      {/* Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-3">
            {[
              { step: 1, title: 'Create', desc: 'Set amount (pre-VAT), description, and due date. 15% VAT auto-added.' },
              { step: 2, title: 'Importer reviews', desc: 'Importer can approve, request revision, or decline.' },
              { step: 3, title: 'Issue payment link', desc: 'Generate a Stripe Checkout link and share with importer.' },
              { step: 4, title: 'Auto-confirmation', desc: 'Stripe webhook marks invoice PAID when payment completes.' },
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

      {showCreate && <CreateInvoiceModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
