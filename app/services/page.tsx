import Link from 'next/link';

export default function Services() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-gray-900">
      <nav className="w-full flex justify-between p-6 shadow-sm border-b">
        <div className="font-bold text-xl text-blue-900">
          <Link href="/">Advantage First</Link>
        </div>
        <div className="space-x-6">
          <Link href="/">Home</Link>
          <Link href="/services" className="font-bold">Services</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/verify" className="bg-blue-600 text-white px-4 py-2 rounded">Apply Now</Link>
        </div>
      </nav>

      <section className="w-full max-w-5xl py-16 px-4">
        <h1 className="text-4xl font-bold mb-10 text-center">Our Loan Services</h1>
        <p className="text-xl text-center mb-12">We connect you with the right loan solution to meet your needs and empower your financial freedom.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Personal Loans</h2>
            <p className="mb-6">Accomplish your goals with a simple and hassle-free loan that can be customized to your budget.</p>
            <Link href="/verify" className="text-blue-600 font-bold hover:underline">Apply for a Personal Loan →</Link>
          </div>
          
          <div className="border p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Debt Consolidation</h2>
            <p className="mb-6">Simplify your finances and save with a single monthly payment at a lower rate.</p>
            <Link href="/verify" className="text-blue-600 font-bold hover:underline">Apply for Debt Consolidation →</Link>
          </div>

          <div className="border p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Home Improvement</h2>
            <p className="mb-6">Fund renovations big or small to create the home you've always envisioned.</p>
            <Link href="/verify" className="text-blue-600 font-bold hover:underline">Apply for Home Improvement →</Link>
          </div>

          <div className="border p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Business Needs</h2>
            <p className="mb-6">Unlock capital to support your business's daily operations and future growth.</p>
            <Link href="/verify" className="text-blue-600 font-bold hover:underline">Apply for Business Funding →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}