'use client';

import { useState } from 'react';
import { FileText, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';

type DocStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type Document = {
  id: string;
  type: string;
  org: string;
  uploadedAt: string;
  status: DocStatus;
  extractedData?: Record<string, string>;
};

const STATUS_CONFIG: Record<DocStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pending review', className: 'bg-amber-100 text-amber-700' },
  APPROVED: { label: 'Approved', className: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
};

function ReviewModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const [action, setAction] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!action) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem('accessToken');
      await fetch(
        `${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'}/trpc/admin.documents.${action === 'APPROVED' ? 'approve' : 'reject'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ json: { documentId: doc.id, note: note || undefined } }),
        }
      );
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Review document — {doc.type}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Document preview placeholder */}
            <div className="flex h-48 items-center justify-center rounded-md border bg-muted">
              <div className="text-center text-muted-foreground">
                <FileText className="mx-auto h-10 w-10 opacity-50" />
                <p className="mt-2 text-xs">Document preview</p>
              </div>
            </div>

            {/* AI-extracted data */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">AI-extracted data</p>
              {doc.extractedData ? (
                <div className="rounded-md border divide-y">
                  {Object.entries(doc.extractedData).map(([k, v]) => (
                    <div key={k} className="flex justify-between px-3 py-2 text-xs">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border p-4 text-center text-xs text-muted-foreground">
                  AI extraction pending…
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setAction('APPROVED')}
              className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                action === 'APPROVED' ? 'border-green-600 bg-green-50 text-green-700' : 'hover:bg-muted'
              }`}
            >
              <CheckCircle className="mr-1.5 inline h-4 w-4" />
              Approve
            </button>
            <button
              onClick={() => setAction('REJECTED')}
              className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                action === 'REJECTED' ? 'border-red-600 bg-red-50 text-red-700' : 'hover:bg-muted'
              }`}
            >
              <XCircle className="mr-1.5 inline h-4 w-4" />
              Reject
            </button>
          </div>

          {action && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note to importer…"
              rows={2}
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={submit} disabled={!action || loading} className="flex-1">
              {loading ? 'Submitting…' : 'Confirm decision'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDocumentsPage() {
  const [reviewing, setReviewing] = useState<Document | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-sm text-muted-foreground">Review AI-extracted data from importer-uploaded documents.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {['All', 'Pending review', 'Approved', 'Rejected'].map((tab) => (
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
          <FileText className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No documents to review</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Documents uploaded by importers appear here after AI extraction. Review and approve or reject extracted data.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* OCR info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How document review works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-3">
            {[
              { step: 1, title: 'Upload', desc: 'Importer uploads a PDF or image document.' },
              { step: 2, title: 'AI extraction', desc: 'Claude AI extracts key fields (amounts, dates, HS codes, parties).' },
              { step: 3, title: 'Admin review', desc: 'You review the extracted data side-by-side with the original document.' },
              { step: 4, title: 'Approval', desc: 'Approving applies the data; rejecting notifies the importer via WhatsApp.' },
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

      {reviewing && <ReviewModal doc={reviewing} onClose={() => setReviewing(null)} />}
    </div>
  );
}
