/**
 * SECURE PROPERTY SEARCH API — /api/properties/search
 * ==============================================================================
 * Authenticated, tenancy-isolated predictive search endpoint for Log a Job.
 *
 * Security Guarantees:
 * 1. Authentication Mandatory: Rejects unauthenticated requests with 401.
 * 2. Contractor/Supplier Isolation: Rejects contractor discovery with 403.
 * 3. Server-Side Scoping: Queries strictly within user's authorized scope.
 * 4. Safe Response Projection: Returns only { id, name, postcode? }.
 *    NEVER exposes client names, account IDs, internal IDs, or other tenant data.
 * 5. Anti-Oracle: Zero matching results in scope returns 200 with empty array,
 *    never leaking whether an unauthorized property exists.
 * 6. Hard Limit Clamping: Server enforces maximum result limit (max 25).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import {
  canSearchProperties,
  searchAuthorisedProperties,
} from '@/server/identity/property-authorisation';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Mandatory authentication
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Authentication required.',
          },
        },
        { status: 401 }
      );
    }

    // 2. Contractor & Supplier isolation check
    if (!canSearchProperties(session)) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Contractors and suppliers are not permitted to discover client properties.',
          },
        },
        { status: 403 }
      );
    }

    // 3. Query parameter extraction & validation
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get('q') || '';
    const query = rawQuery.trim();

    // Queries under 2 characters return clean empty list immediately without DB hitting
    if (query.length < 2) {
      return NextResponse.json({ data: [] });
    }

    // Reject excessively long or malicious queries
    if (query.length > 100) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_QUERY',
            message: 'A valid property search query is required (max 100 characters).',
          },
        },
        { status: 400 }
      );
    }

    // Clamp limit safely
    const rawLimit = parseInt(searchParams.get('limit') || '15', 10);
    const limit = isNaN(rawLimit) ? 15 : Math.min(Math.max(1, rawLimit), 25);

    // 4. Perform scoped property search
    const results = await searchAuthorisedProperties(session, query, limit);

    // 5. Return safe projected DTO
    return NextResponse.json({
      data: results,
    });
  } catch (err: any) {
    console.error('[PROPERTY_SEARCH_API_ERROR]:', err?.message || err);
    // Safe error response — zero SQL, Supabase or stack trace exposure
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred while searching properties.',
        },
      },
      { status: 500 }
    );
  }
}
