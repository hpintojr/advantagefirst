import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Authenticate with Salesforce
    const authParams = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SALESFORCE_CLIENT_ID!,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET!
    });

    const authResponse = await fetch('https://customer-ruby-1712.my.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: authParams.toString(),
    });

    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with Salesforce');
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // 2. Format the Lead Payload
    const leadPayload = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      mobilePhone: body.phone,
      applicantDOB: body.dob,
      loanAmount: body.debtValue,
      leadSource: "Website",
      // If Lead Owner is a custom field or standard field, map it here. 
      // Typically, assignment rules handle this, but passing it explicitly if required:
      OwnerId: "Web Inbound Leads", // Note: Salesforce usually requires an 18-character ID for OwnerId. Ensure your endpoint accepts text mapping for this.
    };

    // 3. Submit Lead to Salesforce
    const leadResponse = await fetch('https://customer-ruby-1712.my.salesforce.com/services/apexrest/api/leads/Website', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadPayload)
    });

    if (!leadResponse.ok) {
      throw new Error('Failed to create lead in Salesforce');
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Lead Submission Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}