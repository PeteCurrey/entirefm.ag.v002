/**
 * HOMEPAGE — /
 * ============
 * Registry-driven homepage.
 * Phase 02: structural skeleton only. No visual design.
 */

import type { Metadata } from 'next';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { ROUTE_COUNTS } from '@/lib/routes/route-registry';

export const metadata: Metadata = generateRouteMetadata('/', {
  title: 'Entire FM | Total Facilities Management Services UK',
  description:
    'Entire FM provides integrated Hard FM, Soft FM, cleaning, PPM, and specialist facilities management services across the UK.',
});

export default function HomePage() {
  return (
    <main>
      <h1>Entire FM — Total Facilities Management</h1>
      <p>
        Hard FM · Soft FM · Cleaning · PPM · Specialist Services<br />
        Serving businesses across London, Manchester, Birmingham, Sheffield, Leeds, Lincoln and the UK.
      </p>

      {/* Phase 02 architecture status — visible in dev only */}
      {process.env.NODE_ENV !== 'production' && (
        <aside style={{ marginTop: '2rem', padding: '1rem', border: '2px solid #f0ad00', background: '#fff8e1' }}>
          <strong>Phase 02 Architecture Status</strong>
          <ul>
            <li>Total routes registered: {ROUTE_COUNTS.total}</li>
            <li>Protected routes: {ROUTE_COUNTS.protected}</li>
            <li>LEGACY_VERIFIED: {ROUTE_COUNTS.LEGACY_VERIFIED}</li>
            <li>LEGACY_PROTECTED_BY_DIRECTIVE: {ROUTE_COUNTS.LEGACY_PROTECTED_BY_DIRECTIVE}</li>
            <li>NEW_GROWTH: {ROUTE_COUNTS.NEW_GROWTH}</li>
          </ul>
          <p style={{ color: '#c62828' }}>
            ⚠ Development mode — all pages are noindex/nofollow.
            Production indexing requires NEXT_PUBLIC_SITE_URL to be set.
          </p>
        </aside>
      )}
    </main>
  );
}
