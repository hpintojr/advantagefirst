"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Blog() {
  // Manual trigger for Trustpilot reload on page mount
  useEffect(() => {
    const trustpilot = (window as any).Trustpilot;
    if (trustpilot && trustpilot.loadFromElement) {
      const widget = document.querySelector('.trustpilot-widget');
      if (widget) {
        trustpilot.loadFromElement(widget);
      }
    }
  }, []);

  return (
    <>
      {/* Blog Hero Section */}
      <section className="blog-hero">
        <div className="blog-hero-container">
          <div className="blog-hero-content">
            <h1>Gain an Advantage: resources for financial management</h1>
            <p className="blog-hero-subtitle">
              Articles to help you turn your financial dreams into reality and enjoy a brighter, more secure future.
            </p>
          </div>
          <div className="blog-hero-image">
            <img src="/blog-hero-img-DT.png" alt="Woman with child planning finances" />
          </div>
        </div>
      </section>

      {/* Blog Intro & Grid Section */}
      <section className="blog-intro-section">
        <div className="blog-intro-container">
          <h2>We're all about your financial wellbeing</h2>
          <p className="blog-intro-text">
            Explore our latest articles designed to help you make confident, informed financial choices.
          </p>
          
          <div className="blog-grid">
            <div className="blog-card">
              <div className="blog-image">
                <img src="/financial_success_img_DT.png" alt="Financial Success" className="blog-card-image" />
              </div>
              <div className="blog-card-content">
                <h3 className="blog-card-title">Financial Success</h3>
                <p className="blog-card-excerpt">
                  Elevate your financial success with customized loan solutions. (All loans funded through 3rd party lenders)
                </p>
                <Link href="/blog/financialsuccess" className="blog-card-link">
                  Read more <img src="/Chevron_Right_DT.png" alt="Arrow" className="blog-arrow" />
                </Link>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                <img src="/empowering_lives_img_DT.png" alt="Empowering Lives" className="blog-card-image" />
              </div>
              <div className="blog-card-content">
                <h3 className="blog-card-title">Empowering Lives</h3>
                <p className="blog-card-excerpt">
                  We empower lives by restoring financial freedom and peace of mind.
                </p>
                <Link href="/blog/empoweringlives" className="blog-card-link">
                  Read more <img src="/Chevron_Right_DT.png" alt="Arrow" className="blog-arrow" />
                </Link>
              </div>
            </div>
          </div>

          <div className="blog-cta-container">
            <p className="blog-cta-title">Ready to find your solution?</p>
            <Link href="/verify" className="btn-check-loan-options">
              Check your loan options
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Reviews (Trustpilot) Section */}
      <section className="blog-reviews-section">
        <div className="blog-reviews-container">
          <div className="blog-reviews-header">
            <h2>Transparent pricing and repayment terms</h2>
            <p>See why thousands of borrowers have chosen us:</p>
          </div>
          <div 
            className="trustpilot-widget" 
            data-locale="en-US" 
            data-template-id="54ad5defc6454f065c28af8b" 
            data-businessunit-id="64f10ba8d79983d2c4f6adc6" 
            data-token="66117040-b542-4651-8ff0-df1ad0835d2d" 
            data-style-height="240px" 
            data-style-width="100%" 
            data-theme="dark" 
            data-stars="4,5" 
            data-review-languages="en" 
            data-text-color="#FFFFFF" 
            style={{ position: 'relative' }}
          >
            <iframe 
              title="Customer reviews powered by Trustpilot" 
              loading="lazy" 
              src="https://widget.trustpilot.com/trustboxes/54ad5defc6454f065c28af8b/index.html?templateId=54ad5defc6454f065c28af8b&businessunitId=64f10ba8d79983d2c4f6adc6#locale=en-US&token=66117040-b542-4651-8ff0-df1ad0835d2d&styleHeight=240px&styleWidth=100%25&theme=dark&stars=4%2C5&reviewLanguages=en&textColor=%23FFFFFF" 
              style={{ position: 'relative', height: '240px', width: '100%', borderStyle: 'none', display: 'block', overflow: 'hidden' }}
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}