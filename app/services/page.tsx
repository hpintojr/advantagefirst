import Link from 'next/link';

export default function Services() {
  return (
    <div className="w-full flex flex-col items-center py-16 px-4">
      <section className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-10 text-center text-blue-900">Our Loan Services</h1>
        <p className="text-xl text-center mb-12 text-gray-700">We connect you with the right loan solution to meet your needs and empower your financial freedom.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-gray-200 p-8 rounded-xl shadow-sm bg-white hover:shadow-md transition">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Personal Loans</h2>
            <p className="mb-6 text-gray-600">Accomplish your goals with a simple and hassle-free loan that can be customized to your budget.</p>
            <Link href="/verify" className="text-blue-600 font-bold hover:underline">Apply for a Personal Loan →</Link>
          </div>
          
          <div className="border border-gray-200 p-8 rounded-xl shadow-sm bg-white hover:shadow-md transition">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Debt Consolidation</h2>
            <p className="mb-6 text-gray-600">Simplify your finances and save with a single monthly payment at a lower rate.</p>
            <Link href="/verify" className="text-blue-600 font-bold hover:underline">Apply for Debt Consolidation →</Link>
          </div>

          <div className="border border-gray-200 p-8 rounded-xl shadow-sm bg-white hover:shadow-md transition">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Home Improvement</h2>
            <p className="mb-6 text-gray-600">Fund renovations big or small to create the home you've always envisioned.</p>
            <Link href="/verify" className="text-blue-600 font-bold hover:underline">Apply for Home Improvement →</Link>
          </div>

          <div className="border border-gray-200 p-8 rounded-xl shadow-sm bg-white hover:shadow-md transition">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Business Needs</h2>
            <p className="mb-6 text-gray-600">Unlock capital to support your business's daily operations and future growth.</p>
            <Link href="/verify" className="text-blue-600 font-bold hover:underline">Apply for Business Funding →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}