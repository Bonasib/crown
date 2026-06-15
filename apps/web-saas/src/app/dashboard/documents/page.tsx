'use client';

import { useState } from 'react';
import { FileText, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';

type DocStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

const STATUS_CONFIG: Record<DocStatus, { label: string; icon: typeof Clock; className: string }> = {
  PENDING: { label: 'Under review', icon: Clock, className: 'text-amber-600' },
  APPROVED: { label: 'Approved', icon: CheckCircle, className: 'text-green-600' },
  REJECTED: { label: 'Rejected', icon: XCircle, className: 'text-destructive' },
};

function UploadModal({ shipmentId, onClose }: { shipmentId: string; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!file || !docType) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem('accessToken');
      const orgId = sessionStorage.getItem('orgId');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('shipmentId', shipmentId);
      formData.append('docType', docType);
      await fetch(`${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'}/trpc/importer.shipments.uploadDocument`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(orgId ? { 'x-org-id': orgId } : {}),
        },
        body: formData,
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-base">Upload document</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {done ? (
            <>
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
                <p className="font-semibold">Document uploaded</p>
                <p className="text-sm text-muted-foreground">Our team will review it and you'll be notified via WhatsApp.</p>
              </div>
              <Button onClick={onClose}>Close</Button>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Document type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select type…</option>
                  <option value="COMMERCIAL_INVOICE">Commercial Invoice</option>
                  <option value="PACKING_LIST">Packing List</option>
                  <option value="BILL_OF_LADING">Bill of Lading</option>
                  <option value="CERTIFICATE_OF_ORIGIN">Certificate of Origin</option>
                  <option value="CUSTOMS_DECLARATION">Customs Declaration</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">File (PDF or image)</label>
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed px-4 py-6 text-center hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground/50" />
                  {file ? (
                    <span className="text-sm font-medium">{file.name}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Click to select file</span>
                  )}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="sr-only"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                <Button onClick={submit} disabled={!file || !docType || loading} className="flex-1">
                  {loading ? 'Uploading…' : 'Upload'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DocumentsPage() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-sm text-muted-foreground">Shipment documents, customs forms, and certificates.</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload document
        </Button>
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <FileText className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No documents yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload shipping documents for your admin to review. Our AI will extract key data automatically.
            </p>
          </div>
          <Button onClick={() => setShowUpload(true)}>Upload first document</Button>
        </CardContent>
      </Card>

      {/* Document types info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supported document types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { type: 'Commercial Invoice', desc: 'Declares goods value for customs' },
              { type: 'Packing List', desc: 'Itemized list of shipment contents' },
              { type: 'Bill of Lading', desc: 'Proof of carriage contract' },
              { type: 'Certificate of Origin', desc: 'Country of manufacture proof' },
              { type: 'Customs Declaration', desc: 'Filed with customs authority' },
              { type: 'Other', desc: 'Any other shipment-related doc' },
            ].map((d) => (
              <div key={d.type} className="flex items-start gap-3 rounded-md border p-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">{d.type}</p>
                  <p className="text-xs text-muted-foreground">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            AI extracts key fields (dates, amounts, HS codes) from uploaded documents. Admin reviews before data is applied.
          </p>
        </CardContent>
      </Card>

      {showUpload && <UploadModal shipmentId="" onClose={() => setShowUpload(false)} />}
    </div>
  );
}
