import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import QualificationDisclosures from '@/components/QualificationDisclosures';

export const metadata: Metadata = {
  title: 'Important Disclosures | Advantage First Financial',
  robots: { index: false, follow: false },
};

export default function DisclosuresPage() {
  return (
    <main className="min-h-screen bg-pv-bg">
      <header className="border-b border-pv-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Image
            src="/images/DT_Logo_tight.png"
            alt="Advantage First Financial"
            width={220}
            height={48}
            className="h-12 w-auto"
            priority
          />
          <Link
            href="https://www.advantagefirst.com"
            className="text-sm font-semibold text-af-blue hover:underline"
          >
            advantagefirst.com
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-8">
        <h1 className="font-display text-2xl font-black text-af-navy">
          Important Disclosures
        </h1>
        <p className="mt-2 text-sm text-pv-muted">
          These disclosures apply to pre-screened loan offers from Advantage First
          Financial, LLC. See also our{' '}
          <a
            href="https://www.advantagefirst.com/privacy"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://www.advantagefirst.com/terms-of-use"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </a>
          .
        </p>
      </div>

      <QualificationDisclosures />
    </main>
  );
}
