import Link from 'next/link';

export default function Verify() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 text-gray-900">
      <nav className="w-full flex justify-between p-6 shadow-sm border-b bg-white">
        <div className="font-bold text-xl text-blue-900">
          <Link href="/">Advantage First</Link>
        </div>
        <div className="space-x-6">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/blog">Blog</Link>
        </div>
      </nav>

      <section className="w-full max-w-2xl mt-12 mb-20 bg-white p-10 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Check Your Rates</h1>
        <p className="text-center mb-8 text-gray-600">Enter your information below to see what loan options you qualify for. This will not affect your credit score.</p>
        
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" className="w-full border rounded p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" className="w-full border rounded p-2" required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
            <input type="email" id="email" className="w-full border rounded p-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="amount">Requested Loan Amount</label>
            <select id="amount" className="w-full border rounded p-2" required>
              <option value="">Select an amount</option>
              <option value="10000">$10,000</option>
              <option value="25000">$25,000</option>
              <option value="50000">$50,000</option>
              <option value="100000">$100,000</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="purpose">Loan Purpose</label>
            <select id="purpose" className="w-full border rounded p-2" required>
              <option value="">Select a purpose</option>
              <option value="debt">Debt Consolidation</option>
              <option value="home">Home Improvement</option>
              <option value="business">Business Needs</option>
              <option value="personal">Personal Loan</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
            See My Options
          </button>
        </form>
      </section>
    </main>
  );
}