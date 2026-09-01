import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Wrench, 
  Flame, 
  Wind, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Factory, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  FileText, 
  Clock, 
  Cpu, 
  Layers, 
  Truck, 
  Building,
  GraduationCap,
  Hotel,
  Activity,
  ShoppingBag
} from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';

interface ServiceCardItem {
  title: string;
  category: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

interface SectorCardItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  imageKey?: string;
}

interface DistrictItem {
  name: string;
  note: string;
}

/**
 * 4. SERVICES WE PROVIDE IN [LOCATION]
 * Tailored interactive service grid with edge lighting and deep local links
 */
export function LocationServiceGrid({
  city,
  services,
}: {
  city: string;
  services?: ServiceCardItem[];
}) {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');

  const defaultServices: ServiceCardItem[] = [
    {
      title: 'Mechanical & Electrical (M&E)',
      category: 'Hard FM',
      description: `Qualified M&E engineers providing HVAC, power distribution, lighting and plant maintenance across ${city}.`,
      href: '/mechanical-electrical',
      icon: <Cpu className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'Planned Preventative Maintenance (PPM)',
      category: 'Compliance',
      description: `SFG20 maintenance scheduling, statutory testing and digital compliance calendars for ${city} estates.`,
      href: '/ppm',
      icon: <ShieldCheck className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'HVAC & Air Conditioning',
      category: 'Engineering',
      description: `Commercial chiller, AHU and heat pump maintenance, F-Gas compliance and emergency cooling support in ${city}.`,
      href: '/hvac-contractor',
      icon: <Wind className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'Commercial & Office Cleaning',
      category: 'Soft FM',
      description: `Contract daily cleaning, daytime janitorial and specialist hygiene services tailored to ${city} workplaces.`,
      href: `/commercial-cleaning-${citySlug}`.match(/london|manchester|birmingham|sheffield|leeds|lincoln/) 
        ? `/commercial-cleaning-${citySlug}` 
        : '/commercial-cleaning',
      icon: <Sparkles className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'Industrial & Deep Cleaning',
      category: 'Specialist',
      description: `Factory, warehouse, high-level and builders cleans for manufacturing and logistics facilities in ${city}.`,
      href: `/industrial-cleaning-${citySlug}`.match(/london|manchester|birmingham|sheffield|leeds|lincoln/)
        ? `/industrial-cleaning-${citySlug}`
        : '/industrial-cleaning',
      icon: <Factory className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'Building Fabric & Fabric Repairs',
      category: 'Fabric Maintenance',
      description: `Roofing, joinery, glazing, masonry and minor works maintaining structural integrity and presentation across ${city}.`,
      href: '/building-maintenance',
      icon: <Building2 className="w-5 h-5 text-brand-pink" />,
    },
  ];

  const displayServices = services && services.length > 0 ? services : defaultServices;

  return (
    <section className="section-padding bg-brand-surface border-t border-brand-edge">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <span className="badge-technical">Service Capabilities</span>
            <h2 className="text-display-md text-brand-graphite mt-3">
              Services We Provide in {city}
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Consolidated facilities engineering and specialist support delivered under one accountable contract across {city} and surrounding regions.
            </p>
          </div>
          <Link
            href="/services"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm font-normal text-brand-graphite hover:text-brand-pink transition-colors group"
          >
            <span>Explore all services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((svc, idx) => (
            <Link
              key={idx}
              href={svc.href}
              className="p-8 bg-white border border-brand-edge rounded-sm hover:border-brand-pink hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-sm bg-brand-pink/10 flex items-center justify-center">
                    {svc.icon}
                  </div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-light">
                    {svc.category}
                  </span>
                </div>
                <h3 className="text-xl font-light text-brand-graphite group-hover:text-brand-pink transition-colors">
                  {svc.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {svc.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-edge/60 flex items-center justify-between text-xs font-normal text-brand-graphite group-hover:text-brand-pink">
                <span>View {city} Specification</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-pink" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 5. SECTORS WE SUPPORT IN [LOCATION]
 * Location-specific sector mix
 */
export function LocationSectorGrid({
  city,
  sectors,
}: {
  city: string;
  sectors?: string[];
}) {
  const defaultSectors: SectorCardItem[] = [
    {
      title: 'Commercial Offices & Corporate HQ',
      description: `Multi-tenant office towers, business parks and headquarters across ${city} with concierge, M&E and planned maintenance.`,
      href: '/commercial-facilities-management',
      icon: <Building className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'Industrial & Manufacturing',
      description: `Heavy industrial plant, advanced engineering works and production environments requiring high-uptime M&E in ${city}.`,
      href: '/industrial-facilities-management',
      icon: <Factory className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'Logistics, Warehousing & Distribution',
      description: `High-bay automated warehouses, freight depots and distribution hubs along regional transport corridors.`,
      href: '/logistics-facilities-management',
      icon: <Truck className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'Retail Parks & Shopping Centres',
      description: `High-footfall shopping destinations and retail campuses across ${city} requiring public-realm cleaning and statutory safety.`,
      href: '/retail-facilities-management',
      icon: <ShoppingBag className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'Education & Higher Learning',
      description: `Colleges, university campus buildings and student accommodation portfolios with summer turnaround maintenance in ${city}.`,
      href: '/education-facilities-management',
      icon: <GraduationCap className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'Hotels, Hospitality & Leisure',
      description: `Hotels, venues and leisure complexes with strict guest comfort requirements, 24/7 HVAC and kitchen extraction.`,
      href: '/hotel-facilities-management',
      icon: <Hotel className="w-5 h-5 text-brand-pink" />,
    },
  ];

  return (
    <section className="section-padding bg-white border-t border-brand-edge">
      <div className="container-wide">
        <div className="max-w-2xl mb-12">
          <span className="badge-technical">Sector Expertise</span>
          <h2 className="text-display-md text-brand-graphite mt-3">
            Sectors We Support in {city}
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Delivering statutory compliance, asset reliability and responsive service tailored to the specific operational demands of {city}&apos;s commercial property mix.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultSectors.map((sector, idx) => (
            <Link
              key={idx}
              href={sector.href}
              className="p-8 bg-brand-surface border border-brand-edge rounded-sm hover:border-brand-pink hover:bg-white transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-sm bg-brand-pink/10 flex items-center justify-center">
                  {sector.icon}
                </div>
                <h3 className="text-xl font-light text-brand-graphite group-hover:text-brand-pink transition-colors">
                  {sector.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {sector.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-edge/60 flex items-center justify-between text-xs font-normal text-brand-graphite group-hover:text-brand-pink">
                <span>View Sector Capability</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-pink" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 8. AREAS WE COVER ACROSS [REGION]
 * Grid of commercial districts and regional travel patterns
 */
export function LocationCoverageGrid({
  city,
  region,
  districts,
  travelPattern,
}: {
  city: string;
  region?: string;
  districts?: DistrictItem[];
  travelPattern?: string;
}) {
  if (!districts || districts.length === 0) return null;

  return (
    <section className="section-padding bg-brand-surface border-t border-brand-edge">
      <div className="container-wide">
        <div className="max-w-2xl mb-12">
          <span className="badge-technical">Regional Coverage</span>
          <h2 className="text-display-md text-brand-graphite mt-3">
            Areas We Cover Across {city}
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            {travelPattern || `Mobile engineering teams and specialist support operating throughout ${city} and ${region || 'the wider region'}.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {districts.map((d, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-brand-edge rounded-sm space-y-2.5 hover:border-brand-pink/60 transition-colors"
            >
              <div className="flex items-center gap-2 text-brand-pink">
                <MapPin className="w-4 h-4 shrink-0" />
                <h3 className="font-normal text-sm text-brand-graphite">{d.name}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{d.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 10. WHY BUSINESSES IN [LOCATION] USE ENTIREFM
 * High-impact commercial value proposition cards
 */
export function WhyChooseLocationGrid({ city }: { city: string }) {
  const pillars = [
    {
      title: 'Single Accountable Contract',
      description: `Consolidate M&E, HVAC, statutory compliance, cleaning and reactive repairs across ${city} under one provider, removing gaps between fragmented suppliers.`,
      icon: <Layers className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'Direct Engineering Delivery',
      description: `Qualified mobile engineers and technical specialists equipped for planned preventative maintenance and contracted out-of-hours response in ${city}.`,
      icon: <Wrench className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'SFG20 & Digital Compliance',
      description: `Every maintenance schedule is built from a site asset survey. Test certificates, compliance logs and audit evidence are held centrally in our CAFM platform.`,
      icon: <FileText className="w-5 h-5 text-brand-pink" />,
    },
    {
      title: 'Contracted Response Targets',
      description: `Response times agreed per site by priority band and criticality across ${city}, ensuring emergency plant breakdowns receive urgent attention.`,
      icon: <Clock className="w-5 h-5 text-brand-pink" />,
    },
  ];

  return (
    <section className="section-padding bg-white border-t border-brand-edge">
      <div className="container-wide">
        <div className="max-w-2xl mb-12">
          <span className="badge-technical">Commercial Advantage</span>
          <h2 className="text-display-md text-brand-graphite mt-3">
            Why Businesses in {city} Choose EntireFM
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            A facilities partner that understands the operational realities of {city} commercial estates — protecting asset value, ensuring statutory safety, and reducing administrative friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 bg-brand-surface border border-brand-edge rounded-sm space-y-4 hover:border-brand-pink transition-colors"
            >
              <div className="w-10 h-10 rounded-sm bg-brand-pink/10 flex items-center justify-center">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-light text-brand-graphite">{pillar.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
