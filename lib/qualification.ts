/**
 * Lead Qualification — types, Supabase lookup, decline rules, and backend fan-out
 *
 * Powers the adv1st.app/{short_code} pre-filled landing pages.
 * The lead's ID lives in Supabase leads.short_code and GHL contact.short_code.
 *
 * Data access uses two SECURITY DEFINER Postgres functions:
 *   • get_lead_prefill(p_id)          — one lead's prefill fields by exact short_code
 *   • update_lead_qualification(...)  — one lead's qualification fields by exact short_code
 * The anon key is sufficient even with RLS enabled and can never enumerate
 * or bulk-read the leads table.
 *
 * Decline rules (evaluateDecline) are the single source of truth, applied
 * server-side in /api/qualify-lead. All data is collected and stored either
 * way; declined leads are tagged 'declined' in GHL.
 */

import { BackendResult } from './leadTypes';
import { backendConfig } from './backendconnect';

// ─── Short code rules (must match middleware.ts and the Supabase generator) ───

/** 5 chars, alphanumeric, at least one digit. e.g. Kx9mQ */
export const UNIQUE_ID_REGEX = /^(?=[a-zA-Z]*\d)[a-zA-Z0-9]{5}$/;

export function isValidUniqueId(id: string): boolean {
  return UNIQUE_ID_REGEX.test(id);
}

// ─── Qualification rules (single source of truth) ────────────────

/** Anything at or below $14,999 is auto-declined. */
export const MIN_QUALIFYING_AMOUNT = 15000;

/** States we service. Anything else (incl. CO, MN, OR, WA) is declined. */
export const SERVICED_STATES = new Set([
  'AL','AK','AZ','AR','CA','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MS','MO','MT','NE','NV','NH','NJ','NM',
  'NY','NC','ND','OH','OK','PA','RI','SC','SD','TN','TX','UT','VT','VA','WV',
  'WI','WY','PR',
]);

export type DeclineReason = 'state' | 'no_income' | 'amount' | null;

/** Evaluated server-side in the API route; also used client-side for display. */
export function evaluateDecline(input: {
  loanAmount: number;
  state: string;
  annualIncome: number;
}): DeclineReason {
  if (!SERVICED_STATES.has(input.state)) return 'state';
  if (!(input.annualIncome > 0)) return 'no_income';
  if (input.loanAmount < MIN_QUALIFYING_AMOUNT) return 'amount';
  return null;
}

// ─── Types ───────────────────────────────────────────────────

/** What the landing page needs to prefill the form. */
export interface PrefillLead {
  uniqueId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  loanAmount: number | null;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

/** The full submission posted from the form. */
export interface QualificationSubmission {
  uniqueId: string;
  phone: string;
  email: string;
  loanPurpose: string;
  loanAmount: number;
  rentOrOwn: string;
  monthlyRent: number;
  timeAtResidency: string;
  annualIncome: number;
  employmentStatus: string;
  employerName: string;
  payFrequency: string;
  timeEmployed: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  ipAddress: string;
  /** 'qualified' | 'declined' — computed server-side via evaluateDecline */
  result: string;
  /** '' when qualified */
  declineReason: string;
}

// ─── Credentials ───────────────────────────────────────────────

function supabaseCreds() {
  const url = backendConfig.supabase.url || process.env.SUPABASE_URL || '';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    backendConfig.supabase.anonKey ||
    process.env.SUPABASE_ANON_KEY ||
    '';
  return { url, key };
}

function ghlWebhookUrl(): string {
  return (
    process.env.GHL_QUALIFY_WEBHOOK_URL ||
    backendConfig.ghlWebhook.webhookUrl ||
    process.env.GHL_WEBHOOK_URL ||
    ''
  );
}

function ghlApiCreds() {
  return {
    apiKey: process.env.GHL_API_KEY || backendConfig.ghlApi.apiKey || '',
    locationId: process.env.GHL_LOCATION_ID || backendConfig.ghlApi.locationId || '',
  };
}

// ─── Prefill lookup (server-side only, via RPC) ──────────────────

export async function fetchLeadByUniqueId(id: string): Promise<PrefillLead | null> {
  if (!isValidUniqueId(id)) return null;

  const { url, key } = supabaseCreds();
  if (!url || !key) {
    console.error('[qualification] Supabase credentials missing — cannot prefill');
    return null;
  }

  try {
    const res = await fetch(`${url}/rest/v1/rpc/get_lead_prefill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ p_id: id }),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('[qualification] Prefill RPC failed:', res.status, await res.text());
      return null;
    }

    const rows = (await res.json()) as Record<string, unknown>[];
    if (!Array.isArray(rows) || !rows.length) return null;
    const r = rows[0];

    const full = String(r.full_name ?? '').trim();
    const firstName = String(r.first_name ?? '') || full.split(' ')[0] || '';
    const lastName =
      String(r.last_name ?? '') || full.split(' ').slice(1).join(' ') || '';

    return {
      uniqueId: String(r.short_code ?? id),
      firstName,
      lastName,
      phone: String(r.phone ?? ''),
      email: String(r.email ?? ''),
      loanAmount: r.loan_amount != null ? Number(r.loan_amount) : null,
      addressLine1: String(r.address_line1 ?? ''),
      addressLine2: String(r.address_line2 ?? ''),
      city: String(r.city ?? ''),
      state: String(r.state ?? ''),
      zipCode: String(r.zip_code ?? ''),
    };
  } catch (err) {
    console.error('[qualification] Prefill lookup failed:', err);
    return null;
  }
}

// ─── Submission fan-out ──────────────────────────────────────────

async function updateSupabase(sub: QualificationSubmission): Promise<BackendResult> {
  const { url, key } = supabaseCreds();
  if (!url || !key) {
    return { backend: 'supabase', success: false, message: 'Skipped — missing credentials' };
  }

  try {
    const res = await fetch(`${url}/rest/v1/rpc/update_lead_qualification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        p_id: sub.uniqueId,
        p_phone: sub.phone,
        p_email: sub.email,
        p_loan_purpose: sub.loanPurpose,
        p_loan_amount: sub.loanAmount,
        p_rent_or_own: sub.rentOrOwn,
        p_monthly_rent: sub.monthlyRent,
        p_time_at_residency: sub.timeAtResidency,
        p_annual_income: sub.annualIncome,
        p_employment_status: sub.employmentStatus,
        p_employer_name: sub.employerName,
        p_pay_frequency: sub.payFrequency,
        p_time_employed: sub.timeEmployed,
        p_address_line1: sub.addressLine1,
        p_address_line2: sub.addressLine2,
        p_city: sub.city,
        p_state: sub.state,
        p_zip_code: sub.zipCode,
        p_ip: sub.ipAddress,
        p_result: sub.result,
        p_decline_reason: sub.declineReason,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { backend: 'supabase', success: false, message: `HTTP ${res.status}: ${text}` };
    }
    const found = (await res.json()) as boolean;
    if (!found) {
      return { backend: 'supabase', success: false, message: 'No lead matched short_code' };
    }
    return { backend: 'supabase', success: true, message: 'Lead updated by short_code' };
  } catch (err) {
    return {
      backend: 'supabase',
      success: false,
      message: `Error: ${err instanceof Error ? err.message : 'Unknown'}`,
    };
  }
}

async function sendToGhl(sub: QualificationSubmission): Promise<BackendResult> {
  const webhookUrl = ghlWebhookUrl();
  if (!webhookUrl) {
    return { backend: 'ghl-webhook', success: false, message: 'Skipped — missing webhookUrl' };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'lead_qualification',
        short_code: sub.uniqueId,
        phone: sub.phone,
        email: sub.email,
        loan_purpose: sub.loanPurpose,
        loan_amount: sub.loanAmount,
        rent_or_own: sub.rentOrOwn,
        monthly_rent: sub.monthlyRent,
        time_at_residency: sub.timeAtResidency,
        annual_income: sub.annualIncome,
        employment_status: sub.employmentStatus,
        employer_name: sub.employerName,
        pay_frequency: sub.payFrequency,
        time_employed: sub.timeEmployed,
        address_line1: sub.addressLine1,
        address_line2: sub.addressLine2,
        city: sub.city,
        state: sub.state,
        zip_code: sub.zipCode,
        qualified_at: new Date().toISOString(),
        qualification_result: sub.result,
        decline_reason: sub.declineReason,
        tags: [sub.result === 'declined' ? 'declined' : 'qualified'],
      }),
    });
    if (!res.ok) {
      return { backend: 'ghl-webhook', success: false, message: `HTTP ${res.status}` };
    }
    return { backend: 'ghl-webhook', success: true, message: 'Qualification sent to GHL workflow' };
  } catch (err) {
    return {
      backend: 'ghl-webhook',
      success: false,
      message: `Error: ${err instanceof Error ? err.message : 'Unknown'}`,
    };
  }
}

