import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveLead } from '@/lib/leads/store';
import { CONTACT_CONFIG } from '@/config/contact';

const CareerApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(7, 'Valid telephone number is required'),
  vacancyRef: z.string().default('SPECULATIVE'),
  roleTitle: z.string().default('Speculative Application'),
  location: z.string().optional().default('UK Wide'),
  tradeDiscipline: z.string().optional().default('General Engineering'),
  experienceYears: z.string().optional().default(''),
  qualifications: z.string().optional().default(''),
  coverNote: z.string().optional().default(''),
  cvFileName: z.string().optional().default(''),
  cvBase64: z.string().optional().default(''),
  privacyConsent: z.boolean().refine((val) => val === true, 'You must agree to the privacy policy'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CareerApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors, message: 'Validation failed' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Store application durably in database
    await saveLead({
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      company: 'Career Applicant',
      service: `Careers: ${data.roleTitle} (${data.vacancyRef})`,
      location: data.location,
      message: `Qualifications: ${data.qualifications || 'N/A'}\nExperience: ${data.experienceYears || 'N/A'}\nNotes: ${data.coverNote || 'None'}\nCV File: ${data.cvFileName || 'Uploaded via Portal'}`,
      conversion_page: '/job-board',
      form_id: 'careers-application-form',
      enquiryId: applicationId,
    });

    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Application successfully received. Our recruitment team will review your qualifications and contact you.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
