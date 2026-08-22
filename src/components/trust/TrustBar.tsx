import React from 'react';
import { ShieldCheck, Clock, Award, Building, Wrench, CheckCircle2 } from 'lucide-react';

export function TrustBar() {
  return (
    <div className="border-y border-brand-border bg-brand-surface py-5">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-mono uppercase tracking-wider text-slate-500">Response & Helpdesk</span>
              <span className="text-sm font-bold text-brand-charcoal">24/7 National Operations</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-mono uppercase tracking-wider text-slate-500">Compliance & Safety</span>
              <span className="text-sm font-bold text-brand-charcoal">Multi-Discipline Engineering</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-mono uppercase tracking-wider text-slate-500">Estate Management</span>
              <span className="text-sm font-bold text-brand-charcoal">Commercial & Industrial</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-mono uppercase tracking-wider text-slate-500">Delivery Model</span>
              <span className="text-sm font-bold text-brand-charcoal">Direct Engineering & Tech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { getVerifiedAccreditations } from '@/config/verified-claims';

export function AccreditationRail() {
  const verifiedAccreditations = getVerifiedAccreditations();

  return (
    <div className="bg-brand-charcoal border-y border-brand-border-dark py-8 text-slate-300">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <span className="badge-gold">Operational Governance</span>
            <h3 className="text-lg font-bold text-white mt-1">Compliance Management & Quality Framework</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Structured preventative maintenance & digital audit records</span>
        </div>

        {verifiedAccreditations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {verifiedAccreditations.map(acc => (
              <div key={acc.id} className="p-3 bg-brand-navy/60 border border-brand-border-dark/80 rounded-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">{acc.category}</span>
                  <span className="text-xs font-bold text-white mt-1 block">{acc.claim}</span>
                </div>
                <span className="text-[9px] text-brand-gold mt-2 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-brand-navy/60 border border-brand-border-dark/80 rounded-sm">
              <span className="text-xs font-bold text-white block mb-1">Statutory Compliance Management</span>
              <p className="text-xs text-slate-400">Periodic testing, maintenance schedules, and digital compliance archiving across building services.</p>
            </div>
            <div className="p-4 bg-brand-navy/60 border border-brand-border-dark/80 rounded-sm">
              <span className="text-xs font-bold text-white block mb-1">Direct Engineering Accountability</span>
              <p className="text-xs text-slate-400">Certified mobile engineering fleet and dedicated account managers providing transparent site reporting.</p>
            </div>
            <div className="p-4 bg-brand-navy/60 border border-brand-border-dark/80 rounded-sm">
              <span className="text-xs font-bold text-white block mb-1">Digital CAFM Service Logging</span>
              <p className="text-xs text-slate-400">Live service desk ticketing, PPM completion tracking, and instant job signoff documentation.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
