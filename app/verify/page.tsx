export default function Verify() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-50 py-16 px-4 min-h-screen">
      <section className="w-full max-w-2xl bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">Check Your Rates</h1>
        <p className="text-center mb-8 text-gray-600">Enter your information below to see what loan options you qualify for. This will not affect your credit score.</p>
        
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="email">Email Address</label>
            <input type="email" id="email" className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="amount">Requested Loan Amount</label>
            <select id="amount" className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white" required>
              <option value="">Select an amount</option>
              <option value="10000">$10,000</option>
              <option value="25000">$25,000</option>
              <option value="50000">$50,000</option>
              <option value="100000">$100,000</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="purpose">Loan Purpose</label>
            <select id="purpose" className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white" required>
              <option value="">Select a purpose</option>
              <option value="debt">Debt Consolidation</option>
              <option value="home">Home Improvement</option>
              <option value="business">Business Needs</option>
              <option value="personal">Personal Loan</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-[#00d084] text-white font-bold py-4 rounded-md shadow hover:bg-green-500 transition text-lg mt-4">
            See My Options
          </button>
        </form>
      </section>
    </div>
  );
}