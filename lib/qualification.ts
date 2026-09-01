/**
 * Lead Qualification — types, Supabase lookup, and backend fan-out
 *
 * Powers the adv1st.app/{unique_id} pre-filled landing pages.
 *
 * Flow:
 *   1. fetchLeadByUniqueId() — server-side prefill lookup (page.tsx)
 *   2. routeQualifiedLeadToBackends() — on submit, fans the answers out:
 *        • Supabase  → UPDATE the lead row matched on unique_id (source of truth)
 *        • GHL       → flat JSON to the inbound webhook (workflow maps fields,
 *                      adds "qualified" tag, moves pipeline stage)
 *      Salesforce/CallTools are updated downstream by the existing
 *      Supabase → SF/CallTools sync, keyed on the same unique_id.
 *
 * Credentials come from backendconnect.ts if filled, else from env
 * (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY /
 *  GHL_QUALIFY_WEBHOOK_URL or GHL_WEBHOOK_URL). All server-side only.
 */

import { BackendResult } from './leadTypes';
import { backendConfig } from './backendconnect';

// ─── Unique ID rules (must match middleware.ts and the Supabase generator) ───

/** 5 chars, alphanumeric, at least one digit. e.g. Kx9mQ */
export const UNIQUE_ID_REGEX = /^(?=[a-zA-Z]*\d)[a-zA-Z0-9]{5}$/;

export function isValidUniqueId(id: string): boolean {
  return UNIQUE_ID_REGEX.test(id);
}

// ─── Types ───────────────────────────────────────────────────────

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
}

// ─── Credentials ─────────────────────────────────────────────────

function supabaseCreds() {
  const url = backendConfig.supabase.url || process.env.SUPABASE_URL || '';
  // Service role preferred for reads (bypasses RLS); anon works if RLS allows.
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    backendConfig.supabase.anonKey ||
    process.env.SUPABASE_ANON_KEY ||
    '';
  return { url, key, table: backendConfig.supabase.tableName || 'leads' };
}

function ghlWebhookUrl(): string {
  // Use a dedicated qualification webhook if configured, else the shared one.
  return (
    process.env.GHL_QUALIFY_WEBHOOK_URL ||
    backendConfig.ghlWebhook.webhookUrl ||
    process.env.GHL_WEBHOOK_URL ||
    ''
  );
}

// ─── Prefill lookup (server-side only) ───────────────────────────

const PREFILL_COLUMNS =
  'unique_id,first_name,last_name,full_name,phone,email,loan_amount,address_line1,address_line2,city,state,zip_code';

export async function fetchLeadByUniqueId(id: string): Promise<PrefillLead | null> {
  if (!isValidUniqueId(id)) return null;

  const { url, key, table } = supabaseCreds();
  if (!url || !key) {
    console.error('[qualification] Supabase credentials missing — cannot prefill');
    return null;
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/${table}?unique_id=eq.${encodeURIComponent(id)}&select=${PREFILL_COLUMNS}&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
      }
    );
    if (!res.ok) return null;

    const rows = (await res.json()) as Record<string, unknown>[];
    if (!rows.length) return null;
    const r = rows[0];

    // Derive first/last from full_name when split columns are empty.
    const full = String(r.full_name ?? '').trim();
    const firstName = String(r.first_name ?? '') || full.split(' ')[0] || '';
    const lastName =
      String(r.last_name ?? '') || full.split(' ').slice(1).join(' ') || '';

    return {
      uniqueId: String(r.unique_id ?? id),
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
  const { url, key, table } = supabaseCreds();
  if (!url || !key) {
    return { backend: 'supabase', success: false, message: 'Skipped — missing credentials' };
  }

  const payload = {
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
    qualification_ip: sub.ipAddress,
  };

  try {
    const res = await fetch(
      `${url}/rest/v1/${table}?unique_id=eq.${encodeURIComponent(sub.uniqueId)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      return { backend: 'supabase', success: false, message: `HTTP ${res.status}: ${text}` };
    }
    return { backend: 'supabase', success: true, message: 'Lead updated by unique_id' };
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
        unique_id: sub.uniqueId,
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
        tags: ['qualified'],
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

export async function routeQualifiedLeadToBackends(
  sub: QualificationSubmission
): Promise<BackendResult[]> {
  const settled = await Promise.allSettled([updateSupabase(sub), sendToGhl(sub)]);
  return settled.map((r) =>
    r.status === 'fulfilled'
      ? r.value
      : { backend: 'unknown', success: false, message: `Unhandled: ${r.reason}` }
  );
}
