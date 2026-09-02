import { NextResponse } from 'next/server';
import { getPublicCertification } from '@/server/academy/academy-store';

/**
 * GET /api/academy/verify/[publicCertId]
 * =======================================
 * Public unauthenticated badge verification endpoint.
 * Returns ONLY verified credential metadata: recipientName, title, targetRole, issueDate.
 * Rejects invalid, forged, or unpassed certificates.
 */
export async function GET(
  request: Request,
  props: { params: Promise<{ publicCertId: string }> }
) {
  try {
    const { publicCertId } = await props.params;

    const cert = await getPublicCertification(publicCertId);
    if (!cert || !cert.isValid) {
      return NextResponse.json(
        {
          error: 'Certificate Not Found',
          message: 'The requested credential ID is invalid, unverified, or does not exist.',
          isValid: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(cert);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Verification lookup failed.' },
      { status: 500 }
    );
  }
}
