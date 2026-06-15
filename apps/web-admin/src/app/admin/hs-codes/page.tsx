'use client';

import { useState } from 'react';
import { Tag, CheckCircle, Edit2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';

type HsCodeItem = {
  productId: string;
  productName: string;
  org: string;
  aiSuggestion: string;
  confidence: number;
  reasoning: string;
};

function ApproveModal({ item, onClose }: { item: HsCodeItem; onClose: () => void }) {
  const [hsCode, setHsCode] = useState(item.aiSuggestion);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('accessToken');
      await fetch(`${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'}/trpc/admin.hsCode.approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ json: { productId: item.productId, hsCode } }),
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
          <CardTitle className="text-base">Approve HS Code</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="font-medium">{item.productName}</p>
            <p className="text-xs text-muted-foreground">{item.org}</p>
          </div>

          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm">
            <p className="font-medium text-blue-700">AI suggestion: {item.aiSuggestion}</p>
            <p className="text-xs text-blue-600 mt-1">Confidence: {Math.round(item.confidence * 100)}%</p>
            <p className="text-xs text-blue-600 mt-1">{item.reasoning}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Confirmed HS Code</label>
            <input
              value={hsCode}
              onChange={(e) => setHsCode(e.target.value)}
              placeholder="e.g. 8518.30"
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">Edit if the AI suggestion needs correction before approving.</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={submit} disabled={!hsCode || loading} className="flex-1">
              {loading ? 'Approving…' : 'Approve & apply'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminHsCodesPage() {
  const [approving, setApproving] = useState<HsCodeItem | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">HS Code Approval</h1>
        <p className="text-sm text-muted-foreground">Review AI-suggested HS codes before they're applied to products.</p>
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Tag className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No HS codes pending approval</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When importers add products, AI suggests HS codes. They appear here for your review before being applied.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About HS Code suggestions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p className="text-muted-foreground">
            The Harmonized System (HS) code is a 6-digit classification used for international trade and customs.
            AI analyzes the product name and description to suggest the correct code.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { icon: Tag, title: 'AI analysis', desc: 'Claude analyzes product details and suggests the most likely HS code.' },
              { icon: CheckCircle, title: 'Admin confirms', desc: 'You review the suggestion and can edit before approving.' },
              { icon: Edit2, title: 'Applied to product', desc: 'Approved code is saved to the product and visible to the importer.' },
            ].map((f) => (
              <div key={f.title} className="flex flex-col gap-1 rounded-md border p-3">
                <f.icon className="h-4 w-4 text-primary" />
                <p className="font-medium text-sm">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {approving && <ApproveModal item={approving} onClose={() => setApproving(null)} />}
    </div>
  );
}
