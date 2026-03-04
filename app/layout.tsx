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
      <head>
        <link rel="stylesheet" href="/css/site.css" />
        <link rel="stylesheet" href="/css/home.css" />
		<link rel="stylesheet" href="/css/services.css" />
		<link rel="stylesheet" href="/css/blog.css" />
		<link rel="stylesheet" href="/css/verify.css" />
		<link rel="stylesheet" href="/css/thankyou.css" />
		<link rel="stylesheet" href="/css/privacy.css" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className={`${lato.className} antialiased main-content flex flex-col min-h-screen`}>
        {/* Global Header */}
        <header className="site-header">
          <div className="header-container">
            <Link href="/" className="logo">
              <img src="/DT_Logo.png" alt="Advantage First Financial" />
            </Link>
            
            <nav className="main-nav">
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/verify">Apply Now</Link></li>
                <li><Link href="/blog">Blog</Link></li>
              </ul>
            </nav>
            
            <div className="header-actions">
              <a href="tel:800-344-1202" className="phone-number">800-344-1202</a>
              <Link href="/verify" className="btn-primary">Apply Now</Link>
            </div>
            
            {/* Mobile Hamburger */}
            <button className="hamburger">
              <span></span><span></span><span></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Global Footer */}
<footer className="site-footer">
  <div className="footer-container">
    <div className="footer-content-box">
      <div className="footer-top">
        <div className="footer-logo">
          <img src="/DT_Logo.png" alt="Advantage First Financial" />
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/services">Services</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Information</h4>
            <ul>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="//www.facebook.com/AdvantageFirstFinancial/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="//x.com/AdvFirstFinance" aria-label="Twitter/X" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-x-twitter"></i>
              </a>
              <a href="//www.instagram.com/advantagefirstfinancial" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="legal-text">
          <p>Advantage First Financial, LLC is a licensed direct lender under the Utah Department of Financial Institutions and the Texas Department of Financial Institutions.</p>
          <p>Personal loan offers presented to customers feature rate quotes from Advantage First Financial, LLC with Annual Percentage Rates (APR) not exceeding 35.99% and loan terms ranging from 36 months to 180 months.</p>
          <p>Representative Example: For a personal loan of $10,000 with a 36-month term at 10% APR, the monthly payment would be approximately $322.67, and the total amount paid over the life of the loan would be $11,616.12. This example includes interest and assumes no additional fees.</p>
          <p>Actual rates, terms, and loan amounts depend on factors such as credit score, credit history, loan amount, loan term, and state of residence, and will be determined in agreement between the borrower and lender.</p>
          <p>For questions, contact Advantage First Financial, LLC.<br />info@advantagefirst.com | (800) 344-1202 | Costa Mesa, CA</p>
        </div>
      </div>
    </div>
  </div>
</footer>
      </body>
    </html>
  );
}