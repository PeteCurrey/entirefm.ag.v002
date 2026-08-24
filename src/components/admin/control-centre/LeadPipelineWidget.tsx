'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Users, ArrowRight, Clock, MapPin, Globe, Sparkles } from 'lucide-react';
import { ExtendedLead } from '@/server/growth/types';

interface LeadPipelineWidgetProps {
  leads: ExtendedLead[];
}

export function LeadPipelineWidget({ leads }: LeadPipelineWidgetProps) {
  const newLeads = leads.filter(
    (l) => !l.qualification_status || l.qualification_status === 'NEW' || (l as any).status === 'NEW'
  );
  const qualifiedLeads = leads.filter(
    (l) => l.qualification_status === 'QUALIFIED' || l.qualification_status === 'OPPORTUNITY'
  );

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="rounded-[10px] border border-[#E8E8E5] bg-[#FFFFFF] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#111111] text-white">
            <Mail className="h-3 w-3" />
          </div>
          <div>
            <h2 className="text-[12px] font-semibold text-[#111111] uppercase tracking-wide">
              Inbound Leads &amp; Pipeline
            </h2>
            <p className="text-[11px] text-[#6D6D68]">
              {newLeads.length > 0
                ? `${newLeads.length} new commercial enquir${newLeads.length === 1 ? 'y' : 'ies'} awaiting response`
                : 'All inbound leads acknowledged'}
            </p>
          </div>
        </div>

        <Link
          href="/admin/growth/leads"
          className="text-[11.5px] font-medium text-[#EA580C] hover:underline inline-flex items-center gap-1"
        >
          <span>Leads Hub</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#E8E8E5] divide-x divide-[#E8E8E5] bg-[#FAFAF8]">
        <div className="p-3 text-center">
          <span className="text-[10px] uppercase font-medium text-[#6D6D68] block">New Leads</span>
          <span className="text-xl font-semibold text-[#111111] mt-0.5 block">{newLeads.length}</span>
        </div>
        <div className="p-3 text-center">
          <span className="text-[10px] uppercase font-medium text-[#6D6D68] block">In Pipeline</span>
          <span className="text-xl font-semibold text-[#111111] mt-0.5 block">{leads.length}</span>
        </div>
        <div className="p-3 text-center">
          <span className="text-[10px] uppercase font-medium text-[#6D6D68] block">Qualified</span>
          <span className="text-xl font-semibold text-[#15803D] mt-0.5 block">{qualifiedLeads.length}</span>
        </div>
        <div className="p-3 text-center">
          <span className="text-[10px] uppercase font-medium text-[#6D6D68] block">Target SLA</span>
          <span className="text-xl font-semibold text-[#EA580C] mt-0.5 block">{'< 15m'}</span>

        </div>
      </div>

      {/* Leads List */}
      {leads.length === 0 ? (
        <div className="p-8 text-center text-xs text-[#686866] space-y-1">
          <p className="font-medium text-slate-800">No inbound website enquiries recorded yet.</p>
          <p className="text-[11px] text-slate-500">
            Form submissions across service, sector, and location pages will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#E4E4E1] max-h-[300px] overflow-y-auto">
          {leads.slice(0, 5).map((l) => {
            const leadId = l.enquiry_id || l.id;
            const isNew = !l.qualification_status || l.qualification_status === 'NEW' || (l as any).status === 'NEW';
            return (
              <div
                key={leadId}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAFAF9] transition-colors ${
                  isNew ? 'bg-[#FFF5F9]/40' : ''
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[13px] text-[#101010] truncate">
                      {l.name}
                    </span>
                    {l.company && (
                      <span className="text-xs text-[#686866]">· {l.company}</span>
                    )}
                    {isNew && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#FF3E9D] text-white">
                        NEW
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#686866] flex-wrap">
                    <span className="font-medium text-slate-900">{l.service || 'General FM'}</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {l.location || 'United Kingdom'}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-pink-600 font-mono">
                      <Globe className="h-3 w-3" />
                      {l.conversion_page || l.landing_page || 'Website'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="font-mono text-[10px] text-[#9B9B97]">
                    {formatTime(l.received_at)}
                  </span>
                  <Link
                    href={`/admin/growth/leads/${leadId}`}
                    className="inline-flex items-center gap-1 rounded-[6px] bg-[#101010] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#333] transition-colors"
                  >
                    <span>Qualify Lead</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
