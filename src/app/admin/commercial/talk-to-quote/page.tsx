import React from 'react';
import Link from 'next/link';
import { dbQuery } from '@/server/db/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';
import { Sparkles, Mic, FileText, CheckCircle2, Clock, Wrench, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TalkToQuoteDeskPage() {
  // Fetch talk to quote sessions with linked quote & engineer details
  const { data: sessions } = await dbQuery<any[]>(
    'talk_to_quote_sessions?order=created_at.desc&limit=25&select=*,engineer:persons(first_name,last_name),site:sites(name),quote:quotes(id,quote_number,total_amount_gbp,status,internal_status)'
  );

  const ttqSessions = sessions || [];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Commercial"
        title="Talk-to-Quote Intake Desk"
        description="Monitor engineer on-site voice quotes, asset identifications, and AI rate-card matched proposals."
        action={
          <div className="flex items-center gap-3">
            <span className="rounded bg-emerald-500/10 px-2.5 py-1 font-normal text-[11px] text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              TALK_TO_QUOTE_AGENT: ACTIVE
            </span>
            <Link
              href="/admin/commercial/quotes"
              className="rounded bg-white px-3 py-1.5 text-[12px] font-normal text-[#6D6D68] border border-[#E8E8E5] hover:text-white"
            >
              All Quotes →
            </Link>
          </div>
        }
      />

      {/* Overview Banner */}
      <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-md bg-brand-electric/15 p-2.5 text-brand-electric-bright">
            <Mic className="w-5 h-5 text-brand-electric" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-[#111111]">
              Mobile Engineer Voice Intelligence &amp; Quotation Engine
            </h3>
            <p className="mt-1 text-[12.5px] text-[#6D6D68] leading-relaxed">
              Field engineers walk plant rooms, dictate equipment faults and required scopes on mobile devices. EntireCAFM identifies assets against the asset register, enriches with trade rate cards and supplier catalogues, and generates professional commercial quotations ready for deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Sessions Intake Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[12px] uppercase tracking-wider text-[#6D6D68]">
            Incoming Field Quotations &amp; Sessions ({ttqSessions.length})
          </h3>
        </div>

        {ttqSessions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {ttqSessions.map((s) => {
              const ext = s.ai_extraction_json || {};
              const enrich = s.ai_enrichment_json || {};
              const engName = s.engineer ? `${s.engineer.first_name} ${s.engineer.last_name}` : 'Field Engineer';

              return (
                <div
                  key={s.id}
                  className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-5 space-y-4 hover:border-brand-electric/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-brand-electric/15 px-2 py-0.5 font-semibold text-[10.5px] text-brand-electric-bright">
                          {s.quote?.quote_number || `Session ${s.id.slice(0, 8)}`}
                        </span>
                        <span className="text-[10px] text-[#9A9A95] bg-[#FAFAF8] border border-[#E8E8E5] px-1.5 py-0.2 rounded">
                          {s.status}
                        </span>
                      </div>
                      <h4 className="mt-2 text-[13px] font-medium text-[#111111]">
                        {ext.faultDescription || 'Field remedial recommendation'}
                      </h4>
                      <div className="text-[11px] text-[#6D6D68] mt-0.5">
                        Site: <strong>{s.site?.name || ext.siteName || 'Site Asset'}</strong> &bull; Asset: <strong>{ext.assetReference || ext.assetName || 'Equipment'}</strong>
                      </div>
                    </div>
                    <span className="font-normal text-[11px] text-[#9A9A95]">
                      {new Date(s.created_at).toLocaleDateString('en-GB')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded border border-[#E8E8E5] bg-[#FAFAF8] p-3 text-[11.5px] font-normal">
                    <div>
                      <span className="text-[#9A9A95] block text-[10px]">Engineer</span>
                      <span className="text-[#111111] font-medium">{engName}</span>
                    </div>
                    <div>
                      <span className="text-[#9A9A95] block text-[10px]">Labour / Parts</span>
                      <span className="text-[#111111] font-medium">
                        {enrich.labour?.estimatedHours || 2}h &bull; {enrich.parts?.length || 0} part(s)
                      </span>
                    </div>
                    <div>
                      <span className="text-[#9A9A95] block text-[10px]">AI Confidence</span>
                      <span className="text-emerald-600 font-semibold">
                        {(Number(s.confidence_score || 0.85) * 100).toFixed(0)}% ({s.confidence_level})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E8E8E5]">
                    <span className="font-medium text-[11.5px] text-[#111111]">
                      {s.quote?.total_amount_gbp ? `Total: £${Number(s.quote.total_amount_gbp).toFixed(2)} (inc VAT)` : 'Draft in progress'}
                    </span>
                    {s.quote_id ? (
                      <Link
                        href={`/admin/commercial/quotes?quoteId=${s.quote_id}`}
                        className="rounded bg-brand-electric px-3 py-1.5 text-[11.5px] font-semibold text-white hover:bg-brand-indigo shadow-sm"
                      >
                        View Full Quote →
                      </Link>
                    ) : (
                      <span className="text-[11px] text-[#9A9A95]">Pending Quote</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Field Quotations Logged"
            description="Field engineers will submit voice-guided remedial quotes from their mobile devices."
            actionText="View Active Quotes"
            actionHref="/admin/commercial/quotes"
          />
        )}
      </div>
    </div>
  );
}
