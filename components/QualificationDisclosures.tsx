/**
 * FCRA prescreen + lending disclosures for the adv1st.app landing pages.
 * Required because leads originate from prescreened credit bureau data.
 * Text mirrors the direct-mail piece — keep the two in sync.
 */
export default function QualificationDisclosures() {
  return (
    <section className="mx-auto max-w-2xl border-t border-pv-line px-4 py-8 text-[11px] leading-relaxed text-pv-muted">
      <h2 className="mb-3 font-display text-xs font-bold uppercase tracking-wide text-pv-muted">
        Important Disclosures
      </h2>

      <ol className="mb-3 list-decimal space-y-0.5 pl-4">
        <li>Annual percentage rates (APRs) to be no greater than 35.99%.</li>
        <li>Payment based on loan amount of $23,000.</li>
        <li>Loan terms range from 61 days to 180 months.</li>
        <li>
          Monthly savings based on original payment of $735, and new payment of $406.
        </li>
      </ol>

      <p className="mb-3">
        <strong>Pre-Screen and Opt-out Notice:</strong> You received this
        pre-screened offer to apply for credit because you meet Advantage First
        Financial, LLC&apos;s initial credit worthiness criteria. If your
        application information differs from the information used during our
        pre-selection or you are unable to meet our original selection criteria, we
        may not be able to approve your application. Loans may be brokered to 3rd
        parties. If you do not want to receive pre-screened offers of credit from
        this and other companies, call 1-888-567-8688 or write TransUnion Opt-Out
        Request at P.O. Box 505, Woodlyn, PA 19094-0505, Experian Information
        Systems, Inc., P.O. Box 919, Allen, TX 75013, and/or Equifax Options, P.O.
        Box 740123, Atlanta, GA 30374-0123.
      </p>

      <p className="mb-3">
        *This correspondence is for a debt consolidation loan referred by Advantage
        First Financial, LLC. A third-party funds all loan requests. Advantage
        First Financial, LLC has no control over participating lender
        creditworthiness eligibility criteria. APR/Interest rates will vary
        depending on individual lender terms. Advantage First Financial, LLC does
        not endorse participating lenders or brokers and will not charge you for
        referring you to a participating lender. Advantage First Financial, LLC
        performs research and refers you to participating lenders you deal directly
        with. Please contact your lender directly for details, questions, or
        concerns regarding your requested loan. Lenders may perform credit checks
        to evaluate your eligibility. By submitting a request to a participating
        lender, you authorize the lender to verify the information you submitted
        and your creditworthiness independently. These services and qualified
        participating lenders are not available in all states or where prohibited
        by any state law. Void where prohibited.
      </p>

      <p className="mb-3">
        Annual percentage rates (APRs) through Advantage First Financial, LLC will
        be no greater than 35.99% APR with terms from 61 days to 180 months. Loan
        term ranges from 61 days to 180 months. Eligibility is not guaranteed, and
        requires that you meet credit and other conditions including: (a) you
        continuing to meet criteria for this prescreened offer; (b) your credit
        report, application and credit history meet our pre-established credit
        criteria; (c) your monthly debt-to-income ratio (i.e., total monthly debt
        payments divided by monthly gross income) cannot exceed 50%; and (d) you
        have been employed for at least one (1) year. Please be advised that any
        discretionary loan amounts have not been factored in the program example
        provided herein. Please note that the program example is solely intended
        for illustrative purposes and should not be construed as a representation
        or warranty of any rates or outcomes.
      </p>

      <p className="mb-3">
        <strong>Opt-In Notice:</strong> By contacting Advantage First Financial,
        LLC Group, Inc., or submitting contact information to Advantage First
        Financial, LLC Group, Inc., you are agreeing to allow Advantage First
        Financial, LLC and its third-party affiliates to contact you in the future
        by electronic mail, telephone, SMS, and/or other forms of media both
        physical and electronic. If you would like to opt-out of future
        communications, please contact us at{' '}
        <a
          href="https://www.advantagefirst.com/contact-us/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.advantagefirst.com/contact-us/
        </a>
        .
      </p>

      <p className="mb-3">
        <strong>Opt-Out Information:</strong> You have the right to prohibit the
        use of your personal and mortgage information in any offer from Advantage
        First Financial, LLC Group, that is not initiated by yourself, and if you
        do not wish to receive any future offers from Advantage First Financial,
        LLC, you can opt out by calling us toll-free at 949-313-4416.
      </p>

      <p className="mb-3">
        <strong>USA Patriot Act:</strong> To help the government fight the funding
        of terrorism and money laundering activities, Federal law requires
        financial institutions to obtain, verify, and record information that
        identifies each person who opens an account. What this means to you: When
        you open an account, we will ask for information such as your name,
        address, date of birth or other information that will allow us to identify
        you. We may also request another identifying document.
      </p>

      <p className="mb-3">
        <strong>License Information:</strong> Advantage First Financial, LLC, is a
        Utah licensed lender under the Utah Department of Financial Institutions.
      </p>

      <p className="italic">
        <strong>PRESCREEN &amp; OPT-OUT NOTICE:</strong> This
        &ldquo;prescreened&rdquo; offer of credit is based on information in your
        credit report indicating that you meet certain criteria. If you do not want
        to receive prescreened offers of credit from this and other companies, call
        the consumer reporting agencies toll-free at 1-888-5OPT-OUT
        (1-888-567-8688); or visit the website at{' '}
        <a
          href="https://www.optoutprescreen.com"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.optoutprescreen.com
        </a>
        ; or write: Equifax Information Services, P.O. Box 740123, Atlanta, GA
        30374-0123; TransUnion, Opt Out Request, P.O. Box 505, Woodlyn, PA
        19094-0505; Experian Consumer Opt Out, P.O. Box 919, Allen, TX 75013.
      </p>
    </section>
  );
}
