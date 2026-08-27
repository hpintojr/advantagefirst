/**
 * ═══════════════════════════════════════════════════════════════════
 *  BACKEND CONNECT — Multi-Pipe Lead Router Configuration
 * ═══════════════════════════════════════════════════════════════════
 * 
 *  This file controls where calculator lead data gets sent.
 *  Enable/disable each backend independently. When the calculator
 *  form is submitted, lead data fires to ALL enabled backends
 *  simultaneously.
 * 
 *  HOW TO USE:
 *  1. Set `enabled: true` on the backend(s) you want to activate
 *  2. Fill in the connection string / API key / URL for that backend
 *  3. That's it — the submit handler reads this config at runtime
 * 
 *  You can enable 1 backend or all 4 at once.
 * ═══════════════════════════════════════════════════════════════════
 */

export const backendConfig = {

  // ─────────────────────────────────────────────────────────────────
  //  1. SUPABASE
  //  Direct insert into a Supabase 'leads' table.
  //  Get your URL + anon key from: Supabase Dashboard → Settings → API
  // ─────────────────────────────────────────────────────────────────
  supabase: {
    enabled: true,
    url: process.env.SUPABASE_URL || '',        // e.g. 'https://xyzproject.supabase.co'
    anonKey: process.env.SUPABASE_ANON_KEY || '', // e.g. 'eyJhbGciOiJIUzI1NiIs...'
    tableName: 'leads',   // Table name to insert leads into — upserted on the `email` column, see supabase.ts
    newsletterTable: 'newsletter_subscribers', // Table name for newsletter signups
  },

  // ─────────────────────────────────────────────────────────────────
  //  2. GHL (GoHighLevel) — INBOUND WEBHOOK
  //  Fires lead data to a GHL Workflow Inbound Webhook trigger.
  //  Get URL from: GHL → Automations → New Workflow → Inbound Webhook
  // ─────────────────────────────────────────────────────────────────
  ghlWebhook: {
    enabled: false,
    webhookUrl: '',       // e.g. 'https://services.leadconnectorhq.com/hooks/abc123...'
  },

  // ─────────────────────────────────────────────────────────────────
  //  3. GHL (GoHighLevel) — CONTACTS API
  //  Creates a contact directly via the GHL REST API.
  //  Get API key from: GHL → Settings → Business Profile → API Keys
  //  Location ID from: GHL → Settings → Business Profile
  // ─────────────────────────────────────────────────────────────────
  ghlApi: {
    enabled: true,
    apiKey: process.env.GHL_API_KEY || '',           // GHL Private Integration token — Settings → Business Profile → API Keys
    locationId: process.env.GHL_LOCATION_ID || 'oY7nDZUrZG0KegzadZgI', // Loan Streamline Pro location
  },

  // ─────────────────────────────────────────────────────────────────
  //  4. SALESFORCE
  //  Creates a Lead object via Salesforce Web-to-Lead or REST API.
  //  Option A (Web-to-Lead): Just provide your OID — no auth needed.
  //  Option B (REST API): Provide instance URL + Connected App
  //  client id/secret — salesforce.ts fetches + caches its own OAuth2
  //  client_credentials token, so there's no static token to rotate.
  // ─────────────────────────────────────────────────────────────────
  salesforce: {
    enabled: true,
    mode: 'rest-api' as 'web-to-lead' | 'rest-api',

    // Web-to-Lead mode (simplest) — not used in rest-api mode
    oid: '',              // e.g. '00D5g000004XXXX' (Organization ID)

    // REST API mode (more control) — Connected App client_credentials flow
    instanceUrl: process.env.SALESFORCE_INSTANCE_URL || '', // e.g. 'https://customer-ruby-1712.my.salesforce.com'
    clientId: process.env.SALESFORCE_CLIENT_ID || '',
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET || '',
  },

} as const satisfies Record<string, { enabled: boolean; [key: string]: unknown }>;

// Type helper for consumers
export type BackendKey = keyof typeof backendConfig;
