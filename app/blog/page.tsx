"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Blog() {
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
      <section className="blog-hero">
        <div className="blog-hero-container">
          <div className="blog-hero-content">
            <h1>Gain an Advantage: resources for financial management</h1>
            <p className="blog-hero-subtitle">Articles to help you turn your financial dreams into reality.</p>
          </div>
          <div className="blog-hero-image">
            <img src="/blog-hero-img-DT.png" alt="Woman with child" />
          </div>
        </div>
      </section>

      {/* Blog Cards */}
      <section className="blog-intro-section">
        <div className="blog-intro-container">
          <h2>We're all about your financial wellbeing</h2>
          <div className="blog-grid">
            <div className="blog-card">
              <div className="blog-image">
                <img src="/financial_success_img_DT.png" alt="Financial Success" className="blog-card-image" />
              </div>
              <div className="blog-card-content">
                <h3 className="blog-card-title">Financial Success</h3>
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
                <Link href="/blog/empoweringlives" className="blog-card-link">
                  Read more <img src="/Chevron_Right_DT.png" alt="Arrow" className="blog-arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trustpilot - Dark Theme */}
      <section className="blog-reviews-section">
        <div className="blog-reviews-container">
          <h2 className="text-white">Transparent pricing and repayment terms</h2>
          <div 
            className="trustpilot-widget" 
            data-theme="dark" 
            data-stars="4,5" 
            data-text-color="#FFFFFF"
            /* ... Other Data Attributes ... */
          >
            <iframe title="Trustpilot" src="https://widget.trustpilot.com/..." style={{ height: '240px', width: '100%', border: 'none' }}></iframe>
          </div>
        </div>
      </section>
    </>
  );
}