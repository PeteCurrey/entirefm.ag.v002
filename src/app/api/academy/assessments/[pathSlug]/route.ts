import { NextResponse } from 'next/server';
import { getPathBySlug, getSanitizedAssessment } from '@/server/academy/academy-store';

/**
 * GET /api/academy/assessments/[pathSlug]
 * ========================================
 * Returns the sanitized assessment questions for a learning path.
 * Guarantees correctOptionId and explanations are omitted.
 */
export async function GET(
  request: Request,
  props: { params: Promise<{ pathSlug: string }> }
) {
  try {
    const { pathSlug } = await props.params;

    const path = await getPathBySlug(pathSlug);
    if (!path) {
      return NextResponse.json(
        { error: `Learning Path '${pathSlug}' not found.` },
        { status: 404 }
      );
    }

    const sanitized = await getSanitizedAssessment(path.id);
    if (!sanitized) {
      return NextResponse.json(
        { error: 'Assessment not found for this learning path.' },
        { status: 404 }
      );
    }

    return NextResponse.json(sanitized);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch assessment.' },
      { status: 500 }
    );
  }
}
