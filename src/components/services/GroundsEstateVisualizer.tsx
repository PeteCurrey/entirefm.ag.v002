'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trees, Snowflake, CloudRain, ShieldCheck, CheckCircle2, Leaf, Activity } from 'lucide-react';

interface GroundsRealm {
  id: string;
  code: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  deliverables: string[];
  statutoryStandard: string;
  seasonalSchedule: string;
}

const GROUNDS_REALMS: GroundsRealm[] = [
  {
    id: 'horticultural-care',
    code: 'REALM 01',
    name: 'Horticultural Grounds & Landscape Care',
    category: 'ESTATE CURATION & FIRST IMPRESSIONS',
    tagline: 'Precision turf mowing, shrub bed cultivation, and floral presentation.',
    description: 'Commercial ride-on flail and rotary mowing across business parks, multi-acre lawns, shrub bed edging, bark mulch replenishment, mechanical hedge trimming, and selective herbicide weed control.',
    imageSrc: '/images/editorial/entirefm-totem-headquarters-2000w.webp',
    imageAlt: 'EntireFM commercial business park grounds maintenance and landscaped entrance',
    deliverables: [
      'Fortnightly Commercial Ride-On Lawn Mowing & Strimming',
      'Shrub Pruning, Deadheading & Soil Mulch Top-Dressing',
      'High-Level Hedge Trimming & Perimeter Shrub Reduction',
      'Seasonal Bedding Displays & Bulb Planting Schemes',
    ],
    statutoryStandard: 'BALI (British Association of Landscape Industries) Standards',
    seasonalSchedule: 'Spring / Summer Weekly & Autumn Monthly Frequency',
  },
  {
    id: 'arboricultural-surveys',
    code: 'REALM 02',
    name: 'Tree Surgery & Arboricultural Surveys',
    category: 'SAFETY & TREE HEALTH MANAGEMENT',
    tagline: 'Certified tree risk audits, crown reduction, and 24/7 storm clearance.',
    description: 'NPTC-certified arborists conduct periodic Visual Tree Assessments (VTA), deadwood extraction, crown thinning, root protection audits, and 24/7 emergency response for wind-damaged or fallen timber.',
    imageSrc: '/images/locations/sheffield/facilities-management-sheffield-rooftop-plant-checks-1600w.webp',
    imageAlt: 'EntireFM tree and high-level grounds surveying on commercial estate',
    deliverables: [
      'Comprehensive BS 5837 Arboricultural Hazard Surveys',
      'Crown Thinning, Lifting & Deadwood Removal',
      'Precision Dismantling & Sectional Tree Felling',
      '24/7 Emergency Storm Damage Attendance & Chipping',
    ],
    statutoryStandard: 'BS 3998:2010 Tree Work Recommendations & Wildlife Act 1981',
    seasonalSchedule: 'Annual Risk Audits & Winter Pruning Windows',
  },
  {
    id: 'winter-gritting',
    code: 'REALM 03',
    name: 'Proactive Winter Gritting & Snow Clearance',
    category: 'SAFETY & BUSINESS CONTINUITY',
    tagline: 'Automated Met Office RST temperature triggers and proactive evening gritting.',
    description: 'Automated telemetry monitoring Road Surface Temperature (RST) triggers proactive out-of-hours gritting of estate access roads, HGV logistics yards, and pedestrian footpaths before ice forms.',
    imageSrc: '/images/editorial/entirefm-entirefm-premises-vans-2000w.webp',
    imageAlt: 'EntireFM winter gritting response fleet equipped for snow clearance',
    deliverables: [
      'Automated RST Met Office Weather Feed Triggering (≤0°C)',
      'Marine-Grade Pure White Salt Spreading (Zero Interior Residue)',
      'Mechanical Snow Ploughing on HGV Delivery Bays & Yards',
      'GPS-Tracked Spreaders Generating Timestamped Evidence Logs',
    ],
    statutoryStandard: 'Occupiers’ Liability Act 1957 & Highways Code of Practice',
    seasonalSchedule: 'October to April 24/7 Monitored Standby',
  },
  {
    id: 'paving-drainage',
    code: 'REALM 04',
    name: 'Hard Landscaping, Interceptors & Gully Jetting',
    category: 'INFRASTRUCTURE & STORMWATER',
    tagline: 'Car park line marking, oil-water interceptors, and stormwater clearance.',
    description: 'High-pressure petrol jet-washing of block paving, commercial car park bay re-lining, bi-annual oil-water separator interceptor pumping, and vacuum tanker stormwater gully clearance to prevent flooding.',
    imageSrc: '/images/locations/derby/facilities-management-derby-cathedral-quarter-1600w.webp',
    imageAlt: 'EntireFM commercial exterior paving maintenance and pressure jetting',
    deliverables: [
      'Rotary Surface Pressure Washing on Flagged & Tarmac Areas',
      'Stormwater Gully Silt Vacuuming & High-Volume Jetting',
      'Oil/Water Interceptor Tank Emptying & Duty of Care Records',
      'Thermo-Plastic Carpark Bay & Directional Arrow Lining',
    ],
    statutoryStandard: 'Environment Agency Pollution Prevention Guidelines (PPG3)',
    seasonalSchedule: 'Bi-Annual Interceptor Service & Spring Deep Wash',
  },
  {
    id: 'biodiversity-esg',
    code: 'REALM 05',
    name: 'Biodiversity Enhancement & ESG Stewardship',
    category: 'SUSTAINABILITY & ESG ACCREDITATION',
    tagline: 'Native wildflower meadows, green roof care, and zero-peat cultivation.',
    description: 'Partnering with commercial property managers to elevate GRESB and BREEAM sustainability ratings. Establishing native pollinator corridors, bird/bat box networks, living green wall care, and 100% peat-free grounds operations.',
    imageSrc: '/images/editorial/entirefm-totem-headquarters-2000w.webp',
    imageAlt: 'EntireFM sustainability and biodiversity landscaped estate',
    deliverables: [
      'Native Wildflower Meadow Seeding & Management',
      'Bird, Bat & Pollinator Habitat Box Audits',
      'Sedum & Intensive Living Green Roof Maintenance',
      '100% Peat-Free Composts & On-Site Green Waste Composting',
    ],
    statutoryStandard: 'Environment Act 2021 Biodiversity Net Gain (BNG) Guidance',
    seasonalSchedule: 'Continuous Year-Round Environmental Plan',
  },
];

