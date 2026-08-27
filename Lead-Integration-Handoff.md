# Lead Capture Integration — Detailed Handoff

**Project:** Advantage First Financial website (new Next.js site)
**Repository:** hpintojr/advantagefirst
**Date:** August 26, 2026
**Prepared for:** Site owner

## 1. Purpose and Scope

The new website replaces the old site's lead-capture setup. Every lead submitted through the site's calculator/form needs to reach three destinations simultaneously: Salesforce (the CRM used by the sales team), GoHighLevel or "GHL" (used for SMS/marketing follow-up), and Supabase (a database used as the site's own record of every submission). This document covers the work done to get all three connected, tested, and verified against the live, production versions of each system — not a staging or sandbox environment.

The site sends leads to all three backends independently, in parallel. If one backend fails (say, Salesforce is briefly unreachable), the other two still receive the lead — the integrations are not dependent on each other succeeding.

## 2. Salesforce Integration

### 2.1 Background and why it needed rework

The previous site's Apex-based integration authenticated to Salesforce using a Connected App and the OAuth2 "client credentials" flow — the server proves its identity with a client ID and client secret, and Salesforce hands back a temporary access token in return. The new site initially had a placeholder for a single, manually-entered access token, which is a poor long-term setup: Salesforce access tokens expire, and someone would have needed to generate and paste in a new one periodically by hand.

To match how the old site worked and avoid that maintenance burden, the integration was rebuilt to use the same Connected App and the same client-credentials flow, with the site fetching its own token automatically.

### 2.2 How it works now

- The site holds three pieces of Salesforce configuration as environment variables: the instance URL (`https://customer-ruby-1712.my.salesforce.com`), a Client ID, and a Client Secret. These correspond to the existing Connected App already configured on the Salesforce org — nothing new was created on the Salesforce side.
- When a lead needs to be sent, the code (`lib/backends/salesforce.ts`) first requests an access token from Salesforce's OAuth endpoint (`/services/oauth2/token`) using those credentials.
- The returned token is held in memory and reused for about 15 minutes before a fresh one is requested, so the site isn't re-authenticating on every single submission if several come in close together. (Note: because this runs on Vercel's serverless infrastructure, each server instance is fairly short-lived anyway, so this caching is a minor optimization rather than something that needs monitoring.)
- With a valid token in hand, the site sends a POST request to Salesforce's REST API (`/services/data/v59.0/sobjects/Lead/`) to create a new Lead record.
- `LeadSource` is hardcoded to `"Website"` since it's a controlled picklist value on this org (free text isn't accepted there). The literal page URL the lead came from is instead sent to a separate custom field, `Source_URL__c`.
- `Company` defaults to `"Individual"` if not otherwise set, since Salesforce's Lead object requires a Company value and most of these leads are individual consumers, not businesses.

### 2.3 Fields populated on the Salesforce Lead object

| Internal Field | Salesforce API Name | Notes |
|---|---|---|
| First Name | `FirstName` | Split from the full name entered on the form |
| Last Name | `LastName` | Split from the full name entered on the form |
| Phone | `Phone` | |
| Email | `Email` | |
| State | `State` | |
| Loan Amount | `Loan_Amount__c` | Custom field, already existed on the org |
| Loan Term | `Loan_Term__c` | Custom field, already existed on the org |
| Estimated Monthly Payment | `Est_Monthly_Payment__c` | Custom field, already existed on the org |
| Estimated Total Cost | `Est_Total_Cost__c` | Custom field, already existed on the org |
| Unsecured Debt Total | `Total_Estimated_Debt__c` | Reuses an existing field rather than creating a duplicate |
| Estimated Savings | `Est_Savings__c` | Custom field, already existed on the org |
| SMS Consent | `SMS_Consent__c` | Custom field, already existed on the org |
| Communications Consent | `Comms_Consent__c` | Custom field, already existed on the org |
| Quote ID | `Applicant_Reference_ID__c` | Reuses an existing field as the semantic fit for a quote/reference number |
| Source URL | `Source_URL__c` | The full calculator URL the lead was submitted from |
| Lead Source | `LeadSource` | Hardcoded to `"Website"` (controlled picklist) |
| Company | `Company` | Defaults to `"Individual"` if not set |

