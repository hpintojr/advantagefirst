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
            <img src="/blog-hero-img-DT.png" alt="Blog hero" />
          </div>
        </div>
      </section>

      <section className="blog-intro-section">
        <div className="blog-intro-container">
          <h2>We're all about your financial wellbeing</h2>
          <div className="blog-grid">
            <div className="blog-card">
              <div className="blog-image"><img src="/financial_success_img_DT.png" alt="Success" className="blog-card-image" /></div>
              <div className="blog-card-content">
                <h3 className="blog-card-title">Financial Success</h3>
                <Link href="/blog/financialsuccess" className="blog-card-link">Read more <img src="/Chevron_Right_DT.png" alt="Arrow" className="blog-arrow" /></Link>
              </div>
            </div>
            <div className="blog-card">
              <div className="blog-image"><img src="/empowering_lives_img_DT.png" alt="Lives" className="blog-card-image" /></div>
              <div className="blog-card-content">
                <h3 className="blog-card-title">Empowering Lives</h3>
                <Link href="/blog/empoweringlives" className="blog-card-link">Read more <img src="/Chevron_Right_DT.png" alt="Arrow" className="blog-arrow" /></Link>
              </div>
            </div>
          </div>
          <div className="blog-cta-container">
            <p className="blog-cta-title">Ready to find your solution?</p>
            <Link href="/verify" className="btn-check-loan-options">Check your loan options</Link>
          </div>
        </div>
      </section>

      <section className="blog-reviews-section">
        <div className="blog-reviews-container">
          <div className="blog-reviews-header">
            <h2 className="text-white">Transparent pricing and repayment terms</h2>
            <p className="text-white">See why thousands of borrowers have chosen us:</p>
          </div>
          <div className="trustpilot-widget" data-locale="en-US" data-template-id="54ad5defc6454f065c28af8b" data-businessunit-id="64f10ba8d79983d2c4f6adc6" data-token="66117040-b542-4651-8ff0-df1ad0835d2d" data-style-height="240px" data-style-width="100%" data-theme="dark" data-stars="4,5" data-review-languages="en" data-text-color="#FFFFFF">
            <a href="https://www.trustpilot.com/review/adv1st.com" target="_blank" rel="noopener">Trustpilot</a>
          </div>
        </div>
      </section>
    </>
  );
}