/**
 * CONTENT RECORDS — TYPE AND LOADER
 * ====================================
 * Every protected route has its own dedicated content record.
 * Records are stored in /src/content/pages/ and indexed in /src/content/registry.ts.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';
import { CONTENT_DATABASE, getContentRecord } from './registry';

export type { ContentRecord };

/** Load a content record for a given path */
export function loadContentRecord(path: string): ContentRecord | null {
  return getContentRecord(path);
}

export { CONTENT_DATABASE };
