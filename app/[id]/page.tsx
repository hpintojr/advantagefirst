import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck, Star, BadgeCheck, Phone } from 'lucide-react';
import QualificationForm from '@/components/QualificationForm';
import QualificationDisclosures from '@/components/QualificationDisclosures';
import { fetchLeadByUniqueId, isValidUniqueId } from '@/lib/qualification';

/**
 * adv1st.app/{unique_id} — personalized pre-selection landing page.
 * Server component: looks the lead up by unique_id and prefills the form.
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
              width={220}
              height={48}
              className="h-10 w-auto"
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
          Consolidation Loan
          {lead.loanAmount ? (
            <>
              {' '}
              up to{' '}
              <span className="font-bold text-af-blue">{fmtUSD(lead.loanAmount)}</span>
            </>
          ) : null}
          .
        </p>
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

      {/* ── FCRA prescreen + lending disclosures ── */}
      <QualificationDisclosures />
    </main>
  );
}
