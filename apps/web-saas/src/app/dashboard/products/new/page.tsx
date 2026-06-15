'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Package } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ronda/ui';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    hsCode: '',
    weightKg: '',
    lengthCm: '',
    widthCm: '',
    heightCm: '',
  });

  function set(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('accessToken');
      const orgId = sessionStorage.getItem('orgId');
      const res = await fetch(`${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'}/trpc/products.create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(orgId ? { 'x-org-id': orgId } : {}),
        },
        body: JSON.stringify({
          json: {
            name: form.name,
            hsCode: form.hsCode || undefined,
            weightKg: form.weightKg ? parseFloat(form.weightKg) : undefined,
            lengthCm: form.lengthCm ? parseFloat(form.lengthCm) : undefined,
            widthCm: form.widthCm ? parseFloat(form.widthCm) : undefined,
            heightCm: form.heightCm ? parseFloat(form.heightCm) : undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error?.message ?? 'Failed to create product');
        return;
      }
      router.push('/dashboard/products');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/dashboard/products" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Products
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Add product</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product details</CardTitle>
              <CardDescription>AI will suggest a description and HS Code after you save.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Product name <span className="text-destructive">*</span></label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Wireless Bluetooth Headphones"
                  className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">HS Code <span className="text-muted-foreground">(optional — AI will suggest if blank)</span></label>
                <input
                  value={form.hsCode}
                  onChange={(e) => set('hsCode', e.target.value)}
                  placeholder="e.g. 8518.30"
                  className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Weight (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={form.weightKg}
                  onChange={(e) => set('weightKg', e.target.value)}
                  placeholder="0.350"
                  className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Dimensions (cm)</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['lengthCm', 'widthCm', 'heightCm'] as const).map((k) => (
                    <div key={k} className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground capitalize">{k.replace('Cm', '')}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={form[k]}
                        onChange={(e) => set(k, e.target.value)}
                        placeholder="0"
                        className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating…' : 'Create product & generate barcode'}
            </Button>
          </div>
        </form>

        {/* Info panel */}
        <div className="flex flex-col gap-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">AI assistance</span>
              </div>
              <p className="text-xs text-muted-foreground">
                After saving, we'll automatically:
              </p>
              <ul className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                <li>• Generate a professional product description</li>
                <li>• Suggest the correct HS Code (admin-confirmed)</li>
                <li>• Create a PRD barcode with QR deep link</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Why dimensions?</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Accurate weight and dimensions help calculate CBM, container recommendations, and shipping costs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
