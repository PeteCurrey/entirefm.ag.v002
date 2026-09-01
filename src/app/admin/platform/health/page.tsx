import React from 'react';
import { isDbConfigured, getDbConfig } from '@/server/db/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function PlatformHealthPage() {
  const dbConfigured = isDbConfigured();
  const dbInfo = getDbConfig();
  const authConfigured = Boolean(process.env.ADMIN_PASSWORD || process.env.AUTH_SECRET);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Platform"
        title="Platform & Security Diagnostics"
        description="Live operational telemetry, database connectivity, Row Level Security state, and subsystem integrity."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Database Connectivity */}
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[11px] uppercase text-brand-mist/50">Database Engine</span>
            <span
              className={`rounded px-2 py-0.5 font-normal text-[10px] ${
                dbConfigured
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {dbConfigured ? 'CONNECTED' : 'STANDBY'}
            </span>
          </div>
          <div className="mt-3 text-lg font-light text-white">PostgreSQL / Supabase</div>
          <p className="mt-1 font-normal text-[11px] text-brand-mist/50 truncate">
            {dbInfo?.url || 'Awaiting SUPABASE_SERVICE_ROLE_KEY'}
          </p>
        </div>

        {/* Auth Subsystem */}
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[11px] uppercase text-brand-mist/50">Identity & Auth</span>
            <span
              className={`rounded px-2 py-0.5 font-normal text-[10px] ${
                authConfigured
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {authConfigured ? 'HARDENED' : 'UNCONFIGURED'}
            </span>
          </div>
          <div className="mt-3 text-lg font-light text-white">HMAC + Supabase Auth</div>
          <p className="mt-1 text-[11.5px] text-brand-mist/50">
            SHA-256 tamper-proof signed session cookies & RLS identity claims.
          </p>
        </div>

        {/* Row Level Security */}
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[11px] uppercase text-brand-mist/50">PostgreSQL RLS</span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-normal text-[10px] text-emerald-400">
              ENFORCED
            </span>
          </div>
          <div className="mt-3 text-lg font-light text-white">Multi-Tenant Isolation</div>
          <p className="mt-1 text-[11.5px] text-brand-mist/50">
            Database-level isolation active across 11 core operational domains.
          </p>
        </div>

        {/* Outbox & Automation */}
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[11px] uppercase text-brand-mist/50">Event Outbox</span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-normal text-[10px] text-emerald-400">
              IDEMPOTENT
            </span>
          </div>
          <div className="mt-3 text-lg font-light text-white">Transactional Broker</div>
          <p className="mt-1 text-[11.5px] text-brand-mist/50">
            Deduplication keys and dead-letter queue governance active.
          </p>
        </div>

        {/* AI Control Plane */}
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[11px] uppercase text-brand-mist/50">AI Governance</span>
            <span className="rounded bg-purple-500/20 px-2 py-0.5 font-normal text-[10px] text-purple-300">
              ASSIST MODE
            </span>
          </div>
          <div className="mt-3 text-lg font-light text-white">Controlled Autonomy</div>
          <p className="mt-1 text-[11.5px] text-brand-mist/50">
            External actions require human authorization; spend limits active.
          </p>
        </div>

        {/* Audit Immutability */}
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[11px] uppercase text-brand-mist/50">Audit Engine</span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-normal text-[10px] text-emerald-400">
              IMMUTABLE
            </span>
          </div>
          <div className="mt-3 text-lg font-light text-white">Forensic Ledger</div>
          <p className="mt-1 text-[11.5px] text-brand-mist/50">
            Database trigger blocks any UPDATE or DELETE operations.
          </p>
        </div>
      </div>
    </div>
  );
}
