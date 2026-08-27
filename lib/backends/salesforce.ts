/**
 * Salesforce Backend Adapter
 * Supports Web-to-Lead and REST API modes using mapped field names.
 *
 * REST API mode authenticates via the OAuth2 client_credentials flow
 * (same Connected App the old site's Apex integration used) instead
 * of a static bearer token. The token is cached in memory and only
 * re-fetched once it's within 60s of expiring.
 */

import { LeadData, BackendResult } from '../leadTypes';
import { backendConfig } from '../backendconnect';
import { mapLeadToBackend } from '../backendcolumns';

export async function sendToSalesforce(lead: LeadData): Promise<BackendResult> {
  const config = backendConfig.salesforce;

  if (config.mode === 'web-to-lead') {
    return sendWebToLead(lead, config.oid);
  } else {
    return sendRestApi(lead, config.instanceUrl, config.clientId, config.clientSecret);
  }
}

// ──────────────────────────────────────────────────────────────
//  In-memory access token cache for the client_credentials flow.
//  Serverless instances are short-lived, so this mainly helps when a
//  single instance handles multiple submissions back to back.
// ──────────────────────────────────────────────────────────────
let cachedToken: { accessToken: string; instanceUrl: string; expiresAt: number } | null = null;

export async function getAccessToken(instanceUrl: string, clientId: string, clientSecret: string): Promise<{ accessToken: string; instanceUrl: string }> {
  const now = Date.now();
  if (cachedToken && now < cachedToken.expiresAt - 60_000) {
    return { accessToken: cachedToken.accessToken, instanceUrl: cachedToken.instanceUrl };
  }

  const authParams = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const authResponse = await fetch(`${instanceUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: authParams.toString(),
  });

  if (!authResponse.ok) {
    const errorText = await authResponse.text();
    throw new Error(`Salesforce OAuth failed: HTTP ${authResponse.status}: ${errorText}`);
  }

  const authData = await authResponse.json();
  // Salesforce doesn't return expires_in for client_credentials — assume
  // a conservative 15 minutes so we re-auth well before any real expiry.
  cachedToken = {
    accessToken: authData.access_token,
    instanceUrl: authData.instance_url || instanceUrl,
    expiresAt: now + 15 * 60_000,
  };

  return { accessToken: cachedToken.accessToken, instanceUrl: cachedToken.instanceUrl };
}

/**
 * Salesforce Web-to-Lead
 * Uses mapped field names for the form submission.
 */
async function sendWebToLead(lead: LeadData, oid: string): Promise<BackendResult> {
  const mapped = mapLeadToBackend(lead, 'salesforce');

  try {
    // Web-to-Lead uses URL-encoded form data
    const formBody = new URLSearchParams();
    formBody.set('oid', oid);
    formBody.set('retURL', 'https://advantagefirst.com');

    for (const [key, value] of Object.entries(mapped)) {
      if (value !== undefined && value !== null) {
        formBody.set(key, String(value));
      }
    }

    const response = await fetch('https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });

    return { backend: 'salesforce-w2l', success: true, message: 'Lead submitted via Salesforce Web-to-Lead' };
  } catch (error) {
    return { backend: 'salesforce-w2l', success: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

/**
 * Salesforce REST API
 * Uses mapped field names for the Lead object. Authenticates via the
 * Connected App's client_credentials flow (see getAccessToken above).
 */
async function sendRestApi(lead: LeadData, instanceUrl: string, clientId: string, clientSecret: string): Promise<BackendResult> {
  const mapped = mapLeadToBackend(lead, 'salesforce');

  // REST API requires Company field on Lead
  if (!mapped['Company']) {
    mapped['Company'] = 'Individual';
  }

  // LeadSource on this org is an unrestricted picklist (accepts values
  // outside the predefined list). Leads from this calculator webform
  // are tagged 'Website-AFF' specifically so they're distinguishable
  // from other 'Website' sources. The raw calculator URL still goes to
  // Source_URL__c (see backendcolumns.ts).
  mapped['LeadSource'] = 'Website-AFF';

  try {
    const { accessToken, instanceUrl: authedInstanceUrl } = await getAccessToken(instanceUrl, clientId, clientSecret);

    const response = await fetch(`${authedInstanceUrl}/services/data/v59.0/sobjects/Lead/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(mapped),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { backend: 'salesforce-api', success: false, message: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    return { backend: 'salesforce-api', success: true, message: 'Lead created in Salesforce', data };
  } catch (error) {
    return { backend: 'salesforce-api', success: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}
