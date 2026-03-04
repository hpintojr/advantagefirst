import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-slate-50 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-blue-900 leading-tight">
              Get the Advantage to financial freedom
            </h1>
            <p className="text-xl text-gray-700">
              The money you need, when you need it, with flexible terms, competitive rates, and a team that puts you first.
            </p>
            <div className="pt-4">
              <Link href="/verify" className="inline-block bg-[#00d084] text-white text-xl font-bold px-10 py-4 rounded-md shadow-lg hover:bg-green-500 transition">
                Apply Now
              </Link>
            </div>
            <ul className="space-y-3 pt-6 text-lg font-medium text-gray-800">
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Amounts up to $100,000</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Fixed rates as low as 5.99% APR</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Terms up to 72 months</li>
            </ul>
          </div>
          <div className="flex-1">
            <img src="/home-hero-img-DT.jpg" alt="Couple reviewing finances" className="w-full h-auto rounded-xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Trustpilot Section */}
      <section className="w-full py-16 text-center px-4 bg-white">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">Transparent pricing and repayment terms</h2>
        <p className="text-xl text-gray-600 mb-8">See why thousands of borrowers have chosen us:</p>
        <div className="mb-8 p-6 bg-gray-50 border inline-block rounded-lg text-lg text-gray-500">
          [Trustpilot Widget Placeholder]
        </div>
        <br />
        <Link href="/verify" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded hover:bg-blue-700 transition">
          Apply Now
        </Link>
      </section>

      {/* Journey Section */}
      <section className="w-full bg-blue-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 bg-white text-gray-900 rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
          <div className="hidden md:block w-1/3">
            <img src="/get-started-icon_DT.png" alt="Financial Journey" className="w-full" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Start your journey with Advantage First</h2>
            <p className="text-lg text-gray-700 mb-8">
              Whether it's consolidating debt, covering expenses, or funding big projects, you can secure the money necessary to achieve your goals without difficulty or stress. Elevate your financial success with a customized loan solution through Advantage First's network of lenders.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-xl mb-1">Quick approvals</h3>
                <p className="text-gray-600">Fast decisions so you can move forward with confidence</p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Flexible loan options</h3>
                <p className="text-gray-600">Tailored to your situation and aspirations</p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Competitive rates</h3>
                <p className="text-gray-600">Fixed interest for the life of your loan</p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">No hidden fees</h3>
                <p className="text-gray-600">Transparent pricing and repayment terms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="w-full py-20 px-4 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Simple solutions to unique situations</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">We connect you with the right loan solution to meet your needs and empower your financial freedom.</p>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <img src="/personal-loans-icon_DT.png" alt="Personal loans" className="h-20 mb-6" />
            <h3 className="text-xl font-bold mb-3">Personal loans</h3>
            <p className="text-gray-600 mb-6 flex-grow">Accomplish your goals with a simple and hassle-free loan that can be customized to your budget.</p>
            <Link href="/services" className="text-blue-600 font-bold hover:underline mt-auto">Learn more</Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <img src="/debt-consolidation-icon-DT.png" alt="Debt consolidation" className="h-20 mb-6" />
            <h3 className="text-xl font-bold mb-3">Debt consolidation</h3>
            <p className="text-gray-600 mb-6 flex-grow">Simplify your finances and save save with a single monthly payment at a lower rate.</p>
            <Link href="/services" className="text-blue-600 font-bold hover:underline mt-auto">Learn more</Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <img src="/home-improvements-icon_DT.png" alt="Home improvement" className="h-20 mb-6" />
            <h3 className="text-xl font-bold mb-3">Home improvement</h3>
            <p className="text-gray-600 mb-6 flex-grow">Fund renovations big or small to create the home you've always envisioned.</p>
            <Link href="/services" className="text-blue-600 font-bold hover:underline mt-auto">Learn more</Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <img src="/business-needs-icon_DT.png" alt="Business needs" className="h-20 mb-6" />
            <h3 className="text-xl font-bold mb-3">Business needs</h3>
            <p className="text-gray-600 mb-6 flex-grow">Unlock capital to support your business's daily operations and future growth.</p>
            <Link href="/services" className="text-blue-600 font-bold hover:underline mt-auto">Learn more</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Advantage First is here to help you find the right path to financial freedom</h2>
            <p className="text-lg text-gray-700 mb-6">One application can unlock multiple loan offers.<br />For example:</p>
            
            <table className="w-full text-left border-collapse mb-8 shadow-sm">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-3 border">Lender</th>
                  <th className="p-3 border">Amount</th>
                  <th className="p-3 border">APR</th>
                  <th className="p-3 border">Term</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-50 border-b">
                  <td className="p-3 border">SoFi</td>
                  <td className="p-3 border">$40,000</td>
                  <td className="p-3 border">5.99%</td>
                  <td className="p-3 border">48 mos.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 border">Prosper</td>
                  <td className="p-3 border">$35,000</td>
                  <td className="p-3 border">6.99%</td>
                  <td className="p-3 border">60 mos.</td>
                </tr>
                <tr className="bg-gray-50 border-b">
                  <td className="p-3 border">Upgrade</td>
                  <td className="p-3 border">$30,000</td>
                  <td className="p-3 border">7.29%</td>
                  <td className="p-3 border">36 mos.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 border">Best Egg</td>
                  <td className="p-3 border">$25,000</td>
                  <td className="p-3 border">8.99%</td>
                  <td className="p-3 border">36 mos.</td>
                </tr>
              </tbody>
            </table>
            
            <p className="text-xl mb-6">Let's explore your loan options today.</p>
            <Link href="/verify" className="inline-block bg-[#00d084] text-white font-bold px-8 py-4 rounded-md shadow hover:bg-green-500 transition text-lg">
              Apply Now
            </Link>
          </div>
          <div className="flex-1">
            <img src="/end_CTA_img_DT.png" alt="Woman with laptop" className="w-full rounded-xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* Financial Wellbeing Section */}
      <section className="w-full py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">We're all about your financial well-being</h2>
          <p className="text-xl text-gray-600 mb-12">Check out our resources page for useful blog topics, like:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-10">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <img src="/financial_success_img_DT.png" alt="Financial Success" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Financial Success</h3>
                <p className="text-gray-600 mb-4">Elevate your financial success with experts chosen solutions. Affiliates benefit Advantage financial and empower lives.</p>
                <Link href="/blog/financialsuccess" className="text-blue-600 font-bold flex items-center gap-2 hover:underline">
                  Read more <img src="/Chevron_Right_DT.png" alt="Arrow" className="h-3" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <img src="/empowering_lives_img_DT.png" alt="Empowering Lives" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Empowering Lives</h3>
                <p className="text-gray-600 mb-4">We empower lives by restoring financial freedom and peace of mind.</p>
                <Link href="/blog/empoweringlives" className="text-blue-600 font-bold flex items-center gap-2 hover:underline">
                  Read more <img src="/Chevron_Right_DT.png" alt="Arrow" className="h-3" />
                </Link>
              </div>
            </div>
          </div>
          
          <Link href="/blog" className="inline-block bg-white text-blue-900 border-2 border-blue-900 font-bold px-8 py-3 rounded-md hover:bg-blue-50 transition">
            See more
          </Link>
        </div>
      </section>
    </>
  );
}