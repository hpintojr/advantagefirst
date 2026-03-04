import type { Metadata } from "next";
import { Lato } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Advantage First Financial: Tailored Loan Solutions",
  description: "Achieve your financial goals with Advantage First. Pay off expensive debt like credit cards or boost your budget. Review your options today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.className} antialiased bg-white text-gray-800 flex flex-col min-h-screen`}>
        {/* Global Header */}
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/">
              <img src="/DT_Logo.png" alt="Advantage First Financial" className="h-10 w-auto" />
            </Link>
            <nav className="hidden md:flex space-x-8 font-semibold text-gray-700">
              <Link href="/" className="hover:text-blue-900">Home</Link>
              <Link href="/services" className="hover:text-blue-900">Services</Link>
              <Link href="/verify" className="hover:text-blue-900">Apply Now</Link>
              <Link href="/blog" className="hover:text-blue-900">Blog</Link>
            </nav>
            <div className="hidden md:flex items-center space-x-6">
              <a href="tel:800-344-1202" className="text-blue-900 font-bold text-lg">800-344-1202</a>
              <Link href="/verify" className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 transition">
                Apply Now
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="w-full bg-[#1e293b] text-white pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <img src="/DT_Logo.png" alt="Advantage First Financial" className="h-12 w-auto bg-white p-2 rounded mb-4" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4">Company</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/services">Services</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4">Information</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link href="/blog">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link href="/privacy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-xs text-gray-400 space-y-4">
              <p>Advantage First Financial, LLC is a licensed direct lender under the Utah Department of Financial Institutions and the Texas Department of Financial Institutions.</p>
              <p>Personal loan offers presented to customers feature rate quotes from Advantage First Financial, LLC with Annual Percentage Rates (APR) not exceeding 35.99% and loan terms ranging from 36 months to 180 months.</p>
              <p>Representative Example: For a personal loan of $10,000 with a 36-month term at 10% APR, the monthly payment would be approximately $322.67, and the total amount paid over the life of the loan would be $11,616.12. This example includes interest and assumes no additional fees.</p>
              <p>Actual rates, terms, and loan amounts depend on factors such as credit score, credit history, loan amount, loan term, and state of residence, and will be determined in agreement between the borrower and lender.</p>
              <p>For questions, contact Advantage First Financial, LLC.<br />info@advantagefirst.com | (800) 344-1202 | Costa Mesa, CA</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}