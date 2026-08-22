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
  const rec = getContentRecord(path);
  if (rec) return rec;
  try {
    const decoded = decodeURIComponent(path);
    const recDecoded = getContentRecord(decoded);
    if (recDecoded) return recDecoded;
    const encoded = encodeURI(path);
    const recEncoded = getContentRecord(encoded);
    if (recEncoded) return recEncoded;
  } catch {}
  return null;
}

export { CONTENT_DATABASE };
