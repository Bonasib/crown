import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" description="Template policy — have counsel review before launch." />
      <article className="container max-w-3xl space-y-6 py-12 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground">
        <h2>What we collect</h2>
        <p>Account details, prompts, uploads, generated outputs, and usage and billing records.</p>
        <h2>How we use it</h2>
        <p>To run generations, keep your library, prevent abuse and improve the product. We never sell personal data.</p>
        <h2>Model providers</h2>
        <p>Prompts and uploads are sent to the model provider that runs your generation (for example Replicate or fal) only for that purpose.</p>
        <h2>Your faces</h2>
        <p>Persona photos are used only for your own generations and can be deleted at any time.</p>
        <h2>Your rights</h2>
        <p>You can request access, correction, export or deletion of your data by contacting privacy@wilo.ai.</p>
      </article>
    </>
  );
}
