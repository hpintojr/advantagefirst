"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  // Triggers Trustpilot to find and load the widget on every page visit
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
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Get the Advantage to financial freedom</h1>
            <p>The money you need, when you need it, with flexible terms, competitive rates, and a team that puts you first.</p>
            <Link href="/verify" className="btn-hero">Apply Now</Link>
            <ul className="hero-features">
              <li>Amounts up to $100,000</li>
              <li>Fixed rates as low as 5.99% APR</li>
              <li>Terms up to 72 months</li>
            </ul>
          </div>
        </div>
        <div className="hero-image" aria-hidden="false">
          <img src="/home-hero-img-DT.jpg" alt="Couple reviewing finances" />
        </div>
        <div className="hero-mobile-image">
          <img src="/home-hero-img-DT.jpg" alt="Couple reviewing finances" />
        </div>
      </section>

      {/* Trustpilot Section */}
      <section className="trustpilot-section">
        <div className="trustpilot-container">
          <div className="tp-cta-section">
            <div className="tp-cta-container">
              <h2 className="trustpilot-heading" style={{ color: '#1D315F' }}>
                Transparent pricing and repayment terms
              </h2>
              <p className="trustpilot-subheading" style={{ color: '#1D315F' }}>
                See why thousands of borrowers have chosen us:
              </p>
              
              <div 
                className="trustpilot-widget" 
                data-locale="en-US" 
                data-template-id="54ad5defc6454f065c28af8b" 
                data-businessunit-id="64f10ba8d79983d2c4f6adc6" 
                data-token="66117040-b542-4651-8ff0-df1ad0835d2d" 
                data-style-height="240px" 
                data-style-width="100%" 
                data-stars="5" 
                data-review-languages="en" 
                style={{ position: 'relative' }}
              >
                <iframe 
                  title="Customer reviews powered by Trustpilot" 
                  loading="lazy" 
                  src="https://widget.trustpilot.com/trustboxes/54ad5defc6454f065c28af8b/index.html?templateId=54ad5defc6454f065c28af8b&businessunitId=64f10ba8d79983d2c4f6adc6#locale=en-US&token=66117040-b542-4651-8ff0-df1ad0835d2d&styleHeight=240px&styleWidth=100%25&stars=5&reviewLanguages=en" 
                  style={{ position: 'relative', height: '240px', width: '100%', borderStyle: 'none', display: 'block', overflow: 'hidden' }}
                ></iframe>
              </div>
            </div>
          </div>
          <div className="trustpilot-button-wrapper">
            <Link href="/verify" className="btn-trustpilot">Apply Now</Link>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="journey-section">
        <div className="journey-card">
          <div className="journey-card-content">
            <div className="journey-icon">
              <img src="/get-started-icon_DT.png" alt="Financial Journey" />
            </div>
            <div className="journey-text">
              <h2>Start your journey with Advantage First</h2>
              <p>Whether it's consolidating debt, covering expenses, or funding big projects, you can secure the money necessary to achieve your goals without difficulty or stress.</p>
              <div className="journey-features">
                <div className="feature-item">
                  <h3>Quick approvals</h3>
                  <p>Fast decisions so you can move forward with confidence</p>
                </div>
                <div className="feature-item">
                  <h3>Flexible loan options</h3>
                  <p>Tailored to your situation and aspirations</p>
                </div>
                <div className="feature-item">
                  <h3>Competitive rates</h3>
                  <p>Fixed interest for the life of your loan</p>
                </div>
                <div className="feature-item">
                  <h3>No hidden fees</h3>
                  <p>Transparent pricing and repayment terms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* ... (Remaining Home content) ... */}
    </>
  );
}