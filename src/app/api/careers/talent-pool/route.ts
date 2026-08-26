/**
 * TALENT NETWORK REGISTRATION API — /api/careers/talent-pool
 * ==========================================================
 * Receives speculative expressions of interest, saves candidate profile
 * to the EntireFM Talent Pool, and records GDPR consent with 2-year retention.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createTalentPoolCandidate } from '@/server/careers/store';
import { TalentInterestArea } from '@/server/careers/types';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const firstName = formData.get('firstName')?.toString().trim();
    const lastName = formData.get('lastName')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const preferredLocation = formData.get('preferredLocation')?.toString().trim();
    const linkedInUrl = formData.get('linkedInUrl')?.toString().trim() || undefined;
    const currentRole = formData.get('currentRole')?.toString().trim() || undefined;
    const currentEmployer = formData.get('currentEmployer')?.toString().trim() || undefined;
    const salaryExpectation = formData.get('salaryExpectation')?.toString().trim() || undefined;
    const availability = formData.get('availability')?.toString().trim() || undefined;
    const introduction = formData.get('introduction')?.toString().trim() || undefined;
    const gdprConsent = formData.get('gdprConsent') === 'true' || formData.get('gdprConsent') === 'on';

    // Parse interest areas
    const interestAreasRaw = formData.getAll('interestAreas');
    const interestAreas: TalentInterestArea[] = interestAreasRaw.map((v) => v.toString() as TalentInterestArea);

    // Validation
    if (!firstName || !lastName || !email || !phone || !preferredLocation) {
      return NextResponse.json(
        { error: 'Please provide all required details (Name, Email, Phone, Preferred Location).' },
        { status: 400 }
      );
    }

    if (interestAreas.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one area of interest.' },
        { status: 400 }
      );
    }

    if (!gdprConsent) {
      return NextResponse.json(
        { error: 'Consent to retain your details in our Talent Network is required.' },
        { status: 400 }
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

      const uploadDir = join(process.cwd(), 'private_storage', 'recruitment');
      await mkdir(uploadDir, { recursive: true });

      const uniqueToken = randomBytes(8).toString('hex');
      const safeStorageName = `talent-${uniqueToken}-${cvFileName}`;
      cvStoragePath = `recruitment/${safeStorageName}`;

      const bytes = await cvFile.arrayBuffer();
      await writeFile(join(uploadDir, safeStorageName), Buffer.from(bytes));
    }

    // Derive auto skills tags from role / intro / interest areas
    const skillsTags = Array.from(
      new Set([
        ...interestAreas,
        ...(currentRole ? [currentRole] : []),
        preferredLocation,
      ])
    );

    const now = new Date();
    const retentionExpiresAt = new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString();

    const candidate = await createTalentPoolCandidate({
      firstName,
      lastName,
      email,
      phone,
      preferredLocation,
      linkedInUrl,
      currentRole,
      currentEmployer,
      interestAreas,
      preferredJobTypes: ['Full-time / Permanent'],
      salaryExpectation,
      availability,
      introduction,
      cvFileName,
      cvStoragePath,
      cvFileSize,
      cvMimeType,
      skillsTags,
      gdprConsent: true,
      consentTimestamp: now.toISOString(),
      retentionExpiresAt,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for registering with the EntireFM Talent Network.',
        candidateId: candidate.id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in talent pool registration:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error processing registration.' },
      { status: 500 }
    );
  }
}
