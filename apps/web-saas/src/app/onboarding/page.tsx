'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Building2, Globe, CheckCircle } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ronda/ui';

type Step = 'business' | 'preferences' | 'done';

const STEPS: { id: Step; label: string; icon: typeof Package }[] = [
  { id: 'business', label: 'Business details', icon: Building2 },
  { id: 'preferences', label: 'Preferences', icon: Globe },
  { id: 'done', label: 'All set', icon: CheckCircle },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('business');
  const [form, setForm] = useState({ businessName: '', businessAddress: '', preferredLang: 'en' as 'en' | 'ar' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentIndex = STEPS.findIndex((s) => s.id === step);

  async function handleBusinessNext(e: React.FormEvent) {
    e.preventDefault();
    setStep('preferences');
  }

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
      const res = await fetch('/api/trpc/registration.completeOnboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          json: {
            businessName: form.businessName,
            businessAddress: form.businessAddress || undefined,
            preferredLang: form.preferredLang,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error?.message ?? 'Failed to save. Please try again.');
        return;
      }
      setStep('done');
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <Package className="h-7 w-7 text-primary" />
        <span className="text-xl font-bold">Smart Import</span>
      </div>

      {/* Step indicators */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => {
          const done = i < currentIndex;
          const active = s.id === step;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  done
                    ? 'bg-primary text-primary-foreground'
                    : active
                    ? 'border-2 border-primary text-primary'
                    : 'border-2 border-border text-muted-foreground'
                }`}
              >
                {done ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden text-xs sm:block ${active ? 'font-medium' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <div className="mx-1 h-px w-8 bg-border" />}
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-md">
        {step === 'business' && (
          <Card>
            <CardHeader>
              <Building2 className="mb-1 h-7 w-7 text-primary" />
              <CardTitle>Tell us about your business</CardTitle>
              <CardDescription>This helps us personalise your experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBusinessNext} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Business name</label>
                  <input
                    required
                    value={form.businessName}
                    onChange={(e) => setForm((p) => ({ ...p, businessName: e.target.value }))}
                    placeholder="ACME Imports LLC"
                    className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Business address <span className="text-muted-foreground">(optional)</span></label>
                  <textarea
                    rows={3}
                    value={form.businessAddress}
                    onChange={(e) => setForm((p) => ({ ...p, businessAddress: e.target.value }))}
                    placeholder="Street, City, Country"
                    className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button type="submit">Continue</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'preferences' && (
          <Card>
            <CardHeader>
              <Globe className="mb-1 h-7 w-7 text-primary" />
              <CardTitle>Your preferences</CardTitle>
              <CardDescription>Customise your platform experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleComplete} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Preferred language</label>
                  <select
                    value={form.preferredLang}
                    onChange={(e) => setForm((p) => ({ ...p, preferredLang: e.target.value as 'en' | 'ar' }))}
                    className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية (Arabic)</option>
                  </select>
                </div>

                {error && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep('business')}>Back</Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Saving…' : 'Complete setup'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'done' && (
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="mx-auto mb-2 h-12 w-12 text-green-500" />
              <CardTitle>You're all set!</CardTitle>
              <CardDescription>
                Your Smart Import account is ready. Start by adding your first product.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button onClick={() => router.push('/dashboard')}>Go to dashboard</Button>
              <Button variant="outline" onClick={() => router.push('/dashboard/products/new')}>
                Add first product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
