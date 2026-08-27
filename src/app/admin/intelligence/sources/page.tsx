import { Metadata } from 'next';
import { AdminSourceHealthClient } from '@/components/admin/AdminSourceHealthClient';

export const metadata: Metadata = {
  title: 'Source Health & Ingestion Registry | EntireFM Admin',
  description: 'Real-time telemetry and health monitoring for all Tier 1-4 statutory and intelligence connectors.',
};

export default function AdminSourcesPage() {
  return (
    <main className="min-h-screen bg-[#07090E] text-white pt-24 pb-20">
      <div className="container-wide">
        <div className="border-b border-white/10 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-white">Source Health & Ingestion Telemetry</h1>
          <p className="text-xs font-mono text-white/50 mt-1">
            Operational dashboard monitoring live UK statutory, trade, and procurement APIs.
          </p>
        </div>
        <AdminSourceHealthClient />
      </div>
    </main>
  );
}
