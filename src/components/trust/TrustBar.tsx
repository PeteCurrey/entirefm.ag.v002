import React from 'react';
import { Clock, ShieldCheck, Building, Layers, CheckCircle2 } from 'lucide-react';
import { getVerifiedAccreditations } from '@/config/verified-claims';

/**
 * TRUST BAR
 * =========
 * A narrow band beneath the hero stating what EntireFM is, in four facts.
 * Deliberately quiet — it sits between the hero and the first content section
 * and should read as a caption, not a second headline.
 */

const FACTS = [
  { label: 'Response', value: 'Out-of-hours cover', icon: Clock },
  { label: 'Compliance', value: 'Statutory testing & records', icon: ShieldCheck },
  { label: 'Estates', value: 'Commercial & industrial', icon: Building },
  { label: 'Scope', value: 'Hard & soft services', icon: Layers },
];

export function TrustBar() {
  return (
    <div className="border-b border-brand-edge bg-white">
      <div className="container-custom">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-6 py-7 lg:grid-cols-4">
          {FACTS.map((fact) => {
            const Icon = fact.icon;
            return (
              <li key={fact.label} className="group flex items-start gap-3.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-brand-edge bg-brand-surface text-brand-silver transition-all duration-500 ease-brand group-hover:border-brand-electric/40 group-hover:text-brand-electric">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="eyebrow">{fact.label}</span>
                  <span className="mt-1.5 block text-[13.5px] font-semibold leading-snug text-brand-graphite">
                    {fact.value}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/**
 * GOVERNANCE RAIL
 * ===============
 * Accreditations render only once /config/verified-claims.json marks them
 * VERIFIED. Until then this shows how compliance is managed rather than
 * asserting membership of schemes we cannot yet evidence — which is why the
 * fallback describes process, not credentials.
 *
 * The previous fallback claimed a "certified mobile engineering fleet";
 * certification is exactly what is unverified, so that wording is gone.
 */

const GOVERNANCE = [
  {
    title: 'Statutory compliance management',
    body: 'Periodic testing, maintenance schedules and digital compliance archiving across building services, held in one calendar rather than spread between suppliers.',
  },
  {
    title: 'Named engineering accountability',
    body: 'A named account manager and a defined escalation route, so an issue has an owner rather than a queue.',
  },
  {
    title: 'Digital service logging',
    body: 'Service desk ticketing, PPM completion tracking and job sign-off documentation available to the client, not just to us.',
  },
];

export function AccreditationRail() {
  const verified = getVerifiedAccreditations();

  return (
    <section className="on-dark grain relative overflow-hidden border-y border-brand-edge-dark bg-brand-carbon">
      <div className="facet-rule pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-custom relative py-14">
        <div className="mb-9 flex flex-col gap-3 md:flex-row md:items-end md:justify-between" data-reveal>
          <div>
            <p className="eyebrow eyebrow-dark">Operational compliance</p>
            <h2 className="mt-4 text-display-sm text-white">
              Contractor compliance &amp; trade standards
            </h2>
          </div>
          <p className="max-w-md text-[13px] leading-relaxed text-brand-mist/50">
            Specialist trade works delivered exclusively by certified, accredited contractor partners across gas, electrical, and HVAC.
          </p>
        </div>

        {verified.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {verified.map((acc, i) => (
              <li
                key={acc.id}
                className="edge-lit flex flex-col justify-between rounded-sm border border-brand-edge-dark bg-brand-graphite/70 p-4"
                data-reveal
                style={{ '--reveal-delay': `${i * 50}ms` } as React.CSSProperties}
              >
                <div>
                  <span className="eyebrow eyebrow-dark">{acc.category}</span>
                  <span className="mt-2 block text-[13px] font-semibold text-white">{acc.claim}</span>
                  {acc.approvedWording && (
                    <p className="mt-1 text-[11.5px] text-brand-mist/50 leading-snug">{acc.approvedWording}</p>
                  )}
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Compliance Standard
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {GOVERNANCE.map((item, i) => (
              <li
                key={item.title}
                className="edge-lit rounded-sm border border-brand-edge-dark bg-brand-graphite/70 p-6"
                data-reveal
                style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
              >
                <h3 className="text-[14px] font-semibold text-white">{item.title}</h3>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-brand-mist/55">{item.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
