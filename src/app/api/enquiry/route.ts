/**
 * ENQUIRY SUBMISSION API ENDPOINT — /api/enquiry
 * ===============================================
 * Real server-side lead ingestion pipeline with validation,
 * session attribution capture, and persistence.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const EnquirySchema = z.object({
  name: z.string().min(2, 'Full name is required (min 2 characters)'),
  email: z.string().email('A valid email address is required'),
  phone: z.string().optional().default(''),
  company: z.string().optional().default(''),
  service: z.string().optional().default('General Facilities Management'),
  location: z.string().optional().default('National / UK Wide'),
  message: z.string().min(5, 'Message must contain at least 5 characters'),
  
  // Lead Attribution Metadata
  landing_page: z.string().optional().default(''),
  conversion_page: z.string().optional().default(''),
  page_type: z.string().optional().default(''),
  utm_source: z.string().optional().default(''),
  utm_medium: z.string().optional().default(''),
  utm_campaign: z.string().optional().default(''),
  utm_term: z.string().optional().default(''),
  utm_content: z.string().optional().default(''),
  referrer: z.string().optional().default(''),
  timestamp: z.string().optional().default(() => new Date().toISOString()),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = EnquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
          message: 'Validation failed. Please check required fields.',
        },
        { status: 400 }
      );
    }

    const data = result.data;
    const enquiryId = `EFM-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const leadRecord = {
      enquiryId,
      receivedAt: new Date().toISOString(),
      ...data,
    };

    // Persist lead locally in runtime data log if directory available
    try {
      const dataDir = path.join(process.cwd(), '.runtime-leads');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.appendFileSync(
        path.join(dataDir, 'enquiries.jsonl'),
        JSON.stringify(leadRecord) + '\n'
      );
    } catch {
      // In read-only serverless edge environments, log to stdout
      console.log('[LEAD INGESTION]', JSON.stringify(leadRecord));
    }

    return NextResponse.json(
      {
        success: true,
        enquiryId,
        message: 'Your proposal request has been received by our commercial desk.',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process enquiry: ' + message,
      },
      { status: 500 }
    );
  }
}