`Name` (a read-only compound field on Lead) and `submittedAt` are intentionally not sent — `Name` is derived automatically from First/Last Name, and `CreatedDate` already captures submission timing without needing a duplicate field.

### 2.4 What was verified live

- Successfully authenticated against the real Connected App and received a valid access token (confirmed token type, scope, and length in the response).
- Confirmed the Lead object and every custom field listed above exists on the live org and is createable via the API — none of this was assumed from documentation, it was checked directly against the org.

## 3. GoHighLevel (GHL) Integration

### 3.1 Background

GHL was already partially wired up from earlier work, using GHL's Contacts API with a Private Integration Token. The account in question is the "Loan Streamline Pro" location (Location ID `oY7nDZUrZG0KegzadZgI`). Every lead is tagged `sms-web-purl-aff` on creation so the marketing/SMS side can filter for these leads specifically.

An earlier audit of the code found that it was already mapping several fields (loan amount, loan term, estimated payment, estimated total cost, unsecured total, estimated savings, SMS consent, quote ID, submitted-at) to GHL custom field keys that did not actually exist in the GHL location — they had been assumed rather than confirmed. Only one related field, "Debt Amount," genuinely existed. Sending unmapped fields wasn't causing failures (GHL just wouldn't store data for fields it doesn't recognize), but it meant that data the sales/marketing team expected to see in GHL was silently going nowhere.

### 3.2 What was done

Nine new custom fields were created directly in the GHL location (Settings → Custom Fields → Contact object → "Additional Info" folder), matching what the site's calculator actually collects:

- Loan Amount
- Loan Term
- Est Monthly Payment
- Est Total Cost
- Est Savings
- SMS Consent
- Communications Consent
- Quote ID
- Submitted At

