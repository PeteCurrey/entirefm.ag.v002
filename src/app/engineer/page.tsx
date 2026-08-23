import React from 'react';
import { getCurrentSession } from '@/server/identity';

export default async function EngineerHomePage() {
  const session = await getCurrentSession();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon p-6">
        <h1 className="text-xl font-medium text-white">Engineer Duty Station</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Resource: <span className="text-white">{session?.name}</span>
        </p>
        <div className="mt-4 rounded border border-brand-edge-dark bg-brand-void p-4 text-[12.5px] text-brand-mist/70">
          <p className="font-semibold text-brand-electric-bright">Phase 0A Mobile Foundation Active</p>
          <p className="mt-1">
            Engineer identity and mobile security boundaries are verified. On-site GPS check-in/out, offline task completion, QR scanner, and dynamic hazard risk assessment workflows will be activated in the next development sprint.
          </p>
        </div>
      </div>
    </div>
  );
}
