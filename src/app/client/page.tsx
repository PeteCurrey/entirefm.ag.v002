import React from 'react';
import { getCurrentSession } from '@/server/identity';

export default async function ClientHomePage() {
  const session = await getCurrentSession();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-brand-edge bg-white p-8">
        <h1 className="text-2xl font-light tracking-tight text-brand-graphite">
          Welcome to EntireFM Client Portal
        </h1>
        <p className="mt-2 text-[14px] text-brand-silver">
          Account: <strong className="text-brand-graphite">{session?.orgName}</strong>
        </p>
        <div className="mt-6 rounded border border-brand-edge bg-brand-surface p-5 text-[13px] text-brand-silver">
          <p className="font-semibold text-brand-graphite">Phase 0A Foundation Shell Active</p>
          <p className="mt-1">
            Client identity and estate tenancy permissions are operational. The interactive client dashboard, service request submission wizard, and live PPM tracking will be deployed in subsequent phases.
          </p>
        </div>
      </div>
    </div>
  );
}
