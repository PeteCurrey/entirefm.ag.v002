import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { ChevronLeft, Printer, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { QuoteLine } from '@/server/commercial';
import { EngineerQuoteReviewClient } from './EngineerQuoteReviewClient';

export const dynamic = 'force-dynamic';

export default async function EngineerQuoteReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/engineer/talk');

  const { id } = await params;

  const { data: quotes, error } = await dbQuery<any[]>(
    `quotes?id=eq.${encodeURIComponent(id)}&select=*,site:sites(id,name,address_line1,city,postcode),client:organisations!client_account_id(id,name)&limit=1`
  );

  if (error || !quotes || quotes.length === 0) {
    notFound();
  }

  const quote = quotes[0];

  const { data: lines } = await dbQuery<QuoteLine[]>(
    `quote_lines?quote_id=eq.${encodeURIComponent(id)}&order=created_at.asc&select=*`
  );

  const { data: versions } = await dbQuery<any[]>(
    `quote_versions?quote_id=eq.${encodeURIComponent(id)}&order=version.desc&select=*`
  );

  const { data: exceptions } = await dbQuery<any[]>(
    `commercial_exceptions?object_id=eq.${encodeURIComponent(id)}&select=*`
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/engineer/talk"
          className="inline-flex items-center gap-1.5 text-xs text-brand-mist hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Talk to Quote
        </Link>
        <span className="text-[11px] text-brand-mist/60">
          Version {quote.version || 1} &bull; {versions?.length || 1} Snapshot(s)
        </span>
      </div>

      <EngineerQuoteReviewClient
        quote={{
          ...quote,
          lines: lines || [],
          exceptions: exceptions || [],
        }}
        engineerName={session.name}
      />
    </div>
  );
}