export function GroundsEstateVisualizer() {
  const [activeId, setActiveId] = useState<string>('winter-gritting');
  const active = GROUNDS_REALMS.find((r) => r.id === activeId) || GROUNDS_REALMS[2];

  return (
    <section className="py-20 lg:py-28 bg-[#09111F] text-white relative overflow-hidden border-t border-white/[0.06]">
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-electric/10 border border-brand-electric/30 mb-4">
            <Trees className="w-3.5 h-3.5 text-brand-electric-bright" />
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-brand-electric-bright">
              EXTERIOR REALM & GROUNDS GOVERNANCE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white tracking-tight leading-[1.15]">
            Estate Grounds & External Realm Management
          </h2>
          <p className="mt-4 text-sm sm:text-base text-brand-mist/75 font-light leading-relaxed">
            The external presentation, pedestrian safety, and environmental compliance of your commercial estate define first impressions. Explore our complete four-season grounds management and winter risk mitigation architecture.
          </p>
        </div>

        {/* 5-Realm Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10">
          {GROUNDS_REALMS.map((item) => {
            const isSelected = item.id === active.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`text-left p-3.5 sm:p-4 rounded-md transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white/[0.08] border-brand-electric/60 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[11px] font-mono ${isSelected ? 'text-brand-electric-bright' : 'text-brand-mist/40'}`}>
                    {item.code}
                  </span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-brand-electric-bright animate-pulse" />}
                </div>
                <span className={`text-xs sm:text-sm font-light leading-snug line-clamp-2 ${isSelected ? 'text-white font-normal' : 'text-brand-mist/70'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Card */}
        <div className="bg-[#060C16] border border-white/[0.08] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Image */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden">
              <Image
                src={active.imageSrc}
                alt={active.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060C16] via-[#060C16]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#060C16]" />

              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-sm border border-white/10 flex items-center justify-between">
                <span className="text-[10.5px] font-mono text-brand-electric-bright uppercase tracking-wider">
                  {active.category}
                </span>
                <span className="text-[10px] font-light text-brand-mist/70">
                  BALI & ISO 14001 Standards
                </span>
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-brand-electric-bright px-2 py-0.5 rounded-xs bg-brand-electric/15 border border-brand-electric/30">
                    {active.code}
                  </span>
                  <span className="text-xs font-light text-brand-mist/50 uppercase tracking-wider">
                    {active.category}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white leading-snug">
                  {active.name}
                </h3>

                <p className="text-sm sm:text-base font-light text-brand-mist/85 leading-relaxed">
                  {active.description}
                </p>
              </div>

              {/* Deliverables */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-brand-mist/50 block">
                  Operational Standards & Tasks:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {active.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-sm bg-white/[0.03] border border-white/[0.05]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-electric-bright shrink-0 mt-0.5" />
                      <span className="text-xs font-light text-white/90 leading-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standards & Seasonal Schedule */}
              <div className="pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10.5px] font-mono text-brand-mist/50 uppercase tracking-wider block">
                    Statutory / Industry Standard
                  </span>
                  <p className="text-xs font-normal text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {active.statutoryStandard}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10.5px] font-mono text-brand-mist/50 uppercase tracking-wider block">
                    Seasonal Frequency
                  </span>
                  <p className="text-xs font-normal text-brand-mist/90 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-brand-electric-bright shrink-0" />
                    {active.seasonalSchedule}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
