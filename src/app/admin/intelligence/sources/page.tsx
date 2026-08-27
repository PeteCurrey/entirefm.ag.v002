import { Metadata } from 'next';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { sourceRegistry } from '@/server/intelligence/source-registry';
import { AdminSourceRegistryClient } from '@/components/admin/intelligence/AdminSourceRegistryClient';

export const metadata: Metadata = {
  title: 'Intelligence Source Registry | EntireFM Admin',
  description: 'External data feeds and connectors monitoring status.',
};

export const dynamic = 'force-dynamic';

export default async function AdminSourcesPage() {
  const session = await getCurrentSession();
  requireAdminSession(session);

  const sources = sourceRegistry.getAllSources();
  const summary = {
    total: sources.length,
    live: sources.filter((s) => s.healthStatus === 'LIVE').length,
    credentialRequired: sources.filter((s) => s.healthStatus === 'CREDENTIAL_REQUIRED').length,
    degraded: sources.filter((s) => s.healthStatus === 'DEGRADED').length,
    failed: sources.filter((s) => s.healthStatus === 'FAILED').length,
    disabled: sources.filter((s) => s.healthStatus === 'DISABLED').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminSourceRegistryClient initialSources={sources} initialHealthSummary={summary} />
    </div>
  );
}
