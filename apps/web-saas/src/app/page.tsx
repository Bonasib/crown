import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';
import { Package, FileText, TrendingUp, CheckCircle, Scan, Warehouse, Bell, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Smart Import</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-4 py-24 text-center">
        <Badge variant="secondary" className="text-sm">Now in early access</Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Import smarter.<br className="hidden sm:block" /> Ship with confidence.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Smart Import connects importers, warehouse operators, and administrators through one
          unified platform — from product setup to Stripe-powered payment.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/register">
              Start for free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign in to your account</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: 'Delivery phases', value: '3' },
            { label: 'User journeys', value: '5' },
            { label: 'Connected services', value: '4' },
            { label: 'AI integrations', value: '3' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-primary">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Everything you need to import at scale</h2>
            <p className="mt-3 text-muted-foreground">Built for importers, warehouse teams, and administrators.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Package,
                title: 'Product & barcode management',
                description: 'Add products with AI-assisted descriptions and HS Code suggestions. Auto-generate QR barcodes your supplier can scan at dispatch.',
              },
              {
                icon: Scan,
                title: 'Warehouse receiving',
                description: 'Scan a barcode to instantly identify incoming goods. Record actual weight, dimensions, and photos — all linked to the shipment.',
              },
              {
                icon: FileText,
                title: 'Document engine with OCR',
                description: 'Upload any commercial invoice or packing list. AI extracts quantities, values, and HS Codes for one-click admin verification.',
              },
              {
                icon: TrendingUp,
                title: 'Stripe-powered invoicing',
                description: 'Receive, approve, decline, or request revision on invoices. Pay securely via card or bank transfer — confirmed automatically by webhook.',
              },
              {
                icon: Bell,
                title: 'WhatsApp + SMS notifications',
                description: 'Every status change triggers an automatic notification to the right party. No chasing for updates.',
              },
              {
                icon: ShieldCheck,
                title: 'Audit trail & compliance',
                description: 'Every action is logged with timestamp, actor, and before/after state. Full document version history with integrity verification.',
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-border/50">
                <CardHeader>
                  <feature.icon className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">How it works</h2>
            <p className="mt-3 text-muted-foreground">Three actors, one platform, end-to-end.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                role: 'Importer',
                color: 'text-primary',
                steps: ['Register & verify via WhatsApp OTP', 'Add products, get AI description & HS Code', 'Share barcode with supplier via WhatsApp', 'Track shipment, approve invoice, pay via Stripe'],
              },
              {
                role: 'Warehouse',
                color: 'text-amber-600',
                steps: ['Scan barcode when goods arrive', 'Record weight, dimensions, photos', 'Send supplier magic link for dispatch details', 'Monitor receiving dashboard'],
              },
              {
                role: 'Admin',
                color: 'text-violet-600',
                steps: ['Review AI-extracted document data', 'Manage HS Code suggestions queue', 'Issue & revise invoices', 'Update shipment status — notifications fire automatically'],
              },
            ].map((actor) => (
              <div key={actor.role} className="flex flex-col gap-4">
                <h3 className={`text-lg font-semibold ${actor.color}`}>{actor.role}</h3>
                <ol className="flex flex-col gap-3">
                  {actor.steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {i + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary px-4 py-20 text-center text-primary-foreground">
        <div className="container mx-auto">
          <Zap className="mx-auto mb-4 h-10 w-10 opacity-80" />
          <h2 className="mb-4 text-3xl font-bold">Ready to import smarter?</h2>
          <p className="mb-8 text-primary-foreground/80">Join importers and warehouse teams already on the platform.</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Create your free account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Smart Import Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
