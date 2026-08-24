import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveLead } from '@/lib/leads/store';

const SupplierApplicationSchema = z.object({
  companyName: z.string().min(2, 'Company legal name is required'),
  tradingName: z.string().optional().default(''),
  companyNumber: z.string().optional().default(''),
  contactName: z.string().min(2, 'Contact name is required'),
  contactEmail: z.string().email('Valid email address is required'),
  contactPhone: z.string().min(7, 'Valid telephone number is required'),
  registeredAddress: z.string().min(5, 'Registered business address is required'),
  geographicCoverage: z.string().min(2, 'Primary operational regions are required'),
  primaryTrades: z.array(z.string()).min(1, 'Please select at least one trade discipline'),
  publicLiabilityCover: z.string().min(1, 'Public liability cover amount is required'),
  employersLiabilityCover: z.string().optional().default(''),
  ssipAccreditations: z.array(z.string()).optional().default([]),
  tradeCertifications: z.string().optional().default(''),
  additionalNotes: z.string().optional().default(''),
  documentCount: z.number().optional().default(0),
  complianceDeclaration: z.boolean().refine((v) => v === true, 'You must confirm compliance standards declaration'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SupplierApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors, message: 'Validation failed' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const applicationId = `SUP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Store supplier application durably
    await saveLead({
      name: data.contactName,
      email: data.contactEmail,
      phone: data.contactPhone,
      company: data.companyName,
      service: `Supplier Onboarding: ${data.primaryTrades.join(', ')}`,
      location: data.geographicCoverage,
      message: `Company: ${data.companyName} (${data.companyNumber || 'N/A'})\nTrades: ${data.primaryTrades.join(', ')}\nCoverage: ${data.geographicCoverage}\nPL Insurance: ${data.publicLiabilityCover}\nAccreditations: ${data.ssipAccreditations.join(', ') || 'None stated'}\nNotes: ${data.additionalNotes || 'None'}`,
      conversion_page: '/fm-supply-form',
      form_id: 'supplier-onboarding-form',
      enquiryId: applicationId,
    });

    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Supplier registration received. Our procurement and compliance compliance desk will begin due diligence review.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
