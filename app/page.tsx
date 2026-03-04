import Link from 'next/link';

export default function Home() {
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
              <h2 className="trustpilot-heading">Transparent pricing and repayment terms</h2>
              <p className="trustpilot-subheading">See why thousands of borrowers have chosen us:</p>
              
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
              <p>Whether it's consolidating debt, covering expenses, or funding big projects, you can secure the money necessary to achieve your goals without difficulty or stress. Elevate your financial success with a customized loan solution through Advantage First's network of lenders.</p>
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

      {/* Solutions Section */}
      <section className="simple-solutions-section">
        <div className="simple-solutions-container">
          <h2>Simple solutions to unique situations</h2>
          <p className="section-subtitle">We connect you with the right loan solution to meet your needs and empower your financial freedom.</p>
          
          <div className="solutions-grid">
            <div className="solution-card">
              <div className="solution-icon">
                <img src="/personal-loans-icon_DT.png" alt="Personal loans" />
              </div>
              <div className="solution-content">
                <h3>Personal loans</h3>
                <p>Accomplish your goals with a simple and hassle-free loan that can be customized to your budget.</p>
                <Link href="/services" className="btn-learn-more">Learn more</Link>
              </div>
            </div>
            <div className="solution-card">
              <div className="solution-icon">
                <img src="/debt-consolidation-icon-DT.png" alt="Debt consolidation" />
              </div>
              <div className="solution-content">
                <h3>Debt consolidation</h3>
                <p>Simplify your finances and save with a single monthly payment at a lower rate.</p>
                <Link href="/services" className="btn-learn-more">Learn more</Link>
              </div>
            </div>
            <div className="solution-card">
              <div className="solution-icon">
                <img src="/home-improvements-icon_DT.png" alt="Home improvement" />
              </div>
              <div className="solution-content">
                <h3>Home improvement</h3>
                <p>Fund renovations big or small to create the home you've always envisioned.</p>
                <Link href="/services" className="btn-learn-more">Learn more</Link>
              </div>
            </div>
            <div className="solution-card">
              <div className="solution-icon">
                <img src="/business-needs-icon_DT.png" alt="Business needs" />
              </div>
              <div className="solution-content">
                <h3>Business needs</h3>
                <p>Unlock capital to support your business's daily operations and future growth.</p>
                <Link href="/services" className="btn-learn-more">Learn more</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Advantage First is here to help you find the right path to financial freedom</h2>
            <p className="cta-loan-subtitle">One application can unlock multiple loan offers.<br />For example:</p>
            
            <table className="cta-loan-table">
              <thead>
                <tr>
                  <th>Lender</th>
                  <th>Amount</th>
                  <th>APR</th>
                  <th>Term</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SoFi</td>
                  <td>$40,000</td>
                  <td>5.99%</td>
                  <td>48 mos.</td>
                </tr>
                <tr>
                  <td>Prosper</td>
                  <td>$35,000</td>
                  <td>6.99%</td>
                  <td>60 mos.</td>
                </tr>
                <tr>
                  <td>Upgrade</td>
                  <td>$30,000</td>
                  <td>7.29%</td>
                  <td>36 mos.</td>
                </tr>
                <tr>
                  <td>Best Egg</td>
                  <td>$25,000</td>
                  <td>8.99%</td>
                  <td>36 mos.</td>
                </tr>
              </tbody>
            </table>
            
            <p>Let's explore your loan options today.</p>
            <Link href="/verify" className="btn-get-quote">Apply Now</Link>
          </div>
          <div className="cta-image">
            <img src="/end_CTA_img_DT.png" alt="Woman with laptop" />
          </div>
        </div>
      </section>

      {/* Financial Wellbeing Section */}
      <section className="financial-wellbeing-section">
        <div className="financial-wellbeing-container">
          <h2>We're all about your financial well-being</h2>
          <p className="section-subtitle">Check out our resources page for useful blog topics, like:</p>
          
          <div className="blog-cards-grid">
            <div className="blog-card">
              <div className="blog-image">
                <img src="/financial_success_img_DT.png" alt="Financial Success" />
              </div>
              <div className="blog-content">
                <h3>Financial Success</h3>
                <p>Elevate your financial success with experts chosen solutions. Affiliates benefit Advantage financial and empower lives.</p>
                <Link href="/blog/financialsuccess" className="blog-link">
                  Read more <img src="/Chevron_Right_DT.png" alt="Arrow" className="blog-arrow" />
                </Link>
              </div>
            </div>
            
            <div className="blog-card">
              <div className="blog-image">
                <img src="/empowering_lives_img_DT.png" alt="Empowering Lives" />
              </div>
              <div className="blog-content">
                <h3>Empowering Lives</h3>
                <p>We empower lives by restoring financial freedom and peace of mind.</p>
                <Link href="/blog/empoweringlives" className="blog-link">
                  Read more <img src="/Chevron_Right_DT.png" alt="Arrow" className="blog-arrow" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="blog-button-wrapper">
            <Link href="/blog" className="btn-see-more">See more</Link>
          </div>
        </div>
      </section>
    </>
  );
}