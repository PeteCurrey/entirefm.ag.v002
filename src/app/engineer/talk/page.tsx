/**
 * FIELD ENGINEER — TALK TO QUOTE (PRODUCTION V1)
 * ===============================================
 * Authenticated, mobile-first Voice + AI Field Intelligence interface.
 * Converts natural spoken notes into enriched commercial quotations.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Clock, FileText, Sparkles } from 'lucide-react';
import { TalkToQuoteClient } from '@/components/engineer/TalkToQuoteClient';

export const metadata: Metadata = {
  title: 'Talk to Quote • EntireCAFM Field Intelligence',
  description: 'Voice-driven quotation and remedial job intelligence for field engineers.',
};

export const dynamic = 'force-dynamic';

export default async function EngineerTalkPage({
  searchParams,
}: {
  searchParams?: Promise<{
    siteId?: string;
    siteName?: string;
    clientAccountId?: string;
    clientName?: string;
    assetId?: string;
    assetReference?: string;
    workOrderId?: string;
    workOrderNumber?: string;
  }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/engineer/talk');

  const resolvedParams = (await searchParams) || {};

  // Fetch recent talk to quote sessions for this engineer
  const { data: sessions } = await dbQuery<any[]>(
    `talk_to_quote_sessions?engineer_person_id=eq.${encodeURIComponent(
      session.personId
    )}&order=created_at.desc&limit=5&select=*,quote:quotes(id,quote_number,total_amount_gbp,status,internal_status)`
  );

  const recentSessions = sessions || [];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/engineer"
          className="inline-flex items-center gap-1.5 text-xs text-brand-mist hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[11px] text-brand-electric-bright font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> EntireCAFM v2.0
        </span>
      </div>

      {/* Main Interactive Talk to Quote Client */}
      <TalkToQuoteClient
        engineerName={session.name}
        initialContext={{
          siteId: resolvedParams.siteId,
          siteName: resolvedParams.siteName,
          clientAccountId: resolvedParams.clientAccountId,
          clientName: resolvedParams.clientName,
          assetId: resolvedParams.assetId,
          assetReference: resolvedParams.assetReference,
          workOrderId: resolvedParams.workOrderId,
          workOrderNumber: resolvedParams.workOrderNumber,
        }}
      />

      {/* Recent Sessions List */}
      {recentSessions.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-brand-edge-dark/60">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist/70">
            Recent Field Quotations ({recentSessions.length})
          </h3>
          <div className="space-y-2">
            {recentSessions.map((s) => (
              <div
                key={s.id}
                className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-3.5 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {s.quote?.quote_number || `Session ${s.id.slice(0, 8)}`}
                    </span>
                    <span className="bg-brand-void text-[10px] px-1.5 py-0.2 rounded border border-brand-edge-dark text-brand-mist">
                      {s.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-brand-mist/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(s.created_at).toLocaleString('en-GB')}
                  </div>
                </div>

                {s.quote_id ? (
                  <Link
                    href={`/engineer/talk/quote/${s.quote_id}`}
                    className="bg-brand-void hover:bg-brand-electric/20 border border-brand-edge-dark hover:border-brand-electric/40 text-brand-electric-bright px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    View Quote &rarr;
                  </Link>
                ) : (
                  <span className="text-[11px] text-brand-mist/50">Drafting</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
