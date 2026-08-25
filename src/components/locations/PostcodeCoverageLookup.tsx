'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { lookupPostcodeCoverage, PostcodeAreaMatch } from '@/config/postcodes';
import { CONTACT_CONFIG } from '@/config/contact';

export interface PostcodeCoverageLookupProps {
  initialCity?: string;
  className?: string;
}

export function PostcodeCoverageLookup({ initialCity, className = '' }: PostcodeCoverageLookupProps) {
  const [postcode, setPostcode] = useState('');
  const [result, setResult] = useState<PostcodeAreaMatch | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;
    const match = lookupPostcodeCoverage(postcode);
    setResult(match);
    setSearched(true);
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-sm p-6 sm:p-8 text-white relative overflow-hidden shadow-subtle ${className}`}>
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-brand-pink" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-pink-light font-light">
            UK POSTCODE COVERAGE CHECKER
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extralight text-white tracking-tight">
          Verify Facilities Management &amp; Engineering Coverage for Your Estate
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Enter your site postcode (e.g. <span className="font-mono text-white">EC2A</span>, <span className="font-mono text-white">M17</span>, <span className="font-mono text-white">S9</span>, <span className="font-mono text-white">B3</span>, <span className="font-mono text-white">LS1</span>, <span className="font-mono text-white">DE24</span>) to check available engineering disciplines, response parameters, and regional delivery hubs.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={postcode}
              onChange={(e) => {
                setPostcode(e.target.value);
                if (searched) setSearched(false);
              }}
              placeholder="Enter commercial site postcode..."
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-sm text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-pink transition-colors font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-pink hover:bg-brand-pink-dark text-white text-xs font-normal uppercase tracking-wider rounded-sm transition-colors shadow-sm shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Check Coverage</span>
          </button>
        </form>

        {/* Result Area */}
        {searched && (
          <div className="mt-6 pt-6 border-t border-slate-800 animate-fadeIn">
            {result ? (
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-mono font-light text-emerald-400 uppercase tracking-wider">
                        Full Active Coverage Confirmed
                      </span>
                    </div>
                    <h4 className="text-base font-light text-white mt-1">
                      {result.name} ({result.region})
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-sm self-start sm:self-auto">
                    Hub: {result.cityName}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                    Available Engineering &amp; FM Services:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.servicesAvailable.map((svc, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1 text-[11px] bg-slate-800/90 text-slate-200 border border-slate-700/60 px-2.5 py-1 rounded-sm"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{svc}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={result.primaryRoute}
                      className="inline-flex items-center gap-1 text-xs font-normal text-brand-pink-light hover:text-white uppercase tracking-wider transition-colors"
                    >
                      <span>Explore {result.cityName} Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {result.cleaningRoute && (
                      <Link
                        href={result.cleaningRoute}
                        className="inline-flex items-center gap-1 text-xs font-normal text-slate-400 hover:text-white uppercase tracking-wider transition-colors"
                      >
                        <span>Local Cleaning</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>

                  <a
                    href={CONTACT_CONFIG.mainPhone.href}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-mono"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-pink-light" />
                    <span>{CONTACT_CONFIG.mainPhone.display}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-sm space-y-2 text-left">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-normal uppercase tracking-wider">
                  <span>National Mobile Coverage Enquiries</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We provide nationwide commercial facilities management and planned maintenance across England and Wales. For specialised or multi-site estates outside primary conurbations, contact our operations desk directly on{' '}
                  <a href={CONTACT_CONFIG.mainPhone.href} className="text-brand-pink-light font-light underline">
                    {CONTACT_CONFIG.mainPhone.display}
                  </a>{' '}
                  or request a site survey proposal.
                </p>
                <div className="pt-2">
                  <Link
                    href="#enquiry"
                    className="inline-flex items-center gap-1.5 text-xs font-normal uppercase tracking-wider text-brand-pink-light hover:text-white"
                  >
                    <span>Request National Estate Survey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
