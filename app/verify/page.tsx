"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function Verify() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [debtValue, setDebtValue] = useState(10000);
  const [sliderPosition, setSliderPosition] = useState(0);
  
  // Controlled inputs for data persistence across steps
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    const trustpilot = (window as any).Trustpilot;
    if (trustpilot && trustpilot.loadFromElement) {
      const widget = document.querySelector('.trustpilot-widget');
      if (widget) {
        trustpilot.loadFromElement(widget);
      }
    }
  }, []);

  useEffect(() => {
    const min = 8000;
    const max = 100000;
    const percent = ((debtValue - min) / (max - min)) * 100;
    setSliderPosition(percent);
  }, [debtValue]);

  const handleNext = (nextStep: number) => {
    setStep(nextStep);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Group our controlled state variables to send to the CRM
    const payload = {
      firstName,
      lastName,
      phone,
      email,
      dob,
      debtValue
    };

    // Fire and forget: send to backend without waiting, keepalive ensures completion
    fetch('/api/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    });

    // Send user to thank you page ASAP
    const queryName = firstName ? encodeURIComponent(firstName) : "Applicant";
    router.push(`/thank-you?firstName=${queryName}`);
  };

  return (
    <>
      <Script src="//challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />

      <div className="padd-left">
        <div className="verify-background">
          <div className="verify-container">
            <div className="verify-form">
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

              <form className="form-grid" id="CustomerForm" onSubmit={handleSubmit}>
                
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

                {step === 2 && (
                  <div className="step-container active">
                    <h1 className="verify-title">See your results</h1>
                    <div className="form-container-step4">
                      <div className="form-group full-width">
                        <input 
                          className="form-control" 
                          placeholder="First Name" 
                          required 
                          name="FirstName" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="form-group full-width">
                        <input 
                          className="form-control" 
                          placeholder="Last Name" 
                          required 
                          name="LastName" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                      <div className="form-group full-width">
                        <input 
                          type="tel" 
                          className="form-control" 
                          placeholder="Phone" 
                          required 
                          name="Phone" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="form-group full-width">
                        <input 
                          type="email" 
                          className="form-control" 
                          placeholder="Email" 
                          required 
                          name="Email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      
                      {/* Third Party Disclosure */}
                      <p style={{textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#1D315F', marginTop: '10px', marginBottom: '5px'}}>
                        <i className="fas fa-shield-alt" style={{marginRight: '6px', color: '#28a745'}}></i> 
                        Your personal information is secure and will not be shared with third parties.
                        <br>By providing your phone number above and clicking on “See your results” below, I consent to receive calls and SMS/text messages regarding my inquiry and pre-approval request. Reply STOP to opt out. Reply HELP for help. Msg &amp; data rates may apply. Message frequency varies. <Link href="/privacy" target="_blank" rel="noopener noreferrer">View our Privacy Policy</Link>.
                      </p>
                    </div>
                    <button type="button" className="btn-next" onClick={() => handleNext(3)}>See your results</button>
                  </div>
                )}

                {step === 3 && (
                  <div className="step-container active">
                    <h1 className="verify-title">Verify Info</h1>
                    <div className="form-container-step5">
                      
                      {/* Flex container to place First and Last Name side by side */}
                      <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                        <div className="form-group" style={{ flex: '1 1 50%' }}>
                          <label style={{display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: 'bold', color: '#1D315F'}}>First Name</label>
                          <input className="form-control" placeholder="First Name" required name="VerifyFirstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 50%' }}>
                          <label style={{display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: 'bold', color: '#1D315F'}}>Last Name</label>
                          <input className="form-control" placeholder="Last Name" required name="VerifyLastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                      </div>

                      <div className="form-group full-width">
                        <label style={{display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: 'bold', color: '#1D315F'}}>Phone</label>
                        <input type="tel" className="form-control" placeholder="Phone" required name="VerifyPhone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="form-group full-width">
                        <label style={{display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: 'bold', color: '#1D315F'}}>Date of Birth</label>
                        <input type="date" className="form-control" placeholder="Date of Birth (mm/dd/yyyy)" required name="DOB" value={dob} onChange={(e) => setDob(e.target.value)} />
                      </div>

                      <p className="credit-consent-disclaimer" style={{textAlign: 'left', fontSize: '13px', lineHeight: '1.5', marginTop: '15px', color: '#555'}}>
                        You understand that by clicking on the “Submit” button below, you are providing written instructions to Advantage First under the Fair Credit Reporting Act authorizing Advantage First to obtain information from your personal credit report or other information from Experian, Transunion, and/or Equifax, solely for debt settlement and fraud prevention purposes.
                        <br /><br />
                        By clicking “Submit” you agree to the Spinwheel <a href="https://legal.spinwheel.io/end-user-agreement/" target="_blank" rel="noopener noreferrer" style={{color: '#0f75bc', textDecoration: 'underline'}}>End User Agreement</a>. Further, you are providing “written instructions” to Spinwheel Solutions, Inc. authorizing it to obtain your credit profile from any consumer reporting agency. I consent to receive calls and SMS/text messages regarding my inquiry and pre-approval request. Reply STOP to opt out. Reply HELP for help. Msg &amp; data rates may apply. Message frequency varies. <Link href="/privacy" target="_blank" rel="noopener noreferrer" style={{color: '#0f75bc', textDecoration: 'underline'}}>View our Privacy Policy</Link>.
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
              <a href="//www.trustpilot.com/review/adv1st.com" target="_blank" rel="noopener noreferrer">
                Trustpilot
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}