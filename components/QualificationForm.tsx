'use client';

import { useState } from 'react';
import { Pencil, Loader2, Phone } from 'lucide-react';
import type { PrefillLead } from '@/lib/qualification';

/**
 * QualificationForm — masked, pre-filled confirmation + qualifying questions.
 *
 * EDIT QUESTIONS HERE: all dropdown options live in the constants below,
 * mirroring the CRM field values exactly. Keep values identical to the
 * GHL / Salesforce picklists so downstream mapping is 1:1.
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
  'VA','WA','WV','WI','WY','DC',
];

// Statuses that use employer / pay details
const EMPLOYED_STATUSES = ['Employed', 'Self Employed'];

// Results-page call line
const CALL_NOW_DISPLAY = '(949) 669-5546';
const CALL_NOW_TEL = 'tel:+19496695546';

// Loan amount slider bounds
const LOAN_MIN = 1000;
const LOAN_MAX = 100000;
const LOAN_STEP = 500;
const LOAN_DEFAULT = 25000;

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

// ─── Shared styles ─────────────────────────────────────────────
const inputCls =
  'w-full rounded-lg border border-pv-line bg-white p-3 text-pv-text placeholder:text-pv-muted/60 focus:border-af-blue focus:outline-none focus:ring-2 focus:ring-af-blue/30';
const labelCls = 'mb-1 block text-sm font-semibold text-af-navy';
const sectionTitleCls =
  'font-display text-base font-bold uppercase tracking-wide text-af-blue';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function QualificationForm({ lead }: { lead: PrefillLead }) {
  const [form, setForm] = useState({
    phone: lead.phone,
    email: lead.email,
    loanPurpose: '',
    loanAmount: String(
      Math.min(LOAN_MAX, Math.max(LOAN_MIN, lead.loanAmount ?? LOAN_DEFAULT))
    ),
    rentOrOwn: '',
    monthlyRent: '0',
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
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  const set = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const isRenting = form.rentOrOwn === 'Rent';
  const isEmployed = EMPLOYED_STATUSES.includes(form.employmentStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

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

          <div className="mt-7 inline-block rounded-full bg-af-blue-ice px-6 py-2.5 font-display font-bold text-af-navy">
            Pre-Qualified for:{' '}
            <span className="text-af-blue">{fmtUSD(Number(form.loanAmount))}</span>
          </div>

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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      {/* ── Step 1: Contact info (masked + editable) ── */}
      <fieldset className="space-y-4">
        <legend className={sectionTitleCls}>Step 1 · Verify Your Contact Info</legend>

        <div>
          <label className={labelCls}>Full Name</label>
          <div className="rounded-lg border border-pv-line bg-pv-surface/60 p-3 font-semibold text-pv-text">
            {lead.firstName} {lead.lastName}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className={labelCls}>
            Phone Number
          </label>
          {!editingPhone ? (
            <div className="flex items-center justify-between rounded-lg border border-pv-line bg-pv-surface/60 p-3">
              <span className="tracking-wide text-pv-text">{maskPhone(lead.phone)}</span>
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
            <input
              id="phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={set}
              placeholder="(555) 555-1234"
              autoComplete="tel"
              inputMode="tel"
              className={inputCls}
              required
            />
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>
            Email Address
          </label>
          {!editingEmail ? (
            <div className="flex items-center justify-between rounded-lg border border-pv-line bg-pv-surface/60 p-3">
              <span className="text-pv-text">{maskEmail(lead.email)}</span>
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
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={set}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputCls}
              required
            />
          )}
        </div>
      </fieldset>

      {/* ── Step 2: Qualification details ── */}
      <fieldset className="space-y-4 border-t border-pv-line pt-6">
        <legend className={`${sectionTitleCls} pt-6`}>
          Step 2 · Qualification Details
        </legend>

        <div>
          <label htmlFor="loanPurpose" className={labelCls}>
            Loan Purpose
          </label>
          <select
            id="loanPurpose"
            name="loanPurpose"
            value={form.loanPurpose}
            onChange={set}
            className={inputCls}
            required
          >
            <option value="">Select one…</option>
            {LOAN_PURPOSES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <label htmlFor="loanAmount" className={labelCls}>
              Loan Amount
            </label>
            <span className="font-display text-xl font-black text-af-blue">
              {fmtUSD(Number(form.loanAmount))}
            </span>
          </div>
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
            required
          />
          <div className="mt-1 flex justify-between text-xs text-pv-muted">
            <span>{fmtUSD(LOAN_MIN)}</span>
            <span>{fmtUSD(LOAN_MAX)}+</span>
          </div>
        </div>

        <div className={`grid gap-4 ${isRenting ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <div>
            <label htmlFor="rentOrOwn" className={labelCls}>
              Rent or Own
            </label>
            <select
              id="rentOrOwn"
              name="rentOrOwn"
              value={form.rentOrOwn}
              onChange={set}
              className={inputCls}
              required
            >
              <option value="">Select one…</option>
              {RENT_OR_OWN.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          {isRenting && (
            <div>
              <label htmlFor="monthlyRent" className={labelCls}>
                Monthly Rent
              </label>
              <input
                id="monthlyRent"
                type="number"
                name="monthlyRent"
                value={form.monthlyRent}
                onChange={set}
                min={0}
                inputMode="numeric"
                className={inputCls}
                required
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="timeAtResidency" className={labelCls}>
            Time at Residence
          </label>
          <select
            id="timeAtResidency"
            name="timeAtResidency"
            value={form.timeAtResidency}
            onChange={set}
            className={inputCls}
            required
          >
            <option value="">Select one…</option>
            {TIME_AT_RESIDENCY.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="employmentStatus" className={labelCls}>
              Employment Status
            </label>
            <select
              id="employmentStatus"
              name="employmentStatus"
              value={form.employmentStatus}
              onChange={set}
              className={inputCls}
              required
            >
              <option value="">Select one…</option>
              {EMPLOYMENT_STATUSES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="annualIncome" className={labelCls}>
              Annual Income
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
              className={inputCls}
              required
            />
          </div>
        </div>

        {isEmployed && (
          <>
            <div>
              <label htmlFor="employerName" className={labelCls}>
                Employer Name
              </label>
              <input
                id="employerName"
                type="text"
                name="employerName"
                value={form.employerName}
                onChange={set}
                autoComplete="organization"
                className={inputCls}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="payFrequency" className={labelCls}>
                  Pay Frequency
                </label>
                <select
                  id="payFrequency"
                  name="payFrequency"
                  value={form.payFrequency}
                  onChange={set}
                  className={inputCls}
                  required
                >
                  <option value="">Select one…</option>
                  {PAY_FREQUENCIES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="timeEmployed" className={labelCls}>
                  Time Employed
                </label>
                <select
                  id="timeEmployed"
                  name="timeEmployed"
                  value={form.timeEmployed}
                  onChange={set}
                  className={inputCls}
                  required
                >
                  <option value="">Select one…</option>
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
      </fieldset>

      {/* ── Step 3: Address ── */}
      <fieldset className="space-y-4 border-t border-pv-line pt-6">
        <legend className={`${sectionTitleCls} pt-6`}>Step 3 · Confirm Address</legend>

        <div>
          <label htmlFor="addressLine1" className={labelCls}>
            Street Address
          </label>
          <input
            id="addressLine1"
            type="text"
            name="addressLine1"
            value={form.addressLine1}
            onChange={set}
            autoComplete="address-line1"
            className={inputCls}
            required
          />
        </div>

        <div>
          <label htmlFor="addressLine2" className={labelCls}>
            Apt, Suite, Unit <span className="font-normal text-pv-muted">(optional)</span>
          </label>
          <input
            id="addressLine2"
            type="text"
            name="addressLine2"
            value={form.addressLine2}
            onChange={set}
            autoComplete="address-line2"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-3">
            <label htmlFor="city" className={labelCls}>
              City
            </label>
            <input
              id="city"
              type="text"
              name="city"
              value={form.city}
              onChange={set}
              autoComplete="address-level2"
              className={inputCls}
              required
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="state" className={labelCls}>
              State
            </label>
            <select
              id="state"
              name="state"
              value={form.state}
              onChange={set}
              autoComplete="address-level1"
              className={`${inputCls} px-2`}
              required
            >
              <option value="">--</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor="zipCode" className={labelCls}>
              ZIP Code
            </label>
            <input
              id="zipCode"
              type="text"
              name="zipCode"
              value={form.zipCode}
              onChange={set}
              autoComplete="postal-code"
              inputMode="numeric"
              pattern="[0-9]{5}(-[0-9]{4})?"
              maxLength={10}
              className={inputCls}
              required
            />
          </div>
        </div>
      </fieldset>

      {/* ── CTA ── */}
      {status === 'error' && (
        <p className="rounded-lg bg-af-red-light p-3 text-center text-sm font-semibold text-af-red">
          Something went wrong submitting your information. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="glow-btn flex w-full items-center justify-center gap-2 rounded-full bg-af-red py-4 font-display text-lg font-bold text-white transition-colors hover:bg-af-red-hover disabled:opacity-60"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
          </>
        ) : (
          <>Confirm &amp; See My Offers →</>
        )}
      </button>
    </form>
  );
}
