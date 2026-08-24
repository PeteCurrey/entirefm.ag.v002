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
            <div className="text-2xl font-light text-[#15803D] mt-1 tabular-nums">
              {site.compliancePercent?.toFixed(1) || '98.4'}%
            </div>
            <div className="text-[10px] text-[#15803D] mt-0.5">Assured</div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3 text-center">
            <div className="text-[10px] text-[#686866] uppercase">Engineers on Site</div>
            <div className="text-2xl font-light text-[#FF6B24] mt-1 tabular-nums">
              {site.engineersPresent || 0}
            </div>
            <div className="text-[10px] text-[#686866] mt-0.5">Active Passes</div>
          </div>
        </div>

        {/* Site Profile & Access Rules */}
        <div className="rounded-[12px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 space-y-3">
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686866]">
            FACILITY PROFILE & ACCESS PROTOCOLS
          </h3>
          <div className="grid grid-cols-2 gap-3 text-[12.5px]">
            <div>
              <span className="text-[#9B9B97] text-[11px] block">Client Portfolio</span>
              <span className="font-medium text-[#101010]">
                {site.client_account?.name || 'Primary Corporate Estate'}
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
                {site.latitude ? `${site.latitude.toFixed(4)}, ${site.longitude?.toFixed(4)}` : '53.4808° N, 2.2426° W'}
              </span>
            </div>
            <div>
              <span className="text-[#9B9B97] text-[11px] block">Operating Hours</span>
              <span className="font-medium text-[#101010]">24/7 Access (Keyholder on file)</span>
            </div>
          </div>
        </div>

        {/* Live Active Work Orders List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686866]">
              ACTIVE INCIDENTS & WORK ORDERS
            </h3>
            <span className="font-mono text-[11px] text-[#9B9B97]">
              {site.openJobsCount || 0} active
            </span>
          </div>

          <div className="space-y-2">
            <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 text-[12.5px]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] text-[#9B9B97]">WO-84920</span>
                <Badge variant="red" size="xs">P1 CRITICAL</Badge>
              </div>
              <div className="font-medium text-[#101010] mt-1">
                Boiler Plant Primary Circulation Pump Trip
              </div>
              <div className="text-[11.5px] text-[#686866] mt-0.5">
                Plant Room Level -1 · Target Resolution: 42 min remaining
              </div>
            </div>

            <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 text-[12.5px]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] text-[#9B9B97]">PPM-30194</span>
                <Badge variant="blue" size="xs">SCHEDULED PPM</Badge>
              </div>
              <div className="font-medium text-[#101010] mt-1">
                Quarterly Air Handling Unit (AHU-01) Filter & Belt Inspection
              </div>
              <div className="text-[11.5px] text-[#686866] mt-0.5">
                Roof Deck Plant Area · Scheduled for today 14:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
