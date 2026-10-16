import type { Metadata } from 'next';
import { MODELS } from '@/lib/catalog/models';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Developers' };

const SUBMIT = `curl -X POST https://your-wilo-host/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "kind": "video",
    "modelId": "wilo-motion",
    "prompt": "a red fox running through snow, camera dollies smoothly forward",
    "aspectRatio": "16:9",
    "duration": 5
  }'`;

const RESPONSE = `{ "id": "replicate:abc123", "status": "queued", "outputs": [], "provider": "replicate" }`;

const POLL = `curl https://your-wilo-host/api/jobs/replicate%3Aabc123
# → { "status": "succeeded", "outputs": ["https://…/output.mp4"] }`;

function Code({ children }: { children: string }) {
  return <pre className="overflow-x-auto rounded-2xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">{children}</pre>;
}

export default function DevelopersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Developers"
        title="One API for every model"
        description="Submit a job, poll for the result. The same endpoints power the Wilo studio."
      />
      <div className="container grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold">1. Submit a generation</h2>
            <p className="text-sm text-muted-foreground">
              <code>POST /api/generate</code> accepts <code>kind</code>, <code>modelId</code>, <code>prompt</code> and optional{' '}
              <code>image</code>, <code>endImage</code>, <code>references</code>, <code>video</code>, <code>audio</code> (data URLs or https URLs),{' '}
              <code>aspectRatio</code>, <code>duration</code>, <code>resolution</code>, <code>count</code>, <code>seed</code>.
            </p>
            <Code>{SUBMIT}</Code>
            <Code>{RESPONSE}</Code>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold">2. Poll the job</h2>
            <p className="text-sm text-muted-foreground">
              <code>GET /api/jobs/:id</code> returns <code>queued</code>, <code>running</code>, <code>succeeded</code> or <code>failed</code>.
              Poll every 2–3 seconds.
            </p>
            <Code>{POLL}</Code>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold">Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Set <code>REPLICATE_API_TOKEN</code> or <code>FAL_KEY</code> (and optionally <code>WILO_PROVIDER</code>). With no key the API runs in
              demo mode and returns placeholder art so the whole product can be explored offline.
            </p>
          </section>
        </div>
        <aside className="h-fit rounded-2xl border border-border bg-surface/60 p-4">
          <h3 className="mb-3 text-sm font-semibold">Model IDs</h3>
          <ul className="space-y-1.5 text-xs">
            {MODELS.map((m) => (
              <li key={m.id} className="flex justify-between gap-3">
                <code className="text-primary">{m.id}</code>
                <span className="truncate text-muted-foreground">{m.kind}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
