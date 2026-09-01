import React from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, Award, Users } from 'lucide-react';
import { getContractWins, getPeopleMoves } from '@/server/news/news-store';

export function IndustryMoves() {
  const contracts = getContractWins(2);
  const people = getPeopleMoves(2);

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
                href="/lobby/news"
                className="text-xs font-medium uppercase tracking-wider text-neutral-500 hover:text-neutral-900"
              >
                All Wins &rarr;
              </Link>
            </div>

            <div className="space-y-4 divide-y divide-neutral-100">
              {contracts.map((item) => (
                <article key={item.id} className="pt-4 first:pt-0 space-y-2 group">
                  <div className="flex items-center gap-2">
                    {item.contractValue && (
                      <span className="text-[11px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm">
                        {item.contractValue}
                      </span>
                    )}
                    <span className="text-xs text-neutral-400 font-normal">
                      {item.contractClient}
                    </span>
                  </div>

                  <h4 className="text-base font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                    <Link href={`/lobby/news/article/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h4>

                  <p className="text-xs font-light text-neutral-600 line-clamp-2 leading-relaxed">
                    {item.standfirst}
                  </p>
                </article>
              ))}
            </div>
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
                href="/lobby/news"
                className="text-xs font-medium uppercase tracking-wider text-neutral-500 hover:text-neutral-900"
              >
                All Moves &rarr;
              </Link>
            </div>

            <div className="space-y-4 divide-y divide-neutral-100">
              {people.map((item) => (
                <article key={item.id} className="pt-4 first:pt-0 space-y-2 group">
                  <div className="text-xs font-normal text-brand-electric">
                    {item.personName}
                  </div>

                  <h4 className="text-base font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                    <Link href={`/lobby/news/article/${item.slug}`}>
                      {item.personNewRole} — {item.personCompany}
                    </Link>
                  </h4>

                  <p className="text-xs font-light text-neutral-600 line-clamp-2 leading-relaxed">
                    {item.standfirst}
                  </p>
                </article>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
