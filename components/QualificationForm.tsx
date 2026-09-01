'use client';

import { useState } from 'react';
import { Pencil, Loader2, Phone } from 'lucide-react';
import type { PrefillLead } from '@/lib/qualification';

/**
 * QualificationForm — RocketLoans-style multi-step wizard.
 * One question-card per screen, progress bar + time estimate,
 * conversational headlines, prefilled + masked contact info.
 *
 * Decline rules are enforced server-side in /api/qualify-lead; this
 * component just renders the declined page when the API says so.
 *
 * EDIT QUESTIONS HERE: dropdown options live in the constants below,
 * mirroring the CRM picklists exactly so downstream mapping is 1:1.
 */

// ─── Question options (mirror CRM picklists exactly) ─────────
const LOAN_PURPOSES = [
  'Debt Consolidation',
  'Pay off credit cards',
  'Household Expenses',
  'Emergency expenses',
  'Home improvement / Pool / Solar',
  'New auto purchase',
  'Large Purchase',
  'Medical Bill',
  'Other',
];

const RENT_OR_OWN = ['Rent', 'Homeowner', 'Live with Family', 'Other'];

const TIME_AT_RESIDENCY = [
  '6 months or less',
  'About a year',
  'About 2 years',
  '3 years or more',
];

const EMPLOYMENT_STATUSES = [
  'Employed',
  'Self Employed',
  'Unemployed',
  'Pension',
  'Social Security',
  'Student',
  'Disability',
];

const PAY_FREQUENCIES = ['Weekly', 'Bi-Weekly', 'Monthly', 'Other'];

const TIME_EMPLOYED = [
  '3 months or less',
  'About 6 months',
  'About 1 year',
  '2 years or more',
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC','PR',
];

// Statuses that also need a monthly housing payment amount
const HOUSING_PAYMENT_STATUSES = ['Rent', 'Homeowner'];

const EMPLOYED_STATUSES = ['Employed', 'Self Employed'];

// Results-page call line
const CALL_NOW_DISPLAY = '(949) 669-5546';
const CALL_NOW_TEL = 'tel:+19496695546';

// Loan amount slider bounds
const LOAN_MIN = 7500;
const LOAN_MAX = 100000;
const LOAN_STEP = 500;
const LOAN_DEFAULT = 25000;

const TOTAL_STEPS = 6;

const fmtUSD = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);

// ─── Masking helpers (never render the full stored value) ────
const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '***';
  const area = digits.length >= 10 ? `(${digits.slice(-10, -7)}) ` : '';
  return `${area}***-${digits.slice(-4)}`;
};

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return `${local.charAt(0)}***@${domain}`;
};

// ─── Shared styles (Rocket-style filled fields) ──────────────────
const fieldWrap =
  'rounded-xl bg-pv-surface px-4 py-2.5 focus-within:ring-2 focus-within:ring-af-blue/40';
const fieldLabel = 'block text-xs font-semibold text-pv-muted';
const fieldInput =
  'w-full bg-transparent pt-0.5 text-pv-text placeholder:text-pv-muted/50 focus:outline-none';
const headlineCls = 'font-display text-2xl font-black leading-snug text-af-navy';

type Status = 'idle' | 'submitting' | 'success' | 'declined' | 'error';

const DECLINE_MESSAGES: Record<string, string> = {
  state: "Unfortunately, we don't currently offer loans in your state.",
  no_income: "We aren't able to offer a loan without an active source of income.",
  amount: "We aren't able to offer a loan for the amount requested.",
};