/**
 * Direct GHL Contacts API push (no webhook required).
 * Upserts the contact by email/phone, writes the qualification custom
 * fields (which must exist in the location), and adds the result tag.
 */
async function sendToGhlApi(sub: QualificationSubmission): Promise<BackendResult> {
  const { apiKey, locationId } = ghlApiCreds();
  if (!apiKey || !locationId) {
    return { backend: 'ghl-api', success: false, message: 'Skipped — missing apiKey or locationId' };
  }

  const customFields = [
    { key: 'short_code', field_value: sub.uniqueId },
    { key: 'loan_purpose', field_value: sub.loanPurpose },
    { key: 'loan_amount', field_value: String(sub.loanAmount) },
    { key: 'rent_or_own', field_value: sub.rentOrOwn },
    { key: 'monthly_rent', field_value: String(sub.monthlyRent) },
    { key: 'time_at_residency', field_value: sub.timeAtResidency },
    { key: 'annual_income', field_value: String(sub.annualIncome) },
    { key: 'employment_status', field_value: sub.employmentStatus },
    { key: 'employer_name', field_value: sub.employerName },
    { key: 'pay_frequency', field_value: sub.payFrequency },
    { key: 'time_employed', field_value: sub.timeEmployed },
    { key: 'qualification_result', field_value: sub.result },
    { key: 'decline_reason', field_value: sub.declineReason },
  ];

  try {
    const res = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
      },
      body: JSON.stringify({
        locationId,
        email: sub.email,
        phone: sub.phone,
        address1: sub.addressLine1,
        city: sub.city,
        state: sub.state,
        postalCode: sub.zipCode,
        customFields,
        tags: [sub.result === 'declined' ? 'declined' : 'qualified'],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { backend: 'ghl-api', success: false, message: `HTTP ${res.status}: ${text}` };
    }
    return { backend: 'ghl-api', success: true, message: 'Contact upserted with qualification fields' };
  } catch (err) {
    return {
      backend: 'ghl-api',
      success: false,
      message: `Error: ${err instanceof Error ? err.message : 'Unknown'}`,
    };
  }
}

export async function routeQualifiedLeadToBackends(
  sub: QualificationSubmission
): Promise<BackendResult[]> {
  const settled = await Promise.allSettled([
    updateSupabase(sub),
    sendToGhl(sub),
    sendToGhlApi(sub),
  ]);
  return settled.map((r) =>
    r.status === 'fulfilled'
      ? r.value
      : { backend: 'unknown', success: false, message: `Unhandled: ${r.reason}` }
  );
}
