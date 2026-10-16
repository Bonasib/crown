import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoMark } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Poster } from '@/components/media/poster';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <LogoMark className="mx-auto size-10" />
            <h1 className="font-display text-2xl font-bold">Welcome to Wilo</h1>
            <p className="text-sm text-muted-foreground">Sign in or create an account to sync your library across devices.</p>
          </div>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full" disabled>
              Continue with Google
            </Button>
            <Button variant="secondary" className="w-full" disabled>
              Continue with Apple
            </Button>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <form className="space-y-3">
            <Input type="email" placeholder="you@example.com" aria-label="Email" disabled />
            <Button variant="brand" className="w-full" disabled>
              Email me a magic link
            </Button>
          </form>
          <p className="rounded-xl border border-border bg-surface p-3 text-center text-xs text-muted-foreground">
            Accounts are on the <Link href="/roadmap" className="text-primary">roadmap</Link>. Until then your work is saved in this browser —{' '}
            <Link href="/video" className="text-primary">start creating</Link>.
          </p>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Poster seed="login-hero" motion="drift" className="absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-10">
          <p className="font-display text-3xl font-bold">“Ten seconds from idea to shot.”</p>
        </div>
      </div>
    </div>
  );
}
