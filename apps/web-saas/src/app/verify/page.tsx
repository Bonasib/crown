'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { Package, MessageCircle } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ronda/ui';

function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get('userId') ?? '';
  const phone = params.get('phone') ?? '';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  function handleDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== '')) submitCode(next.join(''));
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function submitCode(code: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/trpc/registration.verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: { userId, code } }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error?.message ?? 'Invalid code. Please try again.');
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }
      // Store token and redirect to onboarding
      const token = data.result?.data?.json?.accessToken;
      if (token) sessionStorage.setItem('accessToken', token);
      router.push('/onboarding');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    try {
      await fetch('/api/trpc/registration.sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: { userId, channel: 'WHATSAPP' } }),
      });
      setResendCooldown(60);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Package className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">Smart Import</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <MessageCircle className="mx-auto mb-2 h-10 w-10 text-green-500" />
            <CardTitle>Verify your WhatsApp</CardTitle>
            <CardDescription>
              We sent a 6-digit code to <strong>{phone}</strong>. Enter it below to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={loading}
                  className="h-14 w-11 rounded-lg border-2 bg-background text-center text-xl font-bold focus:border-primary focus:outline-none disabled:opacity-50"
                />
              ))}
            </div>

            {loading && (
              <p className="text-sm text-muted-foreground">Verifying…</p>
            )}

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}

            <div className="flex flex-col items-center gap-2 text-sm">
              <p className="text-muted-foreground">Didn't receive it?</p>
              <Button
                variant="ghost"
                size="sm"
                disabled={resending || resendCooldown > 0}
                onClick={handleResend}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : resending
                  ? 'Sending…'
                  : 'Resend code via WhatsApp'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Wrong number?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">Go back</Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyOtpForm />
    </Suspense>
  );
}
