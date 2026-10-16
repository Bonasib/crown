import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'About' };

const VALUES = [
  { title: 'Directors, not prompt engineers', body: 'Presets, apps and studios turn film vocabulary into buttons, so anyone can direct a shot.' },
  { title: 'Every model, no lock-in', body: 'We ship the best model for each job the week it launches, behind one credit balance.' },
  { title: 'Your likeness is yours', body: 'Personas are private by default and never used to train shared models.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Wilo"
        title="We’re building the creative studio for the AI era"
        description="Wilo gives creators, marketers and filmmakers a single place to imagine, shoot and ship visual stories."
      />
      <div className="container grid gap-4 py-12 md:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-3xl border border-border bg-surface p-6">
            <h2 className="font-display text-lg font-bold">{v.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </div>
      <div className="container pb-16 text-center">
        <Button asChild variant="brand" size="lg">
          <Link href="/video">Start creating</Link>
        </Button>
      </div>
    </>
  );
}