All nine were created as "Single line" text fields. (Field type in GHL doesn't restrict what the Contacts API can write to a field — a value sent to a "Single line" field is stored the same way it would be for a more specific type like "Monetary" — so this was the simplest, most reliable choice and avoids any type-mismatch issues with the values the calculator produces.)

After creation, the real field keys were pulled directly from GHL's API (rather than assumed from naming convention) to make sure the code maps to exactly what GHL actually generated:

| Field Name | GHL Field Key |
|---|---|
| Loan Amount | `contact.loan_amount` |
| Loan Term | `contact.loan_term` |
| Est Monthly Payment | `contact.est_monthly_payment` |
| Est Total Cost | `contact.est_total_cost` |
| Est Savings | `contact.est_savings` |
| SMS Consent | `contact.sms_consent` |
| Communications Consent | `contact.communications_consent` |
| Quote ID | `contact.quote_id` |
| Submitted At | `contact.submitted_at` |
| Debt Amount (pre-existing) | `contact.debt_amount` |

The code (`lib/backendcolumns.ts` and `lib/backends/ghl-api.ts`) was then updated to map every one of these fields to its real key, and to actually include Communications Consent in the payload sent to GHL (it had been mapped in the shared field list but was missing from the code that builds the actual API request — that gap was closed as part of this work).

### 3.3 Fields sent to GHL on contact creation

| Internal Field | GHL Field | Notes |
|---|---|---|
| First Name | `firstName` | Native contact field |
| Last Name | `lastName` | Native contact field |
| Phone | `phone` | Native contact field |
| Email | `email` | Native contact field |
| State | `state` | Native contact field |
| Loan Amount | Custom: Loan Amount | |
| Loan Term | Custom: Loan Term | |
| Estimated Monthly Payment | Custom: Est Monthly Payment | |
| Estimated Total Cost | Custom: Est Total Cost | |
| Unsecured Debt Total | Custom: Debt Amount | Reuses pre-existing field |
| Estimated Savings | Custom: Est Savings | |
| SMS Consent | Custom: SMS Consent | Sent as "Yes"/"No" |
| Communications Consent | Custom: Communications Consent | Sent as "Yes"/"No" |
| Quote ID | Custom: Quote ID | |
| Submitted At | Custom: Submitted At | |
| Source | `source` | Native contact field |
| Tag | `sms-web-purl-aff` | Applied to every contact created |

### 3.4 What was verified live

- Confirmed via GHL's own custom-fields API (not assumed) that all 10 fields above exist on the live "Loan Streamline Pro" location, with the exact keys listed.
- All field creation was done directly in the live GHL account through the browser, not a sandbox.

## 4. Supabase Integration

### 4.1 Background

Supabase serves as the site's own internal record of every lead, independent of Salesforce or GHL. It was already partially built out; the main piece of remaining work was making sure duplicate submissions from the same person don't create duplicate rows.

### 4.2 How it works

- The site connects to a Supabase project (`oyaulgwfbmlvycjudvyp`) using its REST API (PostgREST) and a "publishable key," which is Supabase's modern equivalent of the legacy anon key and behaves the same way for this purpose.
- Submissions use an "upsert" — insert-or-update — keyed on the `email` column. If a row with that email already exists, its data is updated with the newest submission; if not, a new row is inserted. This is implemented via PostgREST's `?on_conflict=email` parameter with `Prefer: resolution=merge-duplicates`.
- Practically, this means someone filling out the calculator a second time (say, updating their loan amount) updates their existing record instead of creating a second, conflicting one.

### 4.3 Fields stored in the `leads` table

| Internal Field | Supabase Column |
|---|---|
| Full Name | `full_name` |
| First Name | `first_name` |
| Last Name | `last_name` |
| Phone | `phone` |
| Email | `email` (upsert key) |
| State | `state` |
| Loan Amount | `loan_amount` |
| Loan Term | `loan_term` |
| Estimated Monthly Payment | `estimated_monthly_payment` |
| Estimated Total Cost | `estimated_total_cost` |
| Unsecured Debt Total | `unsecured_total` |
| Estimated Savings | `estimated_savings` |
| SMS Consent | `sms_consent` |
| Communications Consent | `communications_consent` |
| Quote ID | `quote_id` |
| Submitted At | `submitted_at` |
| Source | `source` |

### 4.4 What was verified live

- Confirmed the `leads` table exists in the production Supabase project and that every column above is present and queryable — checked directly against the live database, not assumed from a schema file.

## 5. Where the Configuration Lives

All credentials (Salesforce Client ID/Secret and instance URL, GHL API key and Location ID, Supabase URL and key) are stored as environment variables on the hosting platform, not hardcoded in the source code, and `.env.local` (where these are set locally for development) is excluded from version control via `.gitignore`. This means the secrets themselves are never committed to GitHub.

For reference, the environment variable names involved are:

- `SALESFORCE_INSTANCE_URL`, `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET`
- `GHL_API_KEY`, `GHL_LOCATION_ID`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`

(Actual values are intentionally not included in this document — they're set in the environment configuration directly.)

## 6. Code Changes Summary

For anyone technical reviewing this later, the main files touched:

- `lib/backends/salesforce.ts` — rebuilt to authenticate via OAuth2 client-credentials flow with in-memory token caching, replacing the old static-token approach.
- `lib/backendconnect.ts` — Salesforce config switched from a single `accessToken` field to `clientId`/`clientSecret`.
- `lib/backendcolumns.ts` — central field-mapping file for all three backends; GHL section updated with the real field keys for all 9 new fields plus the pre-existing Debt Amount field.
- `lib/backends/ghl-api.ts` — added the missing Communications Consent field to the payload sent to GHL.
- `.env.local` / `.env.example` — updated to reflect the new Salesforce variables and document the Supabase variables.

This single-file mapping approach (`lib/backendcolumns.ts`) means that if any field name ever changes on the Salesforce, GHL, or Supabase side in the future, it can be updated in one place without touching the integration logic for any of the three systems.

## 7. Verification Performed

Every claim of "this works" above was checked directly against the live, production account for that system — not assumed from documentation or code review alone:

- Salesforce: live OAuth token exchange succeeded; Lead object and all custom fields confirmed to exist and be writable.
- GHL: all 10 relevant custom fields confirmed to exist via GHL's own API, with exact field keys pulled directly (not guessed).
- Supabase: `leads` table and every mapped column confirmed to exist via a live query against the production database.

## 8. Outstanding / Recommended Next Step

The one thing not yet done is a full end-to-end test: submitting a real lead through the actual calculator on the live site and confirming it lands correctly in all three systems at once. This was intentionally not done as part of this work because it would create permanent, real records in production Salesforce, GHL, and Supabase — not test data. Recommend running one real test submission at a convenient time (ideally using a real name/email/phone that's easy to identify and clean up afterward) to confirm the complete chain works end to end.
