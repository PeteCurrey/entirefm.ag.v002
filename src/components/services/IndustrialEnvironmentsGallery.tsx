'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Factory, Truck, Warehouse, ShieldAlert, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface IndustrialEnvironment {
  id: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  accessMethod: string;
  methods: string[];
}

const ENVIRONMENTS: IndustrialEnvironment[] = [
  {
    id: 'factory-floors',
    name: 'Factory & Assembly Floors',
    category: 'HEAVY MANUFACTURING',
    headline: 'Industrial Degreasing & High-Traffic Floor Scrubbing',
    description: 'Heavy-duty ride-on scrubbing, chemical oil/grease stripping, epoxy resin floor restoration, and demarcation line cleaning for active assembly lines and fabrication plants.',
    imageSrc: '/images/locations/derby/facilities-management-derby-industrial-estate-1600w.webp',
    imageAlt: 'EntireFM industrial team performing heavy floor decontamination and factory maintenance',
    accessMethod: 'Ride-on Scrubber-Dryers & Chemical Degreasers',
    methods: ['Epoxy resin safe non-abrasive degreasing', 'Oil leak containment and spill remediation', 'Walkway demarcation and line sanitisation'],
  },
  {
    id: 'high-level',
    name: 'High-Level Girders & Overhead Cranes',
    category: 'WORKING AT HEIGHTS',
    headline: 'Structural Steelwork, Purlins & Crane Track Vacuuming',
    description: 'Specialist dust and combustible lint extraction from overhead steelwork, roof trusses, crane rails, busbars, and high-bay lighting without interrupting floor-level operations.',
    imageSrc: '/images/locations/sheffield/facilities-management-sheffield-rooftop-plant-checks-1600w.webp',
    imageAlt: 'EntireFM high-level industrial cleaning and crane access team working at height',
    accessMethod: 'IPAF 3a/3b Scissor & Boom Lifts / IRATA Rope Access',
    methods: ['ATEX rated explosion-proof vacuuming', 'Overhead crane rail and gantry clearing', 'High-bay luminaire and cable tray wipe-down'],
  },
  {
    id: 'machinery',
    name: 'Production Lines & Plant Decontamination',
    category: 'SHUTDOWN SERVICES',
    headline: 'Machinery Overhauls & Planned Shutdown Cleans',
    description: 'Concentrated deep cleaning of robotic cells, CNC machine enclosures, stamping presses, conveyors, and automated packaging lines during planned holiday shutdowns.',
    imageSrc: '/images/locations/birmingham/facilities-management-birmingham-industrial-plant-survey-1600w.webp',
    imageAlt: 'EntireFM industrial specialists surveying and deep cleaning plant machinery',
    accessMethod: 'Lock-Out Tag-Out (LOTO) & Dry Ice / Chemical Wash',
    methods: ['Strict Lock-Out/Tag-Out (LOTO) safety protocols', 'Dry ice blasting for sensitive electrical switchgear', 'Conveyor belt and roller residue stripping'],
  },
  {
    id: 'warehousing',
    name: 'Logistics Hubs & High-Bay Warehousing',
    category: 'DISTRIBUTION CENTRES',
    headline: 'Full-Height Racking & VNA Aisle Decontamination',
    description: 'Dust suppression, narrow aisle scrubbing, high-bay racking wipe-downs, and packaging waste clearance across national logistics hubs and e-commerce distribution warehouses.',
    imageSrc: '/images/locations/sheffield/facilities-management-sheffield-industrial-unit-1600w.webp',
    imageAlt: 'EntireFM industrial team managing high-bay logistics warehouse estate',
    accessMethod: 'Very Narrow Aisle (VNA) Machines & High-Reach Lances',
    methods: ['Dust mitigation for high-density pallet racking', 'Polished concrete slip-resistance treatment', 'Dock leveller pit and loading bay degreasing'],
  },
  {
    id: 'external-cladding',
    name: 'External Cladding & Loading Docks',
    category: 'BUILDING FABRIC',
    headline: 'Industrial Cladding Restoration & Dock Shelter Washing',
    description: 'Rotary high-pressure washing of composite cladding panels, gutter clearance, loading bay canopy decontamination, and interceptor drainage maintenance.',
    imageSrc: '/images/locations/derby/facilities-management-derby-cathedral-quarter-1600w.webp',
    imageAlt: 'EntireFM commercial exterior pressure washing and cladding restoration equipment',
    accessMethod: 'Hot-Water Pressure Washers & Truck-Mounted Booms',
    methods: ['Mildew and atmospheric grime removal from cladding', 'Loading dock shelter and bumper sanitisation', 'High-volume gutter vacuuming and downpipe flushing'],
  },
  {
    id: 'plantrooms',
    name: 'Plant Rooms & LEV Extraction Systems',
    category: 'AIR & PUBLIC HEALTH',
    headline: 'Local Exhaust Ventilation (LEV) & Plant Room Cleans',
    description: 'Deep cleaning of mechanical plantrooms, boiler casings, LEV extraction ductwork, spray booth filters, and dust collector hopper decontamination.',
    imageSrc: '/images/locations/nottingham/facilities-management-nottingham-plant-room-maintenance-1600w.webp',
    imageAlt: 'EntireFM team maintaining industrial plantroom and extraction ductwork',
    accessMethod: 'Confined Space Certified Entry & HEPA Extractors',
    methods: ['Ductwork internal degreasing and inspection hatches', 'Boiler and compressor casing wipe-down', 'Confined space entry under formal permit systems'],
  },
];

