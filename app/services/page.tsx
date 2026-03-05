"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Services() {
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
      <section className="services-hero">
        <div className="services-hero-container">
          <div className="services-hero-content">
            <h1>Tailored solutions for real-life goals</h1>
            <p>We connect you with the loans that power your financial future.</p>
            <Link href="/verify" className="btn-check-options">Check your loan options</Link>
          </div>
          <div className="services-hero-image">
            <img src="/services_hero_img_DT.png" alt="Couple in wedding dress shop" />
          </div>
        </div>
      </section>

      <section className="financial-flexibility-section">
        <div className="financial-flexibility-container">
          <h2>Your path to financial flexibility starts here</h2>
          <p className="intro-text">At Advantage First, we offer lending solutions through our trusted partners to meet a wide range of financial needs.</p>
          <div className="services-grid">
            <div className="service-card">
              <h3>Personal loans:</h3>
              <p>Get a tailored approach to help you achieve your goals, whether it's a dream vacation or large bills.</p>
            </div>
            <div className="service-card">
              <h3>Debt consolidation:</h3>
              <p>Eliminate those balances with a debt consolidation loan at a lower rate.</p>
            </div>
            <div className="service-card">
              <h3>Home improvement:</h3>
              <p>Transform your living space into your dream home. Access the funds you need to tackle renovations.</p>
            </div>
            <div className="service-card">
              <h3>Business needs:</h3>
              <p>If you're running a small business, you can unlock the funds you need to succeed.</p>
            </div>
          </div>
          <div className="services-button-wrapper">
            <p className="solution-ready">Ready to find your solution?</p>
            <Link href="/verify" className="btn-get-quote">Get my quote now</Link>
          </div>
        </div>
      </section>

      <section className="expertise-section">
        <div className="expertise-container">
          <div className="expertise-image-desktop"><img src="/advantage_img_DT.png" alt="Couple" /></div>
          <div className="expertise-content">
            <h2>Your Advantage is our expertise.</h2>
            <p className="subtitle">Rely on a trusted lender network that offers:</p>
            <ul className="expertise-features">
              <li>Amounts up to $100,000</li>
              <li>Competitive fixed rates as low as 5.99% APR</li>
              <li>Flexible repayment terms up to 72 months</li>
            </ul>
            <Link href="/verify" className="btn-check-options-red">Check your loan options</Link>
          </div>
        </div>
      </section>

      <section className="trustpilot-bar">
        <div className="trustpilot-bar-container">
          <div className="trustpilot-widget" data-locale="en-US" data-template-id="5419b6ffb0d04a076446a9af" data-businessunit-id="64f10ba8d79983d2c4f6adc6" data-style-height="20px" data-style-width="100%" data-token="defec148-3bc6-4e24-8a6d-b4bf32aa54a8">
            <a href="https://www.trustpilot.com/review/adv1st.com" target="_blank" rel="noopener">Trustpilot</a>
          </div>
        </div>
      </section>

      <section className="about-us-section">
        <div className="about-us-container">
          <h2>A bit more about us</h2>
          <p className="about-intro">Each member of our team is dedicated to transforming our clients' lives through financial empowerment.</p>
          <div className="about-features">
            <div className="about-feature-card">
              <img src="/loan-options_icon_DT.png" alt="Icon" />
              <h3>Loan options that make sense for your budget</h3>
            </div>
            <div className="about-feature-card">
              <img src="/support_icon_DT.png" alt="Icon" />
              <h3>Support so you can overcome obstacles</h3>
            </div>
            <div className="about-feature-card">
              <img src="/educational_icon_DT.png" alt="Icon" />
              <h3>Ongoing educational resources</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="discuss-needs-section">
        <div className="discuss-needs-container">
          <div className="discuss-content">
            <h2>Let's discuss your needs.</h2>
            <a href="tel:800-344-1202" className="btn-request-consultation">Request a FREE consultation</a>
          </div>
          <div className="discuss-image"><img src="/services_end_CTA_img_DT.png" alt="Man" /></div>
        </div>
      </section>
    </>
  );
}