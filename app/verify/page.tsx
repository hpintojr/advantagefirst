"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

export default function Verify() {
  const [step, setStep] = useState(1);
  const [debtValue, setDebtValue] = useState(10000);
  const [sliderPosition, setSliderPosition] = useState(0);

  // Handle Range Slider UI
  useEffect(() => {
    const min = 8000;
    const max = 100000;
    const percent = ((debtValue - min) / (max - min)) * 100;
    // Calculation for the floating label position
    setSliderPosition(percent);
  }, [debtValue]);

  const handleNext = (nextStep: number) => {
    setStep(nextStep);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* Load External Scripts */}
      <Script src="//challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <Script src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" strategy="lazyOnload" />

      <div className="padd-left">
        <div className="verify-background">
          <div className="verify-container">
            <div className="verify-form">
              {/* Progress Tracker */}
              <div className="progress-tracker">
                <div className={`progress-step ${step === 1 ? 'active' : ''}`} data-phase="estimate">
                  <div className="step-connector"></div>
                  <span className="step-dot"></span> 
                  <span className="step-label">Estimate</span>
                </div>
                <div className={`progress-step ${step === 2 || step === 3 ? 'active' : ''}`} data-phase="personalization">
                  <div className="step-connector"></div>
                  <span className="step-dot"></span> 
                  <span className="step-label">Personalization</span>
                </div>
                <div className={`progress-step ${step === 4 ? 'active' : ''}`} data-phase="results">
                  <div className="step-connector"></div>
                  <span className="step-dot"></span> 
                  <span className="step-label">Results</span>
                </div>
              </div>

              <form className="form-grid" id="CustomerForm">
                
                {/* STEP 1: Debt Selection */}
                {step === 1 && (
                  <div className="step-container active">
                    <h1 className="verify-title">Choose your debt amount</h1>
                    <div className="debt-slider-wrapper">
                      <div 
                        id="debtDisplay" 
                        className="debt-amount-display" 
                        style={{ left: `calc(${sliderPosition}% + (${8 - sliderPosition * 0.15}px))` }}
                      >
                        ${debtValue.toLocaleString()}
                      </div>
                      <input 
                        type="range" 
                        className="debt-slider" 
                        min="8000" 
                        max="100000" 
                        step="1000" 
                        value={debtValue}
                        onChange={(e) => setDebtValue(parseInt(e.target.value))}
                        style={{
                          background: `linear-gradient(to right, #0f75bc ${((debtValue - 8000) / 92000) * 100}%, #b5d0e9 0%)`
                        }}
                      />
                      <div className="slider-labels">
                        <span className="slider-min">$8,000</span> 
                        <span className="slider-max">$100,000+</span>
                      </div>
                      <p className="debt-requirement">We have a $10,000 minimum debt requirement.</p>
                    </div>
                    <button type="button" className="btn-next" onClick={() => handleNext(2)}>Continue</button>
                  </div>
                )}

                {/* STEP 2: Initial Personal Info */}
                {step === 2 && (
                  <div className="step-container active">
                    <h1 className="verify-title">See your results</h1>
                    <div className="form-container-step4">
                      <div className="form-group full-width">
                        <input className="form-control" placeholder="First Name" required name="FirstName" />
                      </div>
                      <div className="form-group full-width">
                        <input className="form-control" placeholder="Last Name" required name="LastName" />
                      </div>
                      <div className="form-group full-width">
                        <input type="tel" className="form-control" placeholder="Phone" required name="Phone" />
                      </div>
                      <div className="form-group full-width">
                        <input type="email" className="form-control" placeholder="Email" required name="Email" />
                      </div>
                      <p className="consent-disclaimer">
                        By providing your phone number above and clicking on “See your results” below, you are consenting to receive calls, texts, and recorded messages...
                      </p>
                    </div>
                    <button type="button" className="btn-next" onClick={() => handleNext(3)}>See your results</button>
                  </div>
                )}

                {/* STEP 3: Verification Info */}
                {step === 3 && (
                  <div className="step-container active">
                    <h1 className="verify-title">Verify Info</h1>
                    <div className="form-container-step5">
                      <div className="form-group full-width">
                        <input type="date" className="form-control" placeholder="Date of Birth (mm/dd/yyyy)" required name="DOB" />
                      </div>
                      <p className="credit-consent-disclaimer">
                        You understand that by clicking on the “Submit” button below, you are providing written instructions to Advantage First under the Fair Credit Reporting Act...
                      </p>
                    </div>
                    <div className="form-group full-width turnstile-container">
                      <div className="cf-turnstile" data-sitekey="0x4AAAAAACECTwiAne6oMlHd" data-theme="light"></div>
                    </div>
                    <button type="submit" className="btn-submit-form" id="submit-verify">Submit</button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Trustpilot Bar */}
        <section className="trustpilot-bar">
          <div className="trustpilot-bar-container">
            <div 
              className="trustpilot-widget" 
              data-locale="en-US" 
              data-template-id="5419b6ffb0d04a076446a9af" 
              data-businessunit-id="64f10ba8d79983d2c4f6adc6" 
              data-style-height="20px" 
              data-style-width="100%" 
              data-token="defec148-3bc6-4e24-8a6d-b4bf32aa54a8"
            >
              <Link href="https://www.trustpilot.com/review/adv1st.com" target="_blank" rel="noopener">Trustpilot</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}