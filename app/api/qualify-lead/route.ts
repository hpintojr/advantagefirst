/**
 * POST /api/qualify-lead
 *
 * Receives the qualification form submission from adv1st.app/{unique_id},
 * validates it, and fans it out:
 *   • Supabase — UPDATE lead row by unique_id (source of truth)
 *   • GHL — inbound webhook (workflow tags "qualified", advances pipeline)
 * Salesforce / CallTools receive the update via the existing
 * Supabase → SF/CallTools sync keyed on unique_id.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  isValidUniqueId,
  routeQualifiedLeadToBackends,
  QualificationSubmission,
} from '@/lib/qualification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.uniqueId || !isValidUniqueId(String(body.uniqueId))) {
      return NextResponse.json(
        { success: false, message: 'Invalid request.' },
        { status: 400 }
      );
    }

    const required = [
      'phone',
      'email',
      'loanPurpose',
      'loanAmount',
      'rentOrOwn',
      'timeAtResidency',
      'annualIncome',
      'employmentStatus',
      'addressLine1',
      'city',
      'state',
      'zipCode',
    ];
    const missing = required.filter((f) => !body[f] && body[f] !== 0);
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : request.headers.get('x-real-ip') || '';

    const submission: QualificationSubmission = {
      uniqueId: String(body.uniqueId),
      phone: String(body.phone),
      email: String(body.email),
      loanPurpose: String(body.loanPurpose),
      loanAmount: Number(body.loanAmount) || 0,
      rentOrOwn: String(body.rentOrOwn),
      monthlyRent: Number(body.monthlyRent) || 0,
      timeAtResidency: String(body.timeAtResidency),
      annualIncome: Number(body.annualIncome) || 0,
      employmentStatus: String(body.employmentStatus),
      employerName: String(body.employerName || ''),
      payFrequency: String(body.payFrequency || ''),
      timeEmployed: String(body.timeEmployed || ''),
      addressLine1: String(body.addressLine1),
      addressLine2: String(body.addressLine2 || ''),
      city: String(body.city),
      state: String(body.state),
      zipCode: String(body.zipCode),
      ipAddress,
    };

    const results = await routeQualifiedLeadToBackends(submission);
    const anySuccess = results.some((r) => r.success);

    return NextResponse.json(
      { success: anySuccess, results },
      { status: anySuccess ? 200 : 502 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Server error: ${error instanceof Error ? error.message : 'Unknown'}`,
      },
      { status: 500 }
    );
  }
}
