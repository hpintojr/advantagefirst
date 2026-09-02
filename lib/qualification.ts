/**
 * Lead Qualification — types, Supabase lookup, decline rules, and backend fan-out
 *
 * Powers the adv1st.app/{unique_id} pre-filled landing pages.
 *
 * Data access uses two SECURITY DEFINER Postgres functions:
 *   • get_lead_prefill(p_id)          — one lead's prefill fields by exact ID
 *   • update_lead_qualification(...)  — one lead's qualification fields by exact ID
 * The anon key is sufficient even with RLS enabled and can never enumerate
 * or bulk-read the leads table.
 *
 * Decline rules (evaluateDecline) are the single source of truth, applied
 * server-side in /api/qualify-lead. All data is collected and stored either
 * way; declined leads are tagged 'declined' in GHL.
 */

import { BackendResult } from './leadTypes';
import { backendConfig } from './backendconnect';

// ─── Unique ID rules (must match middleware.ts and the Supabase generator) ───

/** 5 chars, alphanumeric (letters-only codes like JSYNB are valid). */
export const UNIQUE_ID_REGEX = /^[a-zA-Z0-9]{5}$/;

/** Real site paths that must never be treated as short codes. */
const RESERVED_CODES = new Set([
  'about','terms','legal','blogs','press','apply','loans','admin','login',
]);

export function isValidUniqueId(id: string): boolean {
  return UNIQUE_ID_REGEX.test(id) && !RESERVED_CODES.has(id.toLowerCase());
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

// ─── Types ────────────────────────────────────────────────

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

// ─── Credentials ─────────────────────────────────────────

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

// ─── Submission fan-out ────────────────────────────────────

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
      return { backend: 'supabase', success: false, message: 'No lead matched unique_id' };
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
        // NOTE: no `tags` here — upsert REPLACES the whole tag array and
        // would wipe sync tags like master-db-sync. Tag is ADDED below.
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { backend: 'ghl-api', success: false, message: `HTTP ${res.status}: ${text}` };
    }

    // Additively apply the result tag so existing tags are preserved.
    const data = (await res.json()) as { contact?: { id?: string } };
    const contactId = data.contact?.id;
    if (contactId) {
      const tagRes = await fetch(
        `https://services.leadconnectorhq.com/contacts/${contactId}/tags`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            Version: '2021-07-28',
          },
          body: JSON.stringify({
            tags: [sub.result === 'declined' ? 'declined' : 'qualified'],
          }),
        }
      );
      if (!tagRes.ok) {
        return {
          backend: 'ghl-api',
          success: true,
          message: `Contact upserted; tag add failed (HTTP ${tagRes.status})`,
        };
      }
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

/**
 * Salesforce push via OAuth 2.0 Client Credentials flow.
 * Upserts the Lead on the Short_Code__c external ID.
 *
 * IMPORTANT: several SF picklists store NUMERIC CODES, not labels
 * (discovered from field metadata) — mapped below.
 * Skipped gracefully unless SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET
 * and SALESFORCE_INSTANCE_URL are set.
 */
const SF_EMPLOYMENT_STATUS: Record<string, string> = {
  Employed: '1',
  'Social Security': '2',
  Pension: '3',
  Disability: '4',
  'Self Employed': '5',
  Student: '6',
  Unemployed: '7',
};
const SF_PAY_FREQUENCY: Record<string, string> = {
  Weekly: '1',
  'Bi-Weekly': '2',
  Monthly: '4',
  Other: '6',
};
const SF_RENT_OR_OWN: Record<string, string> = {
  Homeowner: '1',
  Rent: '2',
  'Live with Family': '3',
  Other: '4',
};
const SF_TIME_EMPLOYED: Record<string, string> = {
  '3 months or less': '3',
  'About 6 months': '6',
  'About 1 year': '12',
  '2 years or more': '24',
};
const SF_TIME_AT_RESIDENCY: Record<string, string> = {
  '6 months or less': '6',
  'About a year': '12',
  'About 2 years': '24',
  '3 years or more': '36',
};

async function sendToSalesforce(sub: QualificationSubmission): Promise<BackendResult> {
  const clientId = process.env.SALESFORCE_CLIENT_ID || '';
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET || '';
  const instanceUrl = (process.env.SALESFORCE_INSTANCE_URL || '').replace(/\/$/, '');
  if (!clientId || !clientSecret || !instanceUrl) {
    return { backend: 'salesforce', success: false, message: 'Skipped — missing credentials' };
  }

  try {
    const tokenRes = await fetch(`${instanceUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    if (!tokenRes.ok) {
      return {
        backend: 'salesforce',
        success: false,
        message: `Token HTTP ${tokenRes.status}: ${await tokenRes.text()}`,
      };
    }
    const { access_token: accessToken } = (await tokenRes.json()) as {
      access_token: string;
    };

    const fields: Record<string, unknown> = {
      Phone: sub.phone,
      Street: sub.addressLine2
        ? `${sub.addressLine1}, ${sub.addressLine2}`
        : sub.addressLine1,
      City: sub.city,
      State: sub.state,
      PostalCode: sub.zipCode,
      Loan_Amount__c: sub.loanAmount,
      Annual_Income__c: sub.annualIncome,
      Monthly_Rent__c: sub.monthlyRent,
      Employer_Name__c: sub.employerName,
    };
    if (sub.email) fields.Email = sub.email;
    const es = SF_EMPLOYMENT_STATUS[sub.employmentStatus];
    if (es) fields.Employment_Status__c = es;
    const pf = SF_PAY_FREQUENCY[sub.payFrequency];
    if (pf) fields.Pay_Frequency__c = pf;
    const ro = SF_RENT_OR_OWN[sub.rentOrOwn];
    if (ro) fields.Rent_or_Own__c = ro;
    const te = SF_TIME_EMPLOYED[sub.timeEmployed];
    if (te) fields.How_long_have_you_been_employed__c = te;
    const tr = SF_TIME_AT_RESIDENCY[sub.timeAtResidency];
    if (tr) fields.How_long_have_you_been_at_your_residency__c = tr;

    // Upsert on the Short_Code__c external ID — no duplicate leads.
    const upsertRes = await fetch(
      `${instanceUrl}/services/data/v62.0/sobjects/Lead/Short_Code__c/${encodeURIComponent(sub.uniqueId)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(fields),
      }
    );
    if (!upsertRes.ok) {
      return {
        backend: 'salesforce',
        success: false,
        message: `Upsert HTTP ${upsertRes.status}: ${await upsertRes.text()}`,
      };
    }
    return { backend: 'salesforce', success: true, message: 'Lead upserted on Short_Code__c' };
  } catch (err) {
    return {
      backend: 'salesforce',
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
    sendToSalesforce(sub),
  ]);
  return settled.map((r) =>
    r.status === 'fulfilled'
      ? r.value
      : { backend: 'unknown', success: false, message: `Unhandled: ${r.reason}` }
  );
}
