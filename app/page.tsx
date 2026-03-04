import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-gray-900">
      {/* Navigation */}
      <nav className="w-full flex justify-between p-6 shadow-sm border-b">
        <div className="font-bold text-xl text-blue-900">Advantage First</div>
        <div className="space-x-6">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/verify" className="bg-blue-600 text-white px-4 py-2 rounded">Apply Now</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">Get the Advantage to financial freedom</h1>
        <p className="text-xl mb-8">The money you need, when you need it, with flexible terms, competitive rates, and a team that puts you first.</p>
        <ul className="text-lg mb-8 space-y-2">
          <li>✓ Amounts up to $100,000</li>
          <li>✓ Fixed rates as low as 5.99% APR</li>
          <li>✓ Terms up to 72 months</li>
        </ul>
        <Link href="/verify" className="bg-green-600 text-white px-8 py-4 rounded text-lg font-bold">Apply Now</Link>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 w-full py-16 px-4 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-10">Simple solutions to unique situations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-xl font-bold mb-2">Personal loans</h3>
            <p className="mb-4">Accomplish your goals with a simple and hassle-free loan that can be customized to your budget.</p>
            <Link href="/services" className="text-blue-600 font-bold">Learn more →</Link>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-xl font-bold mb-2">Debt consolidation</h3>
            <p className="mb-4">Simplify your finances and save with a single monthly payment at a lower rate.</p>
            <Link href="/services" className="text-blue-600 font-bold">Learn more →</Link>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-xl font-bold mb-2">Home improvement</h3>
            <p className="mb-4">Fund renovations big or small to create the home you've always envisioned.</p>
            <Link href="/services" className="text-blue-600 font-bold">Learn more →</Link>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-xl font-bold mb-2">Business needs</h3>
            <p className="mb-4">Unlock capital to support your business's daily operations and future growth.</p>
            <Link href="/services" className="text-blue-600 font-bold">Learn more →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-10 px-6 mt-auto">
        <div className="max-w-6xl mx-auto text-sm space-y-4">
          <p>Advantage First Financial, LLC is a licensed direct lender under the Utah Department of Financial Institutions and the Texas Department of Financial Institutions.</p>
          <p>Contact: info@advantagefirst.com | (800) 344-1202 | Costa Mesa, CA</p>
        </div>
      </footer>
    </main>
  );
}