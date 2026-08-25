import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveLead } from '@/lib/leads/store';

const SupplierApplicationSchema = z.object({
  companyName: z.string().min(2, 'Company legal name is required'),
  tradingName: z.string().optional().default(''),
  websiteUrl: z.string().optional().default(''),
  companyNumber: z.string().optional().default(''),
  yearEstablished: z.string().optional().default(''),
  employeeCount: z.string().optional().default(''),
  businessType: z.string().min(2, 'Business type is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  contactEmail: z.string().email('Valid business email address is required'),
  contactPhone: z.string().min(7, 'Valid telephone number is required'),
  registeredAddress: z.string().min(5, 'Registered business address is required'),
  coverageTier: z.enum(['LOCAL', 'REGIONAL', 'NATIONAL']).default('REGIONAL'),
  geographicCoverage: z.string().min(2, 'Primary operational regions are required'),
  primaryTrades: z.array(z.string()).min(1, 'Please select at least one service category or trade discipline'),
  publicLiabilityCover: z.string().min(1, 'Public liability cover amount is required'),
  employersLiabilityCover: z.string().optional().default(''),
  professionalIndemnityCover: z.string().optional().default(''),
  ssipAccreditations: z.array(z.string()).optional().default([]),
  accreditationNumbers: z.record(z.string(), z.string()).optional().default({}),
  tradeCertifications: z.string().optional().default(''),
  additionalNotes: z.string().optional().default(''),
  complianceDeclaration: z.boolean().refine((v) => v === true, 'You must confirm compliance standards declaration'),
  privacyConsent: z.boolean().refine((v) => v === true, 'You must accept the privacy notice'),
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

    // Format structured accreditations
    const formattedAccreditations = data.ssipAccreditations.map((a) => {
      const num = data.accreditationNumbers[a];
      return num ? `${a} (Scheme #: ${num})` : a;
    });

    // Structure summary message for admin review
    const message = [
      `[SUPPLIER APPLICATION — PHASE 1 QUALIFICATION]`,
      `Application ID: ${applicationId}`,
      `Company Legal Name: ${data.companyName}`,
      data.tradingName ? `Trading Name: ${data.tradingName}` : null,
      data.websiteUrl ? `Website: ${data.websiteUrl}` : null,
      data.companyNumber ? `Companies House / Reg: ${data.companyNumber}` : null,
      data.yearEstablished ? `Year Established: ${data.yearEstablished}` : null,
      data.employeeCount ? `Employees: ${data.employeeCount}` : null,
      `Business Type: ${data.businessType}`,
      `Primary Contact: ${data.contactName} (${data.contactEmail} / ${data.contactPhone})`,
      `Address: ${data.registeredAddress}`,
      `Coverage Scope: ${data.coverageTier} — ${data.geographicCoverage}`,
      `Disciplines / Services: ${data.primaryTrades.join(', ')}`,
      `Public Liability: ${data.publicLiabilityCover}`,
      data.employersLiabilityCover ? `Employers Liability: ${data.employersLiabilityCover}` : null,
      data.professionalIndemnityCover ? `Professional Indemnity: ${data.professionalIndemnityCover}` : null,
      formattedAccreditations.length > 0 ? `Accreditations & Scheme Numbers:\n  • ${formattedAccreditations.join('\n  • ')}` : null,
      data.tradeCertifications ? `Legacy Trade Certifications: ${data.tradeCertifications}` : null,
      data.additionalNotes ? `\nApplicant Statement / Notes:\n${data.additionalNotes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    // Store supplier application durably with distinct status and tagging
    await saveLead({
      enquiryId: applicationId,
      name: data.contactName,
      email: data.contactEmail,
      phone: data.contactPhone,
      company: data.companyName,
      service: `Supplier Application: ${data.businessType} · ${data.primaryTrades.slice(0, 3).join(', ')}${data.primaryTrades.length > 3 ? ' +' + (data.primaryTrades.length - 3) : ''}`,
      location: data.geographicCoverage,
      message,
      landing_page: '/suppliers',
      conversion_page: '/suppliers/apply',
      page_type: 'supplier-application',
      form_id: 'supplier-application-form',
      lead_priority: 'HIGH',
      sector_interest: data.businessType,
      location_interest: data.geographicCoverage,
    });

    return NextResponse.json({
      success: true,
      applicationId,
      status: 'APPLICATION',
      message: 'Supplier application received. Our supply chain governance and compliance team will review your application against our Assurance Framework.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
