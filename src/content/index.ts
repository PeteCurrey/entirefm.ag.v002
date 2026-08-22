/**
 * CONTENT RECORDS — TYPE AND LOADER
 * ====================================
 * Every protected route must have its own content record.
 * A generic template does NOT satisfy this requirement.
 *
 * Content records live in: /src/content/pages/[route-slug].ts
 * Each file exports a single ContentRecord object.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';
export type { ContentRecord };

/** Load a content record for a given path */
export async function loadContentRecord(path: string): Promise<ContentRecord | null> {
  // Normalise path to a filename: /fm-london → fm-london
  // /mechanical-electrical/access-control → mechanical-electrical--access-control
  const slug = path
    .replace(/^\//, '')
    .replace(/\//g, '--')
    || 'home';

  try {
    const module = await import(`@/content/pages/${slug}`);
    return module.default as ContentRecord;
  } catch {
    // Content record not yet written — acceptable during Phase 02
    return null;
  }
}
