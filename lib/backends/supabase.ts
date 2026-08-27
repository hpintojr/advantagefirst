/**
 * Supabase Backend Adapter
 * Upserts lead data into a Supabase table using mapped column names:
 * updates the existing row if a lead with the same email already
 * exists, otherwise inserts a new row.
 *
 * Requires a UNIQUE constraint on the `email` column of the leads
 * table — PostgREST's on_conflict upsert can't work without one:
 *
 *   ALTER TABLE leads ADD CONSTRAINT leads_email_unique UNIQUE (email);
 */

import { LeadData, BackendResult } from '../leadTypes';
import { backendConfig } from '../backendconnect';
import { mapLeadToBackend } from '../backendcolumns';

export async function sendToSupabase(lead: LeadData): Promise<BackendResult> {
  const config = backendConfig.supabase;
  const payload = mapLeadToBackend(lead, 'supabase');

  try {
    const response = await fetch(`${config.url}/rest/v1/${config.tableName}?on_conflict=email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`,
        // merge-duplicates: update the existing row's columns on a
        // conflicting `email` instead of erroring or skipping it.
        'Prefer': 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { backend: 'supabase', success: false, message: `HTTP ${response.status}: ${errorText}` };
    }

    return { backend: 'supabase', success: true, message: 'Lead upserted into Supabase (created or updated by email)' };
  } catch (error) {
    return { backend: 'supabase', success: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}
