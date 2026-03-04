import Link from 'next/link';

export default function Blog() {
  return (
    <div className="w-full flex flex-col items-center py-16 px-4 bg-slate-50 min-h-screen">
      <section className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-center text-blue-900">Our Blog</h1>
        <p className="text-xl text-center mb-12 text-gray-600">We are all about your financial well-being. Check out our resources below.</p>
        
        <div className="space-y-8">
          <article className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm flex flex-col md:flex-row gap-8 items-center hover:shadow-md transition">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3 text-blue-900">Financial Success</h2>
              <p className="mb-6 text-gray-600">Elevate your financial success with experts-chosen solutions. Affiliates benefit Advantage financial and empower lives.</p>
              <Link href="#" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                Read more <img src="/Chevron_Right_DT.png" alt="Arrow" className="h-3" />
              </Link>
            </div>
            <div className="w-full md:w-1/3">
              <img src="/financial_success_img_DT.png" alt="Financial Success" className="w-full rounded-lg object-cover" />
            </div>
          </article>

          <article className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm flex flex-col md:flex-row gap-8 items-center hover:shadow-md transition">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3 text-blue-900">Empowering Lives</h2>
              <p className="mb-6 text-gray-600">We empower lives by restoring financial freedom and peace of mind.</p>
              <Link href="#" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                Read more <img src="/Chevron_Right_DT.png" alt="Arrow" className="h-3" />
              </Link>
            </div>
            <div className="w-full md:w-1/3">
              <img src="/empowering_lives_img_DT.png" alt="Empowering Lives" className="w-full rounded-lg object-cover" />
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}