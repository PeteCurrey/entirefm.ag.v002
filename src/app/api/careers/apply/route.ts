/**
 * PUBLIC CAREERS APPLICATION API — /api/careers/apply
 * ===================================================
 * Receives direct job applications with CV attachment, validates inputs and file safety,
 * persists application against the vacancy, and returns confirmation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createApplication, getVacancyById } from '@/server/careers/store';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';

import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/server/security/rate-limiter';
import { checkHoneypot, HONEYPOT_FIELD_NAME } from '@/server/security/honeypot';
import { checkEmailDomain } from '@/server/security/disposable-email';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // 1. Rate limiting
    const rateCheck = checkRateLimit(`careers-apply:${clientIp}`, RATE_LIMITS.CAREER_APPLY);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many job applications from your connection. Please wait.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();

    // 2. Honeypot check
    const honeypot = checkHoneypot(formData.get(HONEYPOT_FIELD_NAME));
    if (honeypot.triggered) {
      return NextResponse.json({ success: true, message: 'Application received.' });
    }

    const vacancyId = formData.get('vacancyId')?.toString();
    const firstName = formData.get('firstName')?.toString().trim();
    const lastName = formData.get('lastName')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const location = formData.get('location')?.toString().trim();
    const linkedInUrl = formData.get('linkedInUrl')?.toString().trim() || undefined;
    const currentEmployer = formData.get('currentEmployer')?.toString().trim() || undefined;
    const currentRole = formData.get('currentRole')?.toString().trim() || undefined;
    const supportingStatement = formData.get('supportingStatement')?.toString().trim() || undefined;
    const gdprConsent = formData.get('gdprConsent') === 'true' || formData.get('gdprConsent') === 'on';

    // Validation
    if (!vacancyId || !firstName || !lastName || !email || !phone || !location) {
      return NextResponse.json(
        { error: 'Please complete all required fields (Name, Email, Phone, Location).' },
        { status: 400 }
      );
    }

    // 3. Disposable email check
    const domainCheck = checkEmailDomain(email);
    if (domainCheck.isDisposable) {
      return NextResponse.json(
        { error: 'Please provide a valid personal or permanent email address.' },
        { status: 400 }
      );
    }

    if (!gdprConsent) {
      return NextResponse.json(
        { error: 'Recruitment data consent is required to process your application.' },
        { status: 400 }
      );
    }

    const vacancy = await getVacancyById(vacancyId);
    if (!vacancy) {
      return NextResponse.json(
        { error: 'The selected vacancy is no longer available.' },
        { status: 404 }
      );
    }

    // File upload handling
    const cvFile = formData.get('cv') as File | null;
    let cvFileName: string | undefined;
    let cvStoragePath: string | undefined;
    let cvFileSize: number | undefined;
    let cvMimeType: string | undefined;

    if (cvFile && cvFile.size > 0) {
      if (cvFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'CV file exceeds the 10MB size limit.' },
          { status: 400 }
        );
      }

      const mime = cvFile.type || 'application/octet-stream';
      if (!ALLOWED_MIME_TYPES.includes(mime) && !cvFile.name.match(/\.(pdf|doc|docx)$/i)) {
        return NextResponse.json(
          { error: 'Invalid CV file format. Please upload a PDF, DOC, or DOCX document.' },
          { status: 400 }
        );
      }

      cvFileName = cvFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      cvFileSize = cvFile.size;
      cvMimeType = mime;

      // Save to private local storage directory
      const uploadDir = join(process.cwd(), 'private_storage', 'recruitment');
      await mkdir(uploadDir, { recursive: true });

      const uniqueToken = randomBytes(8).toString('hex');
      const safeStorageName = `cv-${uniqueToken}-${cvFileName}`;
      cvStoragePath = `recruitment/${safeStorageName}`;

      const bytes = await cvFile.arrayBuffer();
      await writeFile(join(uploadDir, safeStorageName), Buffer.from(bytes));
    }

    // Create application record
    const application = await createApplication({
      vacancyId: vacancy.id,
      vacancyTitle: vacancy.title,
      vacancySlug: vacancy.slug,
      vacancyDepartment: vacancy.department,
      firstName,
      lastName,
      email,
      phone,
      location,
      linkedInUrl,
      currentEmployer,
      currentRole,
      supportingStatement,
      cvFileName,
      cvStoragePath,
      cvFileSize,
      cvMimeType,
      gdprConsent: true,
      consentTimestamp: new Date().toISOString(),
      retentionBasis: 'Job Application — Active Candidacy',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your application has been received successfully.',
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error processing job application:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error processing application.' },
      { status: 500 }
    );
  }
}
