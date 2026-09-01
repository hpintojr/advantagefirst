import Link from 'next/link';
import Image from 'next/image';

/**
 * Rendered for BOTH invalid and expired unique IDs — intentionally
 * identical in each case so link scanners can't distinguish a real
 * (expired) ID from a nonexistent one.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mesh-hero p-4">
      <div className="double-bezel w-full max-w-md">
        <div className="double-bezel-inner p-8 text-center">
          <Image
            src="/images/torch_logo.png"
            alt="Advantage First Financial"
            width={48}
            height={48}
            className="mx-auto mb-4"
          />
          <h2 className="font-display text-2xl font-black text-af-navy">
            Link Expired or Invalid
          </h2>
          <p className="mt-3 text-pv-muted">
            The personalized link you clicked is no longer active or could not be
            found. You can still check your options directly — it only takes two
            minutes.
          </p>
          <Link
            href="https://advantagefirst.com"
            className="mt-6 inline-block rounded-full bg-af-blue px-8 py-3 font-display font-bold text-white transition-colors hover:bg-af-blue-light"
          >
            Check My Options
          </Link>
        </div>
      </div>
    </main>
  );
}
