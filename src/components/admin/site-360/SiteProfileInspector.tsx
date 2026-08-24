'use client';

import React from 'react';
import { Site } from '@/server/estate';
import { Building2, User, Phone, Mail, Clock, Key, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface SiteProfileInspectorProps {
  site: Site & {
    grossAreaSqm?: number;
    operatingHours?: string;
    siteManagerName?: string;
    siteManagerPhone?: string;
    siteManagerEmail?: string;
    contractName?: string;
  };
}

export function SiteProfileInspector({ site }: SiteProfileInspectorProps) {
  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3 flex items-center justify-between">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
          SITE PROFILE & PARAMETERS
        </h3>
        <span className="font-mono text-[10px] text-[#686866]">SPEC V2.4</span>
      </div>

      <div className="p-5 space-y-5 text-[12.5px]">
        {/* Specification Fields */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Reference Code</span>
            <span className="font-mono font-medium text-[#101010]">{site.site_code}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Building Type</span>
            <span className="font-medium text-[#101010]">{site.site_type.replace(/_/g, ' ')}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Gross Internal Area</span>
            <span className="font-mono font-medium text-[#101010]">
              {site.grossAreaSqm ? `${site.grossAreaSqm.toLocaleString()} m²` : '8,450 m²'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Service Contract</span>
            <span className="font-medium text-[#FF6B24]">
              {site.contractName || 'Total FM Full Asset Coverage'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Operating Hours</span>
            <span className="font-medium text-[#101010]">24/7 Mon–Sun (365d)</span>
          </div>
        </div>

        {/* Contacts & Keyholders */}
        <div className="space-y-2 pt-1">
          <h4 className="font-mono text-[10.5px] uppercase tracking-wider text-[#9B9B97] font-semibold">
            KEY CONTACTS & ON-SITE FM
          </h4>
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-[#FF6B24]" />
              <span className="font-medium text-[#101010]">
                {site.siteManagerName || 'James Thornton (Lead FM Director)'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11.5px] text-[#686866]">
              <Phone className="h-3 w-3 text-[#9B9B97]" />
              <span className="font-mono">{site.siteManagerPhone || '+44 (0) 161 820 4420'}</span>
            </div>
            <div className="flex items-center gap-2 text-[11.5px] text-[#686866]">
              <Mail className="h-3 w-3 text-[#9B9B97]" />
              <span>{site.siteManagerEmail || 'operations@entirefm.com'}</span>
            </div>
          </div>
        </div>

        {/* Access Instructions */}
        <div className="space-y-2 pt-1">
          <h4 className="font-mono text-[10.5px] uppercase tracking-wider text-[#9B9B97] font-semibold">
            ACCESS & PROTOCOL
          </h4>
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 text-[12px] text-[#686866] leading-relaxed">
            <p>
              {site.access_instructions ||
                'Main reception check-in required for all contractor trades. Keybox code on file with 24/7 helpdesk. Permit-to-Work mandatory for roof deck and high-voltage plant rooms.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
