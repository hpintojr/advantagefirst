"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const firstName = searchParams.get('firstName') || 'Applicant';

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
      <section className="ty-wrap" aria-labelledby="ty-heading">
        <div className="ty-container">
          <nav className="ty-progress" aria-label="Application progress">
            <ol className="ty-steps">
              <li className="ty-step ty-complete"><span className="ty-dot" aria-hidden="true"></span><span className="ty-label">Estimate</span></li>
              <li className="ty-step ty-complete"><span className="ty-dot" aria-hidden="true"></span><span className="ty-label">Personalization</span></li>
              <li className="ty-step ty-active"><span className="ty-dot" aria-hidden="true"></span><span className="ty-label">Results</span></li>
            </ol>
          </nav>
          <img src="/ribbon.png" alt="" className="ty-ribbon" aria-hidden="true" />
          <h2 id="ty-heading" className="ty-title">
            Thank you, <span className="ty-name">{firstName}</span><span aria-hidden="true">!</span>
            <br /> Your application has been received.
          </h2>
          <p className="ty-sub">A financial consultant will call you from a<br /><span className="fw-bold">800 area code</span> soon!</p>
          <p className="ty-assist desktop-only">Call us directly at <a className="ty-phone fw-bold" href="tel:800-344-1202">800-344-1202</a>.</p>
        </div>
      </section>

      <section className="trustpilot-bar">
        <div className="trustpilot-bar-container">
          <div className="trustpilot-widget" data-locale="en-US" data-template-id="5419b6ffb0d04a076446a9af" data-businessunit-id="64f10ba8d79983d2c4f6adc6" data-style-height="20px" data-style-width="100%" data-token="defec148-3bc6-4e24-8a6d-b4bf32aa54a8">
             <a href="https://www.trustpilot.com/review/adv1st.com" target="_blank" rel="noopener">Trustpilot</a>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}