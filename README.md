# Advantage First Financial — Backend Setup & Configuration

## Architecture Overview

The site uses a **multi-pipe lead routing system**. When a user submits the calculator form or subscribes to the newsletter, data fires to **all enabled backends simultaneously**. No single backend failure blocks the others.

```text
User submits form
       │
       ▼
  /api/submit-lead  (or /api/subscribe-newsletter)
       │
       ▼
  lib/backends/index.ts  ← Orchestrator
       │
       ├── Supabase?     → INSERT into your table
       ├── GHL Webhook?  → POST to your workflow URL
       ├── GHL API?      → Create contact via REST
       └── Salesforce?   → Web-to-Lead or REST API
```

**Key files:**

| File | Purpose |
| --- | --- |
| `lib/backendconnect.ts` | Enable/disable backends + connection credentials |
| `lib/backendcolumns.ts` | Customize field names per backend |
| `lib/backends/index.ts` | Routing orchestrator (don't edit unless adding a new backend) |
| `lib/leadTypes.ts` | Lead data type definitions |
| `lib/newsletterTypes.ts` | Newsletter subscriber type definitions |

---

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in your values
3. Run the dev server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

---

## Quick Start — Backend Setup

1. Open `lib/backendconnect.ts`
2. Find the backend you want to enable
3. Set `enabled: true`
4. Fill in the connection credentials
5. Restart the dev server (`npm run dev`)
6. That's it — leads and newsletter subs will start flowing

You can enable **1 backend or all 4** at the same time.

---

## Backend Setup — Step by Step

### 1. Supabase

**What it does:** Inserts lead data directly into a Supabase PostgreSQL table.

**Setup:**

```typescript
// In lib/backendconnect.ts
supabase: {
  enabled: true,                                    // ← flip to true
  url: 'https://xyzproject.supabase.co',            // ← your project URL
  anonKey: 'eyJhbGciOiJIUzI1NiIs...',               // ← your anon/public key
  tableName: 'leads',                                // ← table for calculator leads
  newsletterTable: 'newsletter_subscribers',          // ← table for newsletter signups
},
```

**Where to find your credentials:**

1. Go to [supabase.com](https://supabase.com) → your project
2. Navigate to **Settings → API**
3. Copy the **Project URL** → paste as `url`
4. Copy the **anon / public key** → paste as `anonKey`

**Required Supabase table schemas:**

Run these SQL statements in your Supabase SQL Editor to create both tables.

**Leads table:**

```sql
CREATE TABLE leads (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name       TEXT NOT NULL,
  first_name      TEXT,
  last_name       TEXT,
  phone           TEXT NOT NULL,
  email           TEXT NOT NULL,
  state           TEXT,
  loan_amount     NUMERIC,
  loan_term       INTEGER,
  estimated_monthly_payment  NUMERIC,
  estimated_total_cost       NUMERIC,
  unsecured_total            NUMERIC,
  estimated_savings          NUMERIC,
  sms_consent               BOOLEAN DEFAULT FALSE,
  communications_consent    BOOLEAN DEFAULT FALSE,
  quote_id                  INTEGER,
  submitted_at              TIMESTAMPTZ DEFAULT NOW(),
  source                    TEXT DEFAULT 'advantagefirst.com/calculator',
  created_at                TIMESTAMPTZ DEFAULT NOW()
);
```

**Newsletter subscribers table:**

```sql
CREATE TABLE newsletter_subscribers (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email           TEXT NOT NULL UNIQUE,
  source          TEXT,          -- 'blog_preview', 'blog_page', 'blog_article'
  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**Quote counter table (for sequential reference numbers):**

```sql
CREATE TABLE quote_counter (
  id         INTEGER PRIMARY KEY DEFAULT 1,
  counter    INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the initial row
INSERT INTO quote_counter (id, counter) VALUES (1, 0);

-- Create the atomic increment function
CREATE OR REPLACE FUNCTION increment_quote_counter()
RETURNS INTEGER AS $$
DECLARE
  new_val INTEGER;
BEGIN
  UPDATE quote_counter SET counter = counter + 1, updated_at = NOW()
  WHERE id = 1
  RETURNING counter INTO new_val;
  RETURN new_val;
END;
$$ LANGUAGE plpgsql;
```

---

### 2. GHL (GoHighLevel) — Inbound Webhook

**What it does:** Sends lead data as a JSON POST to a GHL Workflow Inbound Webhook trigger. Best for triggering automations (e.g., auto-assign to pipeline, send SMS, start drip campaign).

**Setup:**

```typescript
// In lib/backendconnect.ts
ghlWebhook: {
  enabled: true,                                                          // ← flip to true
  webhookUrl: 'https://services.leadconnectorhq.com/hooks/abc123...',     // ← your webhook URL
},
```

**Where to find your webhook URL:**

1. Go to GHL → **Automations** → create or edit a Workflow
2. Add an **Inbound Webhook** trigger as the first step
3. Copy the webhook URL it generates → paste as `webhookUrl`

> **Note:** The webhook receives ALL lead fields as a flat JSON object. You can map them to GHL custom fields inside the workflow using the "Set Contact Field" action.

---

### 3. GHL (GoHighLevel) — Contacts API

**What it does:** Creates a contact directly in GHL via the REST API. Best when you want contacts to appear immediately in your CRM without a workflow trigger.

**Setup:**

```typescript
// In lib/backendconnect.ts
ghlApi: {
  enabled: true,                           // ← flip to true
  apiKey: 'pit-abc123def456...',           // ← your API key
  locationId: 'loc_abc123...',             // ← your location ID
},
```

**Where to find your credentials:**

1. Go to GHL → **Settings → Business Profile → API Keys**
2. Create or copy an API key → paste as `apiKey`
3. On the same page, find your **Location ID** → paste as `locationId`

> **Webhook vs API — which one?** Use the **Webhook** if you want to trigger workflow automations (drip campaigns, auto-assignments). Use the **API** if you just want contacts created in the CRM. You can enable **both** — they work independently.

---

### 4. Salesforce

**What it does:** Creates a Lead object in Salesforce. Supports two modes:

| Mode | Complexity | Auth Required | Best For |
| --- | --- | --- | --- |
| **Web-to-Lead** | Simple | No (just OID) | Quick setup, no OAuth |
| **REST API** | Advanced | Yes (OAuth token) | Full control, custom objects |

**Setup — Web-to-Lead (simplest):**

```typescript
// In lib/backendconnect.ts
salesforce: {
  enabled: true,                           // ← flip to true
  mode: 'web-to-lead',                     // ← use this mode
  oid: '00D5g000004XXXX',                  // ← your Organization ID
  instanceUrl: '',                          // not needed for web-to-lead
  accessToken: '',                          // not needed for web-to-lead
},
```

**Where to find your OID:**

1. Go to Salesforce → **Setup → Company Settings → Company Information**
2. Copy the **Salesforce.com Organization ID** → paste as `oid`

**Setup — REST API (advanced):**

```typescript
// In lib/backendconnect.ts
salesforce: {
  enabled: true,
  mode: 'rest-api',                                        // ← use this mode
  oid: '',                                                  // not needed for REST
  instanceUrl: 'https://yourinstance.salesforce.com',       // ← your instance URL
  accessToken: 'Bearer 00D5g000...',                        // ← OAuth bearer token
},
```

> **Warning:** REST API mode requires a valid OAuth access token. Tokens expire — you'll need a refresh token flow for production use. Web-to-Lead is simpler and recommended for most setups.

---

## Customizing Field Names

Each backend can use **different field names** for the same data. For example, your Supabase table might have a column called `fname`, while GHL expects `first_name`, and Salesforce expects `FirstName`.

### How to change field names

Open `lib/backendcolumns.ts` and edit the **right side** (value) of any mapping:

```typescript
// BEFORE — default Supabase column names
supabase: {
  fullName:    'full_name',       // ← this is the Supabase column name
  phone:       'phone',
  email:       'email',
  ...
}

// AFTER — customized to match YOUR table
supabase: {
  fullName:    'customer_name',   // ← changed to match your column
  phone:       'phone_number',    // ← changed
  email:       'contact_email',   // ← changed
  ...
}
```

### Rules

| Rule | Example |
| --- | --- |
| **Change the right side** (value) | `fullName: 'my_custom_column'` |
| **Never change the left side** (key) | `fullName` must stay `fullName` |
| **Set to `''` to skip a field** | `unsecuredTotal: ''` → won't be sent to that backend |
| **Each backend is independent** | Supabase can use `fname` while GHL uses `first_name` |

### Available fields

These are all the data fields that flow from the calculator. You can map each one to any backend field name:

| Internal Key | Data Type | What It Contains |
| --- | --- | --- |
| `fullName` | string | Full name entered by user |
| `firstName` | string | Auto-split from fullName |
| `lastName` | string | Auto-split from fullName |
| `phone` | string | Phone number |
| `email` | string | Email address |
| `state` | string | State selected |
| `loanAmount` | number | Debt amount from slider |
| `loanTerm` | number | Selected term (months) |
| `estimatedMonthlyPayment` | number | Calculated monthly payment |
| `estimatedTotalCost` | number | Total cost over loan term |
| `unsecuredTotal` | number | Current unsecured debt total |
| `estimatedSavings` | number | Projected savings amount |
| `smsConsent` | boolean | SMS opt-in checkbox |
| `communicationsConsent` | boolean | Communications consent checkbox |
| `quoteId` | number | Sequential reference number (AFF-000001) |
| `submittedAt` | string | ISO 8601 timestamp |
| `source` | string | `'advantagefirst.com/calculator'` |

---

## Newsletter Subscribers

Newsletter subscriptions flow through the **exact same backend infrastructure** as leads. When someone subscribes from any of the three newsletter forms, data goes to all enabled backends:

| Backend | Where Newsletter Data Goes |
| --- | --- |
| Supabase | `newsletter_subscribers` table (configurable via `newsletterTable`) |
| GHL Webhook | Same webhook URL, payload includes `type: 'newsletter_subscriber'` and `tags: ['newsletter']` |
| GHL API | Creates contact with `tags: ['newsletter_subscriber']` |
| Salesforce | Creates Lead with `LeadSource: 'Newsletter: {source}'` |

The `source` field tells you where the subscription came from:

| Source Value | Form Location |
| --- | --- |
| `blog_preview` | Homepage blog preview section |
| `blog_page` | Blog list page sidebar |
| `blog_article` | Mid-article inline form |

---

## Sequential Quote ID (Evaluation Reference Number)

Every calculator submission gets a **unique, sequential** reference number like `AFF-000001`, `AFF-000002`, etc.

### How it works

| Priority | Storage | Description |
| --- | --- | --- |
| 1st | Supabase `quote_counter` table | Atomic increment via RPC (if Supabase enabled) |
| 2nd | Local `data/quote-counter.json` | Atomic file write (if Supabase unavailable) |
| 3rd | Timestamp fallback | `Date.now() % 1000000` (if both fail) |

**No duplicates are possible** — the file counter uses POSIX atomic rename, and the Supabase counter uses `UPDATE ... RETURNING` with row-level locking.

The `quoteId` is included in the lead data payload sent to all backends, so you'll see it in your Supabase table, GHL contacts, and Salesforce records.

---

## Adding a New Backend

To add a 5th backend (e.g., HubSpot, Zapier, custom webhook):

### Step 1: Add config to `backendconnect.ts`

```typescript
myNewBackend: {
  enabled: false,
  apiKey: '',
  // ... whatever credentials you need
},
```

### Step 2: Add field mapping to `backendcolumns.ts`

```typescript
myNewBackend: {
  fullName:    'name',
  phone:       'phone',
  email:       'email',
  // ... map all fields
},
```

### Step 3: Create adapter in `lib/backends/my-new-backend.ts`

```typescript
import { LeadData, BackendResult } from '../leadTypes';
import { backendConfig } from '../backendconnect';
import { mapLeadToBackend } from '../backendcolumns';

export async function sendToMyNewBackend(lead: LeadData): Promise<BackendResult> {
  const config = backendConfig.myNewBackend;
  const payload = mapLeadToBackend(lead, 'myNewBackend');

  // Your API call here
  const response = await fetch('https://api.example.com/leads', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${config.apiKey}` },
    body: JSON.stringify(payload),
  });

  return { backend: 'myNewBackend', success: response.ok, message: '...' };
}
```

### Step 4: Register in `lib/backends/index.ts`

Add your adapter to both `routeLeadToBackends()` and optionally `routeNewsletterToBackends()`.

---

## Troubleshooting

| Problem | Solution |
| --- | --- |
| Leads aren't showing up in Supabase | Check that `enabled: true` and your `url`/`anonKey` are correct. Also verify your table columns match the field names in `backendcolumns.ts`. |
| GHL webhook isn't firing | Verify the webhook URL is active in your GHL Workflow. The workflow must be **published**, not draft. |
| Salesforce Web-to-Lead fails silently | This is normal — Web-to-Lead returns 200 even on errors. Check Salesforce → Setup → Web-to-Lead → Debug Logs. |
| Field names don't match | Open `backendcolumns.ts` and update the right-side values to match your actual table columns / CRM fields. |
| Quote ID resets after deploy | If using the file counter, `data/quote-counter.json` resets on fresh deploys. Set up the Supabase `quote_counter` table for persistent sequential IDs. |
| Newsletter subs aren't saved | Same setup as leads — if your backends are enabled for leads, they're enabled for newsletters too. Check that the `newsletter_subscribers` table exists in Supabase. |

---

## Environment & Security

> **⚠️ Important:** API keys and connection strings in `backendconnect.ts` are **server-side only**. They never reach the browser. The calculator form POSTs to `/api/submit-lead`, and the API route reads the config server-side. However, do **NOT** commit this file with real credentials. Use environment variables in production.

**Production recommendation:** Move credentials to `.env.local`:

```bash
# .env.local
SUPABASE_URL=https://xyzproject.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/abc123...
GHL_API_KEY=pit-abc123def456...
GHL_LOCATION_ID=loc_abc123...
SALESFORCE_OID=00D5g000004XXXX
```

Then reference them in `backendconnect.ts`:

```typescript
supabase: {
  enabled: true,
  url: process.env.SUPABASE_URL || '',
  anonKey: process.env.SUPABASE_ANON_KEY || '',
  tableName: 'leads',
  newsletterTable: 'newsletter_subscribers',
},
```
