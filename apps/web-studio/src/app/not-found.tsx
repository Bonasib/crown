import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-display text-7xl font-bold text-gradient">404</p>
      <p className="text-muted-foreground">This shot didn’t make the final cut.</p>
      <Button asChild variant="brand">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
