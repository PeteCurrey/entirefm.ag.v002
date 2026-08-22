import React from 'react';
import { Building2, Award, Clock, ShieldCheck, CheckCircle } from 'lucide-react';

export function StatBlock() {
  const stats = [
    { label: 'FM & Maintenance Coverage', value: 'National', subtext: 'Regional engineering hubs across UK', icon: Building2 },
    { label: 'Helpdesk & Emergency Response', value: '24/7/365', subtext: 'Rapid callout dispatch & SLA tracking', icon: Clock },
    { label: 'Delivery Model', value: 'Self-Delivered', subtext: 'Direct engineering & specialist teams', icon: Award },
    { label: 'Statutory Compliance', value: '100% Audit-Ready', subtext: 'Full digital CAFM recordkeeping', icon: ShieldCheck },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(item => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="p-6 bg-white border border-brand-border rounded-sm shadow-subtle flex flex-col justify-between hover:border-brand-gold/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">{item.label}</span>
              <Icon className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight block">
                {item.value}
              </span>
              <span className="text-xs text-slate-600 mt-1 block">
                {item.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ClientLogoRail() {
  const sectors = [
    { name: 'Commercial Property Portfolios', note: 'Prime Office & Headquarters' },
    { name: 'Logistics & Distribution Parks', note: 'High-Volume Freight Centres' },
    { name: 'Industrial & Manufacturing Facilities', note: 'Heavy Plant & Engineering' },
    { name: 'Retail Parks & Shopping Arenas', note: 'High-Footfall Estates' },
    { name: 'Education & Public Sector Estates', note: 'Compliance-Critical Campuses' },
  ];

  return (
    <div className="bg-brand-surface border-y border-brand-border py-10">
      <div className="container-custom">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="badge-technical">Estate Experience</span>
          <h3 className="text-xl font-bold text-brand-navy mt-2">Trusted Across Complex Property & Engineering Environments</h3>
          <p className="text-xs text-slate-500 mt-1">
            Proven facilities management frameworks across single sites and nationwide portfolios.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {sectors.map(s => (
            <div key={s.name} className="p-4 bg-white border border-brand-border rounded-sm text-center flex flex-col justify-center items-center shadow-subtle">
              <span className="text-xs font-bold text-brand-charcoal">{s.name}</span>
              <span className="text-[11px] text-slate-500 mt-1">{s.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
