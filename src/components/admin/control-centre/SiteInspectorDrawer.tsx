'use client';

import React from 'react';
import Image from 'next/image';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SiteWithTelemetry } from './LiveEstateWorkspace';
import { Building2, MapPin, Wrench, ShieldCheck, Users, Activity, ExternalLink, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';

interface SiteInspectorDrawerProps {
  site: SiteWithTelemetry | null;
  open: boolean;
  onClose: () => void;
}

export function SiteInspectorDrawer({
  site,
  open,
  onClose,
}: SiteInspectorDrawerProps) {
  if (!site) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="lg"
      title={site.name}
      subtitle={`${site.city}, ${site.postcode} · ${site.site_code}`}
      badge={
        site.healthStatus === 'CRITICAL' ? (
          <Badge variant="red" size="xs" pulse>CRITICAL</Badge>
        ) : site.healthStatus === 'WARNING' ? (
          <Badge variant="amber" size="xs">WARNING</Badge>
        ) : (
          <Badge variant="green" size="xs">NOMINAL</Badge>
        )
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <Link
            href={`/admin/operations/work-orders?siteId=${site.id}`}
            className="text-[12px] font-medium text-[#686866] hover:text-[#101010]"
          >
            All Work Orders ({site.openJobsCount || 0})
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/estate/sites/${site.id}`}
              className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#FF6B24] hover:bg-[#E9540F] px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow-sm transition-all"
            >
              <span>Launch Site 360 Workspace</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Site Hero Photo */}
        <div className="relative h-56 w-full rounded-[12px] overflow-hidden border border-[#E4E4E1] bg-[#F0F0EE]">
          <Image
            src={site.heroImageUrl || '/images/EntireFM 01.png'}
            alt={site.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="font-mono text-[11px] uppercase tracking-wider text-white/80">
              {site.site_type.replace(/_/g, ' ')}
            </div>
            <div className="text-[14px] font-medium text-white">{site.address_line1}</div>
          </div>
        </div>

        {/* Live Operational Metrics Matrix */}
        <div className="grid grid-cols-3 gap-2.5 font-mono text-[12px]">
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3 text-center">
            <div className="text-[10px] text-[#686866] uppercase">Open Jobs</div>
            <div className="text-2xl font-light text-[#101010] mt-1 tabular-nums">
              {site.openJobsCount || 0}
            </div>
            <div className="text-[10px] text-[#686866] mt-0.5">
              {site.criticalJobsCount ? `${site.criticalJobsCount} P1 Critical` : '0 Critical'}
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3 text-center">
            <div className="text-[10px] text-[#686866] uppercase">Compliance</div>
            <div className={`text-2xl font-light mt-1 tabular-nums ${
              site.compliancePercent !== undefined && site.compliancePercent !== null
                ? site.compliancePercent >= 95 ? 'text-[#15803D]' : 'text-[#D97706]'
                : 'text-[#9B9B97]'
            }`}>
              {site.compliancePercent !== undefined && site.compliancePercent !== null
                ? `${site.compliancePercent.toFixed(1)}%`
                : '—'}
            </div>
            <div className="text-[10px] text-[#686866] mt-0.5">Assured</div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3 text-center">
            <div className="text-[10px] text-[#686866] uppercase">Engineers on Site</div>
            <div className="text-2xl font-light text-[#FF6B24] mt-1 tabular-nums">
              {site.engineersPresent ?? '—'}
            </div>
            <div className="text-[10px] text-[#686866] mt-0.5">Active Passes</div>
          </div>
        </div>

        {/* Site Profile & Access Rules */}
        <div className="rounded-[12px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 space-y-3">
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686866]">
            FACILITY PROFILE &amp; ACCESS PROTOCOLS
          </h3>
          <div className="grid grid-cols-2 gap-3 text-[12.5px]">
            <div>
              <span className="text-[#9B9B97] text-[11px] block">Client Portfolio</span>
              <span className="font-medium text-[#101010]">
                {(site as any).client_account?.name || '—'}
              </span>
            </div>
            <div>
              <span className="text-[#9B9B97] text-[11px] block">Security Protocol</span>
              <span className="font-medium text-[#101010]">
                {site.security_clearance_required ? 'Escorted / Clearance Req' : 'Standard Contractor ID'}
              </span>
            </div>
            <div>
              <span className="text-[#9B9B97] text-[11px] block">Coordinates</span>
              <span className="font-mono text-[11.5px] text-[#101010]">
                {(site as any).latitude
                  ? `${Number((site as any).latitude).toFixed(4)}, ${Number((site as any).longitude).toFixed(4)}`
                  : '—'}
              </span>
            </div>
            <div>
              <span className="text-[#9B9B97] text-[11px] block">Status</span>
              <span className="font-medium text-[#101010]">{site.status}</span>
            </div>
          </div>
        </div>

        {/* Active Work Orders — no fake data */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686866]">
              ACTIVE INCIDENTS &amp; WORK ORDERS
            </h3>
            <span className="font-mono text-[11px] text-[#9B9B97]">
              {site.openJobsCount ?? 0} active
            </span>
          </div>

          {(site.openJobsCount ?? 0) === 0 ? (
            <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-4 text-center">
              <p className="text-[12.5px] text-[#9B9B97]">No active work orders at this site.</p>
              <Link
                href={`/admin/operations/work-orders?siteId=${site.id}`}
                className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-[#FF6B24] hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Create Work Order
              </Link>
            </div>
          ) : (
            <Link
              href={`/admin/operations/work-orders?siteId=${site.id}`}
              className="flex items-center justify-between rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3.5 hover:border-[#D0D0CD] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="h-4 w-4 text-[#FF6B24]" />
                <span className="text-[13px] font-medium text-[#101010]">
                  {site.openJobsCount} open work order{site.openJobsCount !== 1 ? 's' : ''}
                </span>
              </div>
              <span className="text-[12px] font-medium text-[#FF6B24]">View All →</span>
            </Link>
          )}
        </div>
      </div>
    </Drawer>
  );
}
