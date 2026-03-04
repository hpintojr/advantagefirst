import Link from 'next/link';

export default function Blog() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-gray-900">
      {/* Navigation */}
      <nav className="w-full flex justify-between p-6 shadow-sm border-b">
        <div className="font-bold text-xl text-blue-900">
          <Link href="/">Advantage First</Link>
        </div>
        <div className="space-x-6">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/blog" className="font-bold">Blog</Link>
          <Link href="/verify" className="bg-blue-600 text-white px-4 py-2 rounded">Apply Now</Link>
        </div>
      </nav>

      {/* Blog Content */}
      <section className="w-full max-w-4xl py-16 px-4 flex-grow">
        <h1 className="text-4xl font-bold mb-10 text-center">Our Blog</h1>
        <p className="text-xl text-center mb-12">We are all about your financial well-being. Check out our resources below.</p>
        
        <div className="space-y-8">
          <article className="border p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Financial Success</h2>
              <p className="mb-4 text-gray-700">Elevate your financial success with experts-chosen solutions. Affiliates benefit Advantage financial and empower lives.</p>
              <Link href="#" className="text-blue-600 font-bold hover:underline">Read more →</Link>
            </div>
          </article>

          <article className="border p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Empowering Lives</h2>
              <p className="mb-4 text-gray-700">We empower lives by restoring financial freedom and peace of mind.</p>
              <Link href="#" className="text-blue-600 font-bold hover:underline">Read more →</Link>
            </div>
          </article>
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