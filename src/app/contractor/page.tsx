import React from 'react';
import { getCurrentSession } from '@/server/identity';

export default async function ContractorHomePage() {
  const session = await getCurrentSession();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-brand-edge bg-white p-8">
        <h1 className="text-2xl font-light tracking-tight text-brand-graphite">
          EntireFM Approved Contractor Portal
        </h1>
        <p className="mt-2 text-[14px] text-brand-silver">
          Partner Organisation: <strong className="text-brand-graphite">{session?.orgName}</strong>
        </p>
        <div className="mt-6 rounded border border-brand-edge bg-brand-surface p-5 text-[13px] text-brand-silver">
          <p className="font-semibold text-brand-graphite">Phase 0A Foundation Shell Active</p>
          <p className="mt-1">
            Contractor identity, accreditation registry, and rate-card associations are operational. The job acceptance queue, engineer assignment matrix, and electronic RAMS submission interface will be enabled in subsequent releases.
          </p>
        </div>
      </div>
    </div>
  );
}
