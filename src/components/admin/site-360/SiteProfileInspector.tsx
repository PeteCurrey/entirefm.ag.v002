'use client';

import React from 'react';
import { Site, Building } from '@/server/estate';
import { Building2, User, Phone, Mail, Clock, Key, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface SiteProfileInspectorProps {
  site: Site;
  buildings?: Building[];
}

export function SiteProfileInspector({ site, buildings = [] }: SiteProfileInspectorProps) {
  const totalGia = buildings.reduce((acc, b) => acc + (b.gross_internal_area_sqm || 0), 0);

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3 flex items-center justify-between">
        <h3 className="text-[11px] font-normal uppercase tracking-wider text-[#101010]">
          SITE PROFILE & SPECIFICATION
        </h3>
        <Badge variant={site.status === 'ACTIVE' ? 'green' : 'neutral'} size="xs">
          {site.status}
        </Badge>
      </div>

      <div className="p-5 space-y-5 text-[12.5px]">
        {/* Specification Fields */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Reference Code</span>
            <span className="font-medium text-[#101010]">{site.site_code}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Facility Type</span>
            <span className="font-medium text-[#101010]">
              {site.site_type ? site.site_type.replace(/_/g, ' ') : 'COMMERCIAL'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Gross Internal Area</span>
            <span className="font-medium text-[#101010]">
              {totalGia > 0 ? `${totalGia.toLocaleString()} m²` : '—'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Client / Organisation</span>
            <span className="font-medium text-[#FF6B24]">
              {site.client_account?.name || site.organisation?.name || 'EntireFM Direct'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Security Clearance</span>
            <span className="font-normal text-[#101010]">
              {site.security_clearance_required ? 'MANDATORY' : 'STANDARD'}
            </span>
          </div>
        </div>

        {/* Access Instructions */}
        <div className="space-y-2 pt-1">
          <h4 className="text-[10.5px] uppercase tracking-wider text-[#9B9B97] font-light">
            ACCESS & SITE PROTOCOLS
          </h4>
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 text-[12px] text-[#686866] leading-relaxed">
            <p>
              {site.access_instructions ||
                'Standard site check-in required at main reception for all engineering personnel.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
