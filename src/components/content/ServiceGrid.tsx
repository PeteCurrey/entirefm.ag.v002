import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench, Wind, ShieldAlert, Sparkles, Building, Layers, Truck, Cpu } from 'lucide-react';

export function ServiceGrid() {
  const services = [
    {
      title: 'Mechanical & Electrical (M&E)',
      path: '/mechanical-electrical',
      desc: 'Complete building mechanical and electrical services including power distribution, lighting systems, switchgear, and statutory compliance.',
      icon: Wrench,
      category: 'Hard FM',
      features: ['HV & LV Distribution', 'Emergency Lighting Testing', 'Access Control Integration'],
    },
    {
      title: 'HVAC & Air Conditioning',
      path: '/hvac-contractor',
      desc: 'Commercial heating, ventilation, VRV/VRF air conditioning maintenance, chiller servicing, and F-Gas compliance management.',
      icon: Wind,
      category: 'Hard FM',
      features: ['TM44 Inspections', 'F-Gas Log Maintenance', 'AHU & Ductwork Servicing'],
    },
    {
      title: 'Planned Maintenance (PPM)',
      path: '/ppm',
      desc: 'Structured preventative maintenance schedules aligned with SFG20 standards to protect building assets and maintain manufacturer warranties.',
      icon: ShieldAlert,
      category: 'Hard FM',
      features: ['SFG20 Scheduling', 'Digital Asset Tagging', 'Statutory Compliance Audits'],
    },
    {
      title: 'Industrial Cleaning',
      path: '/industrial-cleaning',
      desc: 'Heavy-duty industrial cleaning, factory shutdowns, high-level structural cleaning, de-greasing, and manufacturing plant hygiene.',
      icon: Sparkles,
      category: 'Specialist Cleaning',
      features: ['Confined Space Entry', 'Factory Deep Cleans', 'High-Level Access Cleaning'],
    },
    {
      title: 'Commercial Cleaning',
      path: '/cleaning-services',
      desc: 'Daily office cleaning, commercial floor maintenance, washroom replenishment, and scheduled sanitisation across corporate estates.',
      icon: Building,
      category: 'Soft FM',
      features: ['Daily Contract Cleans', 'COSHH Compliant', 'DBS-Checked Staff'],
    },
    {
      title: 'Specialist Crane & Access Hire',
      path: '/mobile-crane-hire',
      desc: 'Truck-mounted mobile cranes and specialist Böcker hoists for rooftop plant replacement, HVAC installation, and high-level lifts.',
      icon: Truck,
      category: 'Specialist Engineering',
      features: ['CPA Contract Lifts', 'Appointed Person Supervision', 'Compact Urban Setup'],
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="badge-technical">Direct Engineering & Operations</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-navy mt-2">
              Integrated Facilities Management Capabilities
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-1">
              Delivering full-spectrum estate maintenance through self-delivered technical teams and dedicated 24/7 helpdesk management.
            </p>
          </div>
          <Link href="/services" className="text-xs font-bold text-brand-charcoal hover:text-brand-gold flex items-center gap-1.5 shrink-0 border-b border-brand-charcoal hover:border-brand-gold pb-0.5 transition-colors">
            View All Services Hub <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.path} className="p-6 bg-brand-surface border border-brand-border rounded-sm hover:border-brand-gold/60 transition-all flex flex-col justify-between group shadow-subtle">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-brand-slate bg-white px-2 py-1 border border-brand-border rounded-sm">
                      {s.category}
                    </span>
                    <Icon className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-gold-dark transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {s.desc}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-mono mb-6 pt-3 border-t border-brand-border/60">
                    {s.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-brand-gold rounded-full"></span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={s.path} className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy group-hover:text-brand-gold transition-colors pt-2 border-t border-brand-border">
                  <span>Explore Service Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectorGrid() {
  const sectors = [
    { title: 'Industrial & Manufacturing', path: '/industrial-facilities-management', desc: 'Heavy engineering plant rooms, production lines, 24/7 uptime requirements, and high-hazard safety protocols.' },
    { title: 'Commercial & Corporate Offices', path: '/commercial-facilities-management', desc: 'Prime office towers, multi-tenanted commercial estates, executive HVAC management, and concierge services.' },
    { title: 'Logistics & Warehousing', path: '/logistics-facilities-management', desc: 'High-bay distribution centres, dock leveller maintenance, fast-turnaround PPM, and warehouse floor care.' },
    { title: 'Retail Parks & Shopping Arenas', path: '/retail-facilities-management', desc: 'High-footfall customer environments, emergency lighting, reactive maintenance, and public area cleaning.' },
    { title: 'Education & Universities', path: '/education-facilities-management', desc: 'Multi-building university campuses, term-time maintenance schedules, statutory compliance, and DBS-vetted staff.' },
    { title: 'Healthcare & Clinical', path: '/healthcare-facilities-management', desc: 'Stringent clinical hygiene standards, backup power generator testing, and critical medical environment compliance.' },
  ];

  return (
    <section className="section-padding bg-brand-surface border-y border-brand-border">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="badge-technical">Specialist Environments</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-navy mt-2">
              Sector-Specific Facilities Engineering
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-1">
              Every building sector presents unique regulatory, operational, and asset lifecycle challenges.
            </p>
          </div>
          <Link href="/sectors" className="text-xs font-bold text-brand-charcoal hover:text-brand-gold flex items-center gap-1.5 shrink-0 border-b border-brand-charcoal hover:border-brand-gold pb-0.5 transition-colors">
            View All 15+ Sectors Hub <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map(sec => (
            <div key={sec.path} className="p-6 bg-white border border-brand-border rounded-sm hover:border-brand-gold/60 transition-all flex flex-col justify-between shadow-subtle group">
              <div>
                <h3 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-gold-dark transition-colors">
                  {sec.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {sec.desc}
                </p>
              </div>
              <Link href={sec.path} className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy group-hover:text-brand-gold transition-colors pt-3 border-t border-brand-border">
                <span>View Sector Framework</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LocationGrid() {
  const locations = [
    { city: 'London', path: '/fm-london', altPath: '/facilities-management-london', subtitle: 'Greater London & All Zones' },
    { city: 'Manchester', path: '/facilities-management-manchester', altPath: '/fm-manchester', subtitle: 'Greater Manchester & North West' },
    { city: 'Birmingham', path: '/facilities-management-birmingham', altPath: '/fm-birmingham', subtitle: 'West Midlands & Central UK' },
    { city: 'Sheffield', path: '/facilities-management-sheffield', altPath: '/fm-sheffield', subtitle: 'South Yorkshire Engineering Hub' },
    { city: 'Leeds', path: '/facilities-management-leeds', altPath: '/fm-leeds', subtitle: 'West Yorkshire & M62 Corridor' },
    { city: 'Lincoln', path: '/facilities-management-lincoln', altPath: '/lincoln-facilities-management', subtitle: 'East Midlands Regional Base' },
    { city: 'Liverpool', path: '/facilities-management-liverpool', altPath: '/fm-liverpool', subtitle: 'Merseyside & Coastal Operations' },
    { city: 'Chesterfield', path: '/facilities-management-chesterfield', altPath: '/chesterfield-facilities-management', subtitle: 'Derbyshire & Peak District' },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="badge-technical">National Reach</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-navy mt-2">
              Regional Operating Centres & City FM Hubs
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-1">
              Direct mobile engineering fleets operating from regional depots across all primary commercial centres.
            </p>
          </div>
          <Link href="/locations" className="text-xs font-bold text-brand-charcoal hover:text-brand-gold flex items-center gap-1.5 shrink-0 border-b border-brand-charcoal hover:border-brand-gold pb-0.5 transition-colors">
            View All 22+ Locations Hub <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {locations.map(loc => (
            <div key={loc.city} className="p-5 bg-brand-surface border border-brand-border rounded-sm hover:border-brand-gold transition-colors flex flex-col justify-between shadow-subtle">
              <div>
                <span className="text-xs font-mono uppercase text-brand-gold font-semibold block">{loc.subtitle}</span>
                <h3 className="text-base font-bold text-brand-navy mt-1">{loc.city} FM Centre</h3>
              </div>
              <div className="pt-3 border-t border-brand-border mt-3 space-y-1 text-xs">
                <Link href={loc.path} className="text-brand-charcoal hover:text-brand-gold font-semibold block">
                  → Primary Operations Hub
                </Link>
                {loc.altPath && (
                  <Link href={loc.altPath} className="text-slate-500 hover:text-brand-gold block">
                    → Planned Maintenance & Total FM
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
