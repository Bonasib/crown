import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" description="Template terms — have counsel review before launch." />
      <article className="container max-w-3xl space-y-6 py-12 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground">
        <h2>1. Using Wilo</h2>
        <p>You must be 18 or older, or the age of majority where you live, to use Wilo. You are responsible for activity on your account.</p>
        <h2>2. Your content</h2>
        <p>You keep ownership of what you upload and generate. You grant Wilo a limited license to process it in order to provide the service.</p>
        <h2 id="acceptable-use">3. Acceptable use</h2>
        <p>
          Do not create content that sexualizes minors, depicts real people without their consent, harasses or defames others, infringes
          intellectual property, or deceives people about its AI origin in a harmful way. Upload only faces you have the right to use.
        </p>
        <h2>4. Credits & billing</h2>
        <p>Credits have no cash value. Failed generations are refunded in credits. Subscriptions renew until cancelled.</p>
        <h2>5. Third-party models</h2>
        <p>Generations are processed by third-party model providers and are subject to their usage policies.</p>
        <h2>6. Liability</h2>
        <p>The service is provided “as is”. To the extent permitted by law, Wilo’s liability is limited to the amount you paid in the last 12 months.</p>
      </article>
    </>
  );
}
