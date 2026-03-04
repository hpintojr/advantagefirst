import Link from 'next/link';

export default function Services() {
  return (
    <>
      {/* Services Hero Section */}
      <section className="services-hero">
        <div className="services-hero-container">
          <div className="services-hero-content">
            <h1>Tailored solutions for real-life goals</h1>
            <p>We connect you with the loans that power your financial future.</p>
            <Link href="/verify" className="btn-check-options">
              Check your loan options
            </Link>
          </div>
          <div className="services-hero-image">
            <img src="/images/services_hero_img_DT.png" alt="Couple in wedding dress shop" />
          </div>
        </div>
      </section>

      {/* Financial Flexibility Section */}
      <section className="financial-flexibility-section">
        <div className="financial-flexibility-container">
          <h2>Your path to financial flexibility starts here</h2>
          <p className="intro-text">
            At Advantage First, we offer lending solutions through our trusted partners to meet a wide range of financial needs. We're passionate about turning complex challenges into simple, effective solutions and empowering our clients to achieve greater financial freedom.
          </p>
          <div className="services-grid">
            <div className="service-card">
              <h3>Personal loans:</h3>
              <p>Get a tailored approach to help you achieve your goals, whether it's a dream vacation, major purchase, unexpected expense or large bills. With flexible terms and competitive rates, these loans are designed to empower you on your path to success.</p>
            </div>
            <div className="service-card">
              <h3>Debt consolidation:</h3>
              <p>If you carry high-rate balances, you're paying costly interest fees that drain your budget. Eliminate those bills with a debt consolidation loan at a lower rate. With one easier monthly payment, you could save time, money and undue stress.</p>
            </div>
            <div className="service-card">
              <h3>Home improvement:</h3>
              <p>Transform your living space into your dream home. Access the funds you need to tackle your renovation plans and bring your vision to life. Whether it's a small-scale project or major overhaul, we make it easy to secure the right loan for the job.</p>
            </div>
            <div className="service-card">
              <h3>Business needs:</h3>
              <p>If you're running a small business and need access to capital for everyday operations or growth, you can unlock the funds you need to succeed. We're here to help you find a loan designed to drive your business's prosperity.</p>
            </div>
          </div>
          <div className="services-button-wrapper">
            <p className="solution-ready">Ready to find your solution?</p>
            <Link href="/verify" className="btn-get-quote">
              Get my quote now
            </Link>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="expertise-section">
        <div className="expertise-container">
          <div className="expertise-image-desktop">
            <img src="/images/advantage_img_DT.png" alt="Couple with laptop" />
          </div>
          <div className="expertise-content">
            <h2>Your Advantage is our expertise.</h2>
            <p className="subtitle">Rely on a trusted lender network that offers:</p>
            <ul className="expertise-features">
              <li>Amounts up to $100,000</li>
              <li>Competitive fixed rates as low as 5.99% APR</li>
              <li>Flexible repayment terms up to 72 months</li>
              <li>Transparent pricing with no surprises</li>
              <li>An easy process with fast approval decisions</li>
            </ul>
            <div className="expertise-image expertise-image-mobile">
              <img src="/images/services_img_MB.png" alt="Couple with laptop" />
            </div>
            <Link href="/verify" className="btn-check-options-red">
              Check your loan options
            </Link>
          </div>
        </div>
      </section>

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
            <a href="//www.trustpilot.com/review/adv1st.com" target="_blank" rel="noopener noreferrer">
              Trustpilot
            </a>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us-section">
        <div className="about-us-container">
          <h2>A bit more about us</h2>
          <p className="about-intro">
            At Advantage First, we're your financial allies, dedicated to helping you achieve your goals every step of the way. Not only will you access the strength of our lending partner network, but you can tap into the extensive knowledge of our team of professionals. Each member is dedicated to transforming our clients' lives through financial empowerment. We blend our skills seamlessly to provide personalized solutions that drive each individual's journey to more financial freedom.
          </p>
          <p className="about-tagline">We're privileged to offer:</p>
          <div className="about-features">
            <div className="about-feature-card">
              <div className="about-icon">
                <img src="/images/loan-options_icon_DT.png" alt="Loan options icon" />
              </div>
              <h3>Loan options that make sense for your situation and budget</h3>
            </div>
            <div className="about-feature-card">
              <div className="about-icon">
                <img src="/images/support_icon_DT.png" alt="Support icon" />
              </div>
              <h3>Support so you can seize opportunities and overcome obstacles</h3>
            </div>
            <div className="about-feature-card">
              <div className="about-icon">
                <img src="/images/educational_icon_DT.png" alt="Education icon" />
              </div>
              <h3>Ongoing educational resources for financial wellness</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Discuss Needs Section */}
      <section className="discuss-needs-section">
        <div className="discuss-needs-container">
          <div className="discuss-content">
            <h2>Let's discuss your needs.</h2>
            <p className="discuss-subtitle">We're here to listen and provide guidance.</p>
            <p className="discuss-text">
              You can get a no-obligation consultation with one of our experts to discuss your financial concerns and goals. Whether you're facing an unexpected challenge or planning for the future, we can help you find the way forward.
            </p>
            <a href="tel:800-344-1202" className="btn-request-consultation">
              Request a FREE consultation
            </a>
          </div>
          <div className="discuss-image">
            <img src="/images/services_end_CTA_img_DT.png" alt="Man with laptop" />
          </div>
        </div>
      </section>
    </>
  );
}