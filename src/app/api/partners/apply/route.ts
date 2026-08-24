import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveLead } from '@/lib/leads/store';

const PartnerApplicationSchema = z.object({
  partnerType: z.string().min(2, 'Partner category is required'),
  companyName: z.string().min(2, 'Company legal name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  contactEmail: z.string().email('Valid business email is required'),
  contactPhone: z.string().min(7, 'Valid telephone number is required'),
  websiteUrl: z.string().optional().default(''),
  portfolioOverview: z.string().min(5, 'Brief portfolio / client description is required'),
  estimatedManagedSqFt: z.string().optional().default(''),
  geographicFocus: z.string().optional().default('National / UK Wide'),
  primaryInterests: z.array(z.string()).min(1, 'Please select at least one collaboration area'),
  notes: z.string().optional().default(''),
  consent: z.boolean().refine((v) => v === true, 'You must agree to the partner communication terms'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = PartnerApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors, message: 'Validation failed' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const partnerId = `PRT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Store partner application durably
    await saveLead({
      name: data.contactName,
      email: data.contactEmail,
      phone: data.contactPhone,
      company: data.companyName,
      service: `Partner Network: ${data.partnerType} (${data.primaryInterests.join(', ')})`,
      location: data.geographicFocus,
      message: `Partner Type: ${data.partnerType}\nCompany: ${data.companyName} (${data.websiteUrl || 'No website'})\nPortfolio / Focus: ${data.portfolioOverview}\nEstimated Scope: ${data.estimatedManagedSqFt || 'N/A'}\nAreas of Collaboration: ${data.primaryInterests.join(', ')}\nNotes: ${data.notes || 'None'}`,
      conversion_page: '/partner-network',
      form_id: 'partner-network-form',
      enquiryId: partnerId,
    });

    return NextResponse.json({
      success: true,
      partnerId,
      message: 'Partner enquiry received. Our commercial partnerships team will review your portfolio details and arrange an introductory consultation.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
