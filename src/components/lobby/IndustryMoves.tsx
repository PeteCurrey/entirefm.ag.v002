import React from 'react';
import Link from 'next/link';
import { opportunityStore } from '@/server/intelligence/opportunity-store';
import { getPeopleMovesWire, type PeopleMoveItem } from '@/server/wire/wire-store';
import type { ProcurementOpportunity } from '@/server/intelligence/types';

export async function IndustryMoves() {
  const contracts: ProcurementOpportunity[] = await opportunityStore.getContractAwards(2);
  const people: PeopleMoveItem[] = await getPeopleMovesWire(2);

  return (
    <section className="bg-white py-14 sm:py-18 border-b border-neutral-200/80">
      <div className="container-wide">
        
        {/* Two-Column Symmetrical Editorial Split: CONTRACTS vs PEOPLE */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* LEFT: CONTRACTS & MOBILISATIONS */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-electric font-semibold block mb-0.5">
                  MARKET ACTIVITY
                </span>
                <h3 className="text-xl sm:text-2xl font-extralight text-neutral-900">
                  Contracts &amp; Mobilisations
                </h3>
              </div>

              <Link
                href="/lobby/find/opportunities"
                className="text-xs font-medium uppercase tracking-wider text-neutral-500 hover:text-neutral-900"
              >
                All Wins &rarr;
              </Link>
            </div>

            {contracts.length === 0 ? (
              <div className="py-8 px-5 border border-dashed border-neutral-200 rounded-sm bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-500 font-light">
                <span>No verified UK FM contract awards recorded in the current monitoring cycle.</span>
                <span className="text-[10px] text-neutral-400 font-mono tracking-wider">FEED_OFFLINE</span>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-neutral-100">
                {contracts.map((item) => {
                  const valString = item.awardDetails?.awardedValue
                    ? item.awardDetails.awardedValue
                    : item.estimatedValue?.amount
                    ? `£${item.estimatedValue.amount.toLocaleString()}`
                    : undefined;

                  return (
                    <article key={item.id} className="pt-4 first:pt-0 space-y-2 group">
                      <div className="flex items-center gap-2">
                        {valString && (
                          <span className="text-[11px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm">
                            {valString}
                          </span>
                        )}
                        <span className="text-xs text-neutral-400 font-normal">
                          {item.buyerName}
                        </span>
                      </div>

                      <h4 className="text-base font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                        <a
                          href={item.officialNoticeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.title}
                        </a>
                      </h4>

                      <p className="text-xs font-light text-neutral-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: PEOPLE & APPOINTMENTS */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold block mb-0.5">
                  LEADERSHIP MOVES
                </span>
                <h3 className="text-xl sm:text-2xl font-extralight text-neutral-900">
                  People &amp; Appointments
                </h3>
              </div>

              <Link
                href="/lobby/wire"
                className="text-xs font-medium uppercase tracking-wider text-neutral-500 hover:text-neutral-900"
              >
                All Moves &rarr;
              </Link>
            </div>

            {people.length === 0 ? (
              <div className="py-8 px-5 border border-dashed border-neutral-200 rounded-sm bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-500 font-light">
                <span>No executive FM appointments or leadership moves verified in the current monitoring cycle.</span>
                <span className="text-[10px] text-neutral-400 font-mono tracking-wider">FEED_OFFLINE</span>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-neutral-100">
                {people.map((item) => (
                  <article key={item.id} className="pt-4 first:pt-0 space-y-2 group">
                    <div className="text-xs font-normal text-brand-electric">
                      {item.personName}
                    </div>

                    <h4 className="text-base font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.newRole} — {item.organisationName}
                      </a>
                    </h4>

                    <p className="text-xs font-light text-neutral-600 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
