'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle, XCircle, MessageSquare, ExternalLink, ChevronDown } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';

type InvoiceStatus = 'PENDING' | 'ISSUED' | 'PAID' | 'OVERDUE' | 'DECLINED';

type Invoice = {
  id: string;
  invoiceNumber: string;
  amountMinor: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  issuedAt: string;
  stripePaymentLink?: string;
  description: string;
};

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  ISSUED: { label: 'Awaiting payment', variant: 'default' },
  PAID: { label: 'Paid', variant: 'outline' },
  OVERDUE: { label: 'Overdue', variant: 'destructive' },
  DECLINED: { label: 'Declined', variant: 'destructive' },
};

function formatAmount(minor: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100);
}

function RespondModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const [action, setAction] = useState<'APPROVED' | 'DECLINED' | 'REVISION_REQUESTED' | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!action) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem('accessToken');
      const orgId = sessionStorage.getItem('orgId');
      await fetch(`${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'}/trpc/importer.invoices.respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(orgId ? { 'x-org-id': orgId } : {}),
        },
        body: JSON.stringify({ json: { invoiceId: invoice.id, action, note: note || undefined } }),
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
          <CardTitle className="text-base">Respond to invoice {invoice.invoiceNumber}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{invoice.description}</p>
          <p className="font-semibold">{formatAmount(invoice.amountMinor, invoice.currency)}</p>

          <div className="flex flex-col gap-2">
            {(['APPROVED', 'REVISION_REQUESTED', 'DECLINED'] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAction(a)}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors text-left ${
                  action === a ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
              >
                {a === 'APPROVED' && '✓ Approve invoice'}
                {a === 'REVISION_REQUESTED' && '⟳ Request revision'}
                {a === 'DECLINED' && '✕ Decline invoice'}
              </button>
            ))}
          </div>

          {(action === 'REVISION_REQUESTED' || action === 'DECLINED') && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note explaining your decision…"
              rows={3}
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={submit} disabled={!action || loading} className="flex-1">
              {loading ? 'Submitting…' : 'Submit response'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InvoicesPage() {
  const [respondingTo, setRespondingTo] = useState<Invoice | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Invoices</h1>
        <p className="text-sm text-muted-foreground">Review and pay your freight invoices.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b">
        {['All', 'Pending', 'Awaiting payment', 'Paid'].map((tab) => (
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
          <CreditCard className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No invoices yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your admin will generate invoices for your shipments. You can approve, request revisions, or pay directly here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* How invoices work */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: MessageSquare, title: 'Review & respond', desc: 'You can approve, request a revision, or decline any invoice before payment.' },
          { icon: CreditCard, title: 'Pay via Stripe', desc: 'Approved invoices include a secure Stripe payment link. No card details stored here.' },
          { icon: CheckCircle, title: 'Auto-confirmation', desc: 'Payment confirmed automatically via Stripe webhook — no manual back-and-forth.' },
        ].map((f) => (
          <Card key={f.title} className="border-dashed">
            <CardContent className="flex flex-col gap-2 p-5">
              <f.icon className="h-6 w-6 text-primary" />
              <p className="font-medium text-sm">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {respondingTo && (
        <RespondModal invoice={respondingTo} onClose={() => setRespondingTo(null)} />
      )}
    </div>
  );
}
