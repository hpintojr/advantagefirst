import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Star, BadgeCheck, Phone } from 'lucide-react';
import QualificationForm from '@/components/QualificationForm';
import { fetchLeadByUniqueId, isValidUniqueId } from '@/lib/qualification';

/**
 * adv1st.app/{short_code} — personalized pre-selection landing page.
 * Server component: looks the lead up by short_code and prefills the form.
 * Invalid AND expired IDs both render the identical not-found page so
 * scanners can't tell a miss from an expired link.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Complete Your Pre-Selection | Advantage First Financial',
  robots: { index: false, follow: false },
};

const fmtUSD = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);

export default async function LeadQualificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isValidUniqueId(id)) notFound();

  const lead = await fetchLeadByUniqueId(id);
  if (!lead) notFound();

  return (
    <main className="min-h-screen bg-mesh-hero">
      {/* ── Header / Trust bar ── */}
      <header className="border-b border-pv-line bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-md px-4 py-4 sm:max-w-lg">
          <div className="flex items-center justify-between">
            <Image
              src="/images/DT_Logo_tight.png"
              alt="Advantage First Financial"
              width={293}
              height={64}
              className="h-16 w-auto"
              priority
            />
            <a
              href="tel:+19496695546"
              className="flex items-center gap-1.5 text-sm font-bold text-af-blue hover:underline"
            >
              <Phone className="h-4 w-4" fill="currentColor" />
              (949) 669-5546
            </a>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-pv-muted">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-trust-green" fill="currentColor" />
              4.9/5 on Trustpilot
            </span>
            <span className="flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5 text-af-blue" />
              A+ Rating
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-af-blue" />
              10 Years in Business
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-md px-4 pt-8 text-center sm:max-w-lg">
        <h1 className="font-display text-3xl font-black text-af-navy">
          Congratulations, {lead.firstName}!
        </h1>
        <p className="mt-3 text-pv-muted">
          You are <span className="font-bold text-af-navy">pre-selected</span> for a Debt
          Consolidation Loan{lead.loanAmount ? ' up to' : '.'}
        </p>
        {lead.loanAmount ? (
          <p className="mt-1 font-display text-5xl font-black tracking-tight text-af-blue">
            {fmtUSD(Math.ceil(lead.loanAmount / 1000) * 1000)}
          </p>
        ) : null}
        <ul className="mx-auto mt-4 inline-flex flex-col gap-1.5 text-left text-sm text-pv-text">
          <li className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 shrink-0 text-trust-green" />
            One low FIXED monthly payment
          </li>
          <li className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 shrink-0 text-trust-green" />
            Rates as low as 5.99% APR
          </li>
          <li className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 shrink-0 text-trust-green" />
            No hidden fees or early payoff penalties
          </li>
        </ul>
      </section>

      {/* ── Form card ── */}
      <section className="mx-auto max-w-md px-4 py-8 sm:max-w-lg">
        <div className="double-bezel">
          <div className="double-bezel-inner overflow-hidden">
            <QualificationForm lead={lead} />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-pv-muted">
          100% online &bull; Same-day direct deposit available &bull; Checking your
          options will <span className="font-semibold">not</span> affect your credit
          score.
        </p>
      </section>

      {/* ── Brief disclosures + link to full page ── */}
      <section className="mx-auto max-w-2xl border-t border-pv-line px-4 py-6 text-[11px] leading-relaxed text-pv-muted">
        <p className="italic">
          <strong>PRESCREEN &amp; OPT-OUT NOTICE:</strong> This
          &ldquo;prescreened&rdquo; offer of credit is based on information in your
          credit report indicating that you meet certain criteria. If you do not
          want to receive prescreened offers of credit from this and other
          companies, call the consumer reporting agencies toll-free at
          1-888-5OPT-OUT (1-888-567-8688) or visit{' '}
          <a
            href="https://www.optoutprescreen.com"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.optoutprescreen.com
          </a>
          .
        </p>
        <p className="mt-2">
          APRs through Advantage First Financial, LLC will be no greater than
          35.99% with terms from 61 days to 180 months. Eligibility is not
          guaranteed and is subject to credit and other conditions. Loans may be
          funded by third-party lenders. Advantage First Financial, LLC is a Utah
          licensed lender under the Utah Department of Financial Institutions.
        </p>
        <p className="mt-3 font-semibold">
          <Link href="/disclosures" className="text-af-blue underline">
            View Full Disclosures
          </Link>
          <span className="mx-2 font-normal">&bull;</span>
          <a
            href="https://www.advantagefirst.com/privacy"
            className="text-af-blue underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <span className="mx-2 font-normal">&bull;</span>
          <a
            href="https://www.advantagefirst.com/terms-of-use"
            className="text-af-blue underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </a>
        </p>
      </section>
    </main>
  );
}
