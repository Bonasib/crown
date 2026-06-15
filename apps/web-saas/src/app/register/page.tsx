'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Warehouse, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@ronda/ui';

type AccountType = 'IMPORTER' | 'WAREHOUSE_OPERATOR';

interface FormData {
  accountType: AccountType | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  password: string;
}

const EMPTY_FORM: FormData = {
  accountType: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  businessName: '',
  password: '',
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.accountType) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/trpc/registration.register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: {
            accountType: form.accountType,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            businessName: form.businessName || undefined,
            password: form.password,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error?.message ?? 'Registration failed. Please try again.');
        return;
      }

      const userId = data.result?.data?.json?.userId;
      router.push(`/verify?userId=${userId}&phone=${encodeURIComponent(form.phone)}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <Package className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">Smart Import</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              {step === 1 ? 'Choose your account type to get started.' : 'Fill in your details.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Account type */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {([
                    {
                      type: 'IMPORTER' as AccountType,
                      icon: Package,
                      label: 'Importer',
                      desc: 'I import goods and need to manage shipments, products, and payments.',
                    },
                    {
                      type: 'WAREHOUSE_OPERATOR' as AccountType,
                      icon: Warehouse,
                      label: 'Warehouse Operator',
                      desc: 'I receive and process goods at a warehouse facility.',
                    },
                  ] as const).map(({ type, icon: Icon, label, desc }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, accountType: type }))}
                      className={`flex flex-col gap-3 rounded-lg border-2 p-4 text-left transition-colors hover:border-primary ${
                        form.accountType === type
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="h-6 w-6 text-primary" />
                        {form.accountType === type && (
                          <Badge variant="default" className="text-xs">Selected</Badge>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  disabled={!form.accountType}
                  onClick={() => setStep(2)}
                  className="mt-2"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3" /> Back
                </button>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">First name</label>
                    <input
                      required
                      value={form.firstName}
                      onChange={(e) => setField('firstName', e.target.value)}
                      className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Last name</label>
                    <input
                      required
                      value={form.lastName}
                      onChange={(e) => setField('lastName', e.target.value)}
                      className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Email address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">WhatsApp number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+966 5x xxx xxxx"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">We'll send a verification code via WhatsApp.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Business name <span className="text-muted-foreground">(optional)</span></label>
                  <input
                    value={form.businessName}
                    onChange={(e) => setField('businessName', e.target.value)}
                    className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setField('password', e.target.value)}
                    className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
                </div>

                {error && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" disabled={loading} className="mt-2">
                  {loading ? 'Creating account…' : 'Create account & verify'}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By registering you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-foreground">Terms</Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