export default function QualificationForm({ lead }: { lead: PrefillLead }) {
  const [form, setForm] = useState({
    phone: lead.phone,
    email: lead.email,
    loanPurpose: '',
    loanAmount: String(
      Math.min(LOAN_MAX, Math.max(LOAN_MIN, lead.loanAmount ?? LOAN_DEFAULT))
    ),
    rentOrOwn: '',
    monthlyRent: '',
    timeAtResidency: '',
    annualIncome: '',
    employmentStatus: '',
    employerName: '',
    payFrequency: '',
    timeEmployed: '',
    addressLine1: lead.addressLine1,
    addressLine2: lead.addressLine2,
    city: lead.city,
    state: lead.state,
    zipCode: lead.zipCode,
  });
  const [step, setStep] = useState(0);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [declineReason, setDeclineReason] = useState('');

  const set = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const needsHousingPayment = HOUSING_PAYMENT_STATUSES.includes(form.rentOrOwn);
  const isEmployed = EMPLOYED_STATUSES.includes(form.employmentStatus);

  const canContinue = (() => {
    switch (step) {
      case 0:
        return Boolean(form.loanPurpose);
      case 1:
        return true;
      case 2:
        return Boolean(form.phone.trim() && form.email.trim());
      case 3:
        return Boolean(
          form.rentOrOwn &&
            form.timeAtResidency &&
            (!needsHousingPayment || form.monthlyRent.trim() !== '')
        );
      case 4:
        return Boolean(
          form.employmentStatus &&
            form.annualIncome.trim() !== '' &&
            (!isEmployed ||
              (form.employerName.trim() && form.payFrequency && form.timeEmployed))
        );
      case 5:
        return Boolean(
          form.addressLine1.trim() &&
            form.city.trim() &&
            form.state &&
            /^[0-9]{5}(-[0-9]{4})?$/.test(form.zipCode.trim())
        );
      default:
        return false;
    }
  })();

  const next = () => {
    if (!canContinue) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/qualify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uniqueId: lead.uniqueId,
          ...form,
          loanAmount: Number(form.loanAmount) || 0,
          monthlyRent: Number(form.monthlyRent) || 0,
          annualIncome: Number(form.annualIncome) || 0,
        }),
      });
      if (!res.ok) {
        setStatus('error');
        return;
      }
      const data = (await res.json()) as { result?: string; reason?: string };
      if (data.result === 'declined') {
        setDeclineReason(data.reason || '');
        setStatus('declined');
      } else {
        setStatus('success');
      }
    } catch {
      setStatus('error');
    }
  };

  // ── Declined state: full-page takeover ──
  if (status === 'declined') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-pv-bg">
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-pv-muted">
            Application Update
          </p>
          <h1 className="mt-4 font-display text-3xl font-black leading-tight text-af-navy sm:text-4xl">
            We&apos;re sorry, {lead.firstName} — we can&apos;t offer you a loan at
            this time.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-pv-muted">
            {DECLINE_MESSAGES[declineReason] ||
              'Based on the information provided, we are unable to offer a loan at this time.'}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-pv-muted">
            Your information has been received. If your situation changes, you are
            welcome to check your options again — it will not affect your credit
            score.
          </p>
          <a
            href="https://www.advantagefirst.com"
            className="mt-8 inline-block rounded-full bg-af-blue px-8 py-3 font-display font-bold text-white transition-colors hover:bg-af-blue-light"
          >
            Return to Advantage First
          </a>
        </div>
      </div>
    );
  }

  // ── Success state: full-page loan results takeover ──
  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-pv-bg">
        <div className="mx-auto max-w-2xl px-4 py-14 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-af-blue">
            Request Received
          </p>
          <h1 className="mt-4 font-display text-4xl font-black leading-tight text-af-navy sm:text-5xl">
            Good news, {lead.firstName} — based on your answers, you may qualify.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pv-muted">
            A loan specialist can review your request, walk you through the loan
            options and rates available to you, and answer your questions. No
            obligation — checking your options will not affect your credit score.
          </p>

          <p className="mt-8 font-display font-bold text-af-navy">Pre-Qualified for:</p>
          <p className="mt-1 font-display text-6xl font-black tracking-tight text-af-blue">
            {fmtUSD(Number(form.loanAmount))}
          </p>

          <a
            href={CALL_NOW_TEL}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-af-blue to-indigo-600 py-5 font-display text-xl font-bold text-white shadow-lg transition-opacity hover:opacity-90 sm:text-2xl"
          >
            <Phone className="h-6 w-6" fill="currentColor" />
            Call Now — {CALL_NOW_DISPLAY}
          </a>
          <p className="mt-3 text-sm text-pv-muted">
            The consultation is free. All rates, terms, and fees are fully disclosed
            before you accept any loan.
          </p>

          <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-2xl bg-af-blue-soft p-6">
              <h3 className="font-display font-bold text-af-navy">
                Have this ready when you call
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-pv-text">
                <li>The balances you want to consolidate or pay off</li>
                <li>Creditor or lender names</li>
                <li>Your approximate monthly income and major expenses</li>
                <li>Your employer details and pay schedule</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-pv-line bg-white p-6">
              <h3 className="font-display font-bold text-af-navy">
                What happens on the call
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-pv-text">
                <li>A loan specialist reviews your request and details</li>
                <li>You hear the loan amounts, rates, and terms you may qualify for</li>
                <li>You can ask questions before making any decision</li>
                <li>You choose whether to move forward — no obligation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const remaining = TOTAL_STEPS - step;
  const minutesLeft = remaining >= 4 ? 2 : 1;

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {/* ── Progress bar + time estimate ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-pv-muted">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-xs text-pv-muted">
            About {minutesLeft} minute{minutesLeft > 1 ? 's' : ''} left
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-pv-line">
          <div
            className="h-1.5 rounded-full bg-af-red transition-all duration-300"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-5">
        {/* ── Step 1: Loan purpose ── */}
        {step === 0 && (
          <>
            <h2 className={headlineCls}>
              Hi {lead.firstName}.
              <br />
              What&apos;s this loan for today?
            </h2>
            <p className="text-sm text-pv-muted">
              Filling out the form won&apos;t affect your credit score.
            </p>
            <div className={fieldWrap}>
              <label htmlFor="loanPurpose" className={fieldLabel}>
                Loan purpose
              </label>
              <select
                id="loanPurpose"
                name="loanPurpose"
                value={form.loanPurpose}
                onChange={set}
                className={fieldInput}
              >
                <option value="">Select one…</option>
                {LOAN_PURPOSES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* ── Step 2: Loan amount ── */}
        {step === 1 && (
          <>
            <h2 className={headlineCls}>How much would you like to borrow?</h2>
            <p className="text-center font-display text-4xl font-black text-af-blue">
              {fmtUSD(Number(form.loanAmount))}
            </p>
            <input
              id="loanAmount"
              type="range"
              name="loanAmount"
              value={form.loanAmount}
              onChange={set}
              min={LOAN_MIN}
              max={LOAN_MAX}
              step={LOAN_STEP}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-pv-line accent-af-blue"
            />
            <div className="flex justify-between text-xs text-pv-muted">
              <span>{fmtUSD(LOAN_MIN)}</span>
              <span>{fmtUSD(LOAN_MAX)}+</span>
            </div>
          </>
        )}

        {/* ── Step 3: Contact confirm ── */}
        {step === 2 && (
          <>
            <h2 className={headlineCls}>Let&apos;s confirm your contact info</h2>
            <div className={fieldWrap}>
              <span className={fieldLabel}>Full name</span>
              <p className="pt-0.5 font-semibold text-pv-text">
                {lead.firstName} {lead.lastName}
              </p>
            </div>

            {!editingPhone ? (
              <div className={`${fieldWrap} flex items-center justify-between`}>
                <div>
                  <span className={fieldLabel}>Phone number</span>
                  <p className="pt-0.5 tracking-wide text-pv-text">
                    {maskPhone(lead.phone)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPhone(true);
                    setForm((f) => ({ ...f, phone: '' }));
                  }}
                  className="flex items-center gap-1 text-sm font-semibold text-af-blue hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" /> Update
                </button>
              </div>
            ) : (
              <div className={fieldWrap}>
                <label htmlFor="phone" className={fieldLabel}>
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={set}
                  placeholder="555-867-5309"
                  autoComplete="tel"
                  inputMode="tel"
                  className={fieldInput}
                />
              </div>
            )}

            {!editingEmail ? (
              <div className={`${fieldWrap} flex items-center justify-between`}>
                <div>
                  <span className={fieldLabel}>Email</span>
                  <p className="pt-0.5 text-pv-text">{maskEmail(lead.email)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEmail(true);
                    setForm((f) => ({ ...f, email: '' }));
                  }}
                  className="flex items-center gap-1 text-sm font-semibold text-af-blue hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" /> Update
                </button>
              </div>
            ) : (
              <div className={fieldWrap}>
                <label htmlFor="email" className={fieldLabel}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={set}
                  placeholder="example@domain.com"
                  autoComplete="email"
                  className={fieldInput}
                />
              </div>
            )}
          </>
        )}

        {/* ── Step 4: Housing ── */}
        {step === 3 && (
          <>
            <h2 className={headlineCls}>Tell us about your housing</h2>
            <div className={fieldWrap}>
              <label htmlFor="rentOrOwn" className={fieldLabel}>
                Rent or own
              </label>
              <select
                id="rentOrOwn"
                name="rentOrOwn"
                value={form.rentOrOwn}
                onChange={set}
                className={fieldInput}
              >
                <option value="">Select one…</option>
                {RENT_OR_OWN.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            {needsHousingPayment && (
              <div className={fieldWrap}>
                <label htmlFor="monthlyRent" className={fieldLabel}>
                  {form.rentOrOwn === 'Rent'
                    ? 'Monthly rent'
                    : 'Monthly housing payment'}
                </label>
                <input
                  id="monthlyRent"
                  type="number"
                  name="monthlyRent"
                  value={form.monthlyRent}
                  onChange={set}
                  min={0}
                  inputMode="numeric"
                  placeholder="500"
                  className={fieldInput}
                />
              </div>
            )}
            <div className={fieldWrap}>
              <label htmlFor="timeAtResidency" className={fieldLabel}>
                Time at residence
              </label>
              <select
                id="timeAtResidency"
                name="timeAtResidency"
                value={form.timeAtResidency}
                onChange={set}
                className={fieldInput}
              >
                <option value="">Select one…</option>
                {TIME_AT_RESIDENCY.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* ── Step 5: Employment & income ── */}
        {step === 4 && (
          <>
            <h2 className={headlineCls}>Your employment and income</h2>
            <div className={fieldWrap}>
              <label htmlFor="employmentStatus" className={fieldLabel}>
                Employment status
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={form.employmentStatus}
                onChange={set}
                className={fieldInput}
              >
                <option value="">Select one…</option>
                {EMPLOYMENT_STATUSES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className={fieldWrap}>
              <label htmlFor="annualIncome" className={fieldLabel}>
                Annual income
              </label>
              <input
                id="annualIncome"
                type="number"
                name="annualIncome"
                value={form.annualIncome}
                onChange={set}
                min={0}
                inputMode="numeric"
                placeholder="55000"
                className={fieldInput}
              />
            </div>
            {isEmployed && (
              <>
                <div className={fieldWrap}>
                  <label htmlFor="employerName" className={fieldLabel}>
                    Employer name
                  </label>
                  <input
                    id="employerName"
                    type="text"
                    name="employerName"
                    value={form.employerName}
                    onChange={set}
                    autoComplete="organization"
                    className={fieldInput}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={fieldWrap}>
                    <label htmlFor="payFrequency" className={fieldLabel}>
                      Pay frequency
                    </label>
                    <select
                      id="payFrequency"
                      name="payFrequency"
                      value={form.payFrequency}
                      onChange={set}
                      className={fieldInput}
                    >
                      <option value="">Select…</option>
                      {PAY_FREQUENCIES.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={fieldWrap}>
                    <label htmlFor="timeEmployed" className={fieldLabel}>
                      Time employed
                    </label>
                    <select
                      id="timeEmployed"
                      name="timeEmployed"
                      value={form.timeEmployed}
                      onChange={set}
                      className={fieldInput}
                    >
                      <option value="">Select…</option>
                      {TIME_EMPLOYED.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── Step 6: Address + submit ── */}
        {step === 5 && (
          <>
            <h2 className={headlineCls}>Last step — confirm your address</h2>
            <div className={fieldWrap}>
              <label htmlFor="addressLine1" className={fieldLabel}>
                Street address
              </label>
              <input
                id="addressLine1"
                type="text"
                name="addressLine1"
                value={form.addressLine1}
                onChange={set}
                autoComplete="address-line1"
                className={fieldInput}
              />
            </div>
            <div className={fieldWrap}>
              <label htmlFor="addressLine2" className={fieldLabel}>
                Apartment, suite, etc (optional)
              </label>
              <input
                id="addressLine2"
                type="text"
                name="addressLine2"
                value={form.addressLine2}
                onChange={set}
                autoComplete="address-line2"
                className={fieldInput}
              />
            </div>
            <div className={fieldWrap}>
              <label htmlFor="city" className={fieldLabel}>
                City
              </label>
              <input
                id="city"
                type="text"
                name="city"
                value={form.city}
                onChange={set}
                autoComplete="address-level2"
                className={fieldInput}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={fieldWrap}>
                <label htmlFor="state" className={fieldLabel}>
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={set}
                  autoComplete="address-level1"
                  className={fieldInput}
                >
                  <option value="">Select…</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className={fieldWrap}>
                <label htmlFor="zipCode" className={fieldLabel}>
                  ZIP code
                </label>
                <input
                  id="zipCode"
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={set}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength={10}
                  className={fieldInput}
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-pv-muted">
              By submitting, you agree to our{' '}
              <a
                href="https://www.advantagefirst.com/privacy"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://www.advantagefirst.com/terms-of-use"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Use
              </a>
              , and consent to be contacted by Advantage First Financial at the
              number provided, including by autodialed or prerecorded calls and
              texts. Consent is not a condition of any purchase. See our{' '}
              <a
                href="https://www.advantagefirst.com/sms-terms"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                SMS Terms
              </a>
              .
            </p>
          </>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <p className="rounded-lg bg-af-red-light p-3 text-center text-sm font-semibold text-af-red">
            Something went wrong submitting your information. Please try again.
          </p>
        )}

        {/* ── CTA + Back ── */}
        {step < TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className="glow-btn flex w-full items-center justify-center gap-2 rounded-full bg-af-red py-4 font-display text-lg font-bold text-white transition-colors hover:bg-af-red-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step === 0 ? "Let's go" : 'Continue'}
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canContinue || status === 'submitting'}
            className="glow-btn flex w-full items-center justify-center gap-2 rounded-full bg-af-red py-4 font-display text-lg font-bold text-white transition-colors hover:bg-af-red-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
              </>
            ) : (
              <>Confirm &amp; See My Offers →</>
            )}
          </button>
        )}

        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="mx-auto block text-sm font-semibold text-pv-muted hover:text-af-navy hover:underline"
          >
            Back
          </button>
        )}
      </div>
    </form>
  );
}