export function IndustrialEnvironmentsGallery() {
  const [activeEnvId, setActiveEnvId] = useState<string>('factory-floors');
  const activeEnv = ENVIRONMENTS.find(e => e.id === activeEnvId) || ENVIRONMENTS[0];

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              INDUSTRIAL ENVIRONMENTS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900">
            Industrial Environments We Clean
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            From active heavy manufacturing facilities and automated warehouses to high-level structural steelwork and scheduled shutdown plant cleans.
          </p>
        </div>

        {/* Environment Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {ENVIRONMENTS.map((env) => {
            const isActive = env.id === activeEnvId;
            return (
              <button
                key={env.id}
                type="button"
                onClick={() => setActiveEnvId(env.id)}
                className={`p-3.5 rounded-sm border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 border-brand-pink text-white shadow-elevated'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span
                  className={`text-[10px] font-medium block mb-1 uppercase tracking-wider ${
                    isActive ? 'text-brand-pink' : 'text-slate-400'
                  }`}
                >
                  {env.category}
                </span>
                <strong className="text-xs font-normal block leading-snug line-clamp-2">
                  {env.name}
                </strong>
              </button>
            );
          })}
        </div>

        {/* Active Environment Feature */}
        <div className="bg-slate-900 text-white rounded-sm border border-slate-800 overflow-hidden shadow-elevated grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Image */}
          <div className="lg:col-span-6 relative h-72 sm:h-96 lg:h-auto min-h-[22rem]">
            <Image
              src={activeEnv.imageSrc}
              alt={activeEnv.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/40" />
            <div className="absolute top-4 left-4 bg-slate-900/90 text-brand-pink-light border border-white/15 px-3 py-1 text-xs font-normal rounded-sm backdrop-blur-md">
              {activeEnv.category}
            </div>
          </div>

          {/* Right Column: Description & Methods */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs font-normal uppercase tracking-wider text-brand-pink block mb-2">
                SPECIALIST METHODOLOGY
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-white mb-3">
                {activeEnv.headline}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
                {activeEnv.description}
              </p>

              <div className="mb-6 p-3.5 bg-slate-800/80 border border-slate-700/60 rounded-sm">
                <span className="text-[11px] font-medium text-brand-pink-light uppercase tracking-wider block mb-1">
                  Access Equipment & Method
                </span>
                <span className="text-xs font-normal text-white">
                  {activeEnv.accessMethod}
                </span>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800">
                <span className="text-xs font-normal text-slate-400 uppercase tracking-wider block mb-2">
                  Scope Protocols
                </span>
                {activeEnv.methods.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-normal">
              <span>Safety: RAMS & COSHH Assessed</span>
              <span className="text-brand-pink-light font-light">Zero Plant Interruption</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
