/**
 * LOG A JOB — /clients/log-a-job
 * ===============================
 * Redirects to canonical operational service desk at /log-a-job.
 * Automatically preserves client session, scoped sites, and assets.
 */

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ClientLogAJobPage() {
  redirect('/log-a-job');
}
