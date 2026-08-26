'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Wrench, 
  Cpu, 
  Users, 
  Award, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Leaf
} from 'lucide-react';

interface OperatorPersona {
  id: string;
  category: string;
  badge: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  keyBenefits: string[];
  operationalModel: string;
  onboardingRoute: string;
  targetTrades: string[];
}

const PERSONAS: OperatorPersona[] = [
  {
    id: 'sme-contractors',
    category: 'Regional Specialist SMEs',
    badge: 'CRAFT & TECHNICAL SPECIALISTS',
    tagline: 'High technical craft, fast local response, and deep regional knowledge.',
    description: 'We believe regional craft and specialist engineering SMEs form the backbone of reliable FM. You do not need nationwide depots to work with us—we match you with managed estates in your core operating cities.',
    icon: Wrench,
    keyBenefits: [
      'Protected regional operating postcodes (no cross-country dead miles)',
      'Prompt, guaranteed payment terms with automated CAFM job signoff',
      'No bidding fees or bidding platform subscription costs',
      'Direct contact with dedicated EntireFM Regional Operations Managers',
    ],
    operationalModel: 'Primary dispatch within 30-mile radius; direct engineer mobile app check-in.',
    onboardingRoute: 'Streamlined 3-day verification of statutory licences and public liability.',
    targetTrades: ['Commercial Gas & HVAC', 'NICEIC Electrical', 'Commercial Plumbing & Drainage', 'Fabric & Glazing'],
  },
  {
    id: 'national-providers',
    category: 'National Tier-1 Contractors',
    badge: 'SCALE & MULTI-SITE UNIFICATION',
    tagline: 'Large-scale multi-site coverage with centralized operational governance.',
    description: 'For national clients with complex multi-region footprints, we partner with established tier-1 providers delivering unified statutory compliance across dozens of locations under unified SLAs.',
    icon: Building2,
    keyBenefits: [
      'Multi-site contract aggregation across corporate and retail portfolios',
      'API integration into client CAFM and EntireCAFM enterprise feeds',
      'Unified monthly consolidated billing with pre-audited asset schedules',
      'Executive quarterly performance reviews and volume forecasting',
    ],
    operationalModel: 'Central helpdesk integration; nationwide engineer tracking and statutory portal access.',
    onboardingRoute: 'Comprehensive corporate compliance, SSIP Principal Contractor, and ISO audit review.',
    targetTrades: ['National Fire & Security', 'Water Treatment & Legionella', 'Specialist Waste & Recycling', 'Lifting & Elevators'],
  },
  {
    id: 'oem-manufacturers',
    category: 'Equipment Manufacturers & OEMs',
    badge: 'FACTORY-CERTIFIED ENGINEERING',
    tagline: 'Direct OEM warranty servicing, factory parts, and specialised commissioning.',
    description: 'We partner directly with leading HVAC, chiller, boiler, generator, and BMS manufacturers to ensure client assets are maintained to factory standards with genuine parts and warranty integrity.',
    icon: Award,
    keyBenefits: [
      'Direct channel for factory commissioning and extended warranty servicing',
      'Guaranteed genuine OEM replacement parts supply contracts',
      'Joint technical training programmes with EntireFM operations teams',
      'Asset replacement early-warning pipeline for aging client plant',
    ],
    operationalModel: 'Specialist tier escalation for tier-1 asset overhauls, major rebuilds, and warranty servicing.',
    onboardingRoute: 'Direct OEM partnership charter with reciprocal technical and parts agreements.',
    targetTrades: ['Chiller & Refrigeration OEMs', 'Commercial Boiler Manufacturers', 'BMS Control Vendors', 'Standby Power & UPS'],
  },
  {
    id: 'specialist-access',
    category: 'Specialist Access & Façade Teams',
    badge: 'HIGH-RISK & STATUTORY CERTIFIED',
    tagline: 'IRATA certified rope access, BMU cradles, and statutory high-rise works.',
    description: 'High-risk building envelope works require rigorous safety governance. We work with accredited access specialists for roof safety systems, lightning protection, and façade inspections.',
    icon: ShieldCheck,
    keyBenefits: [
      'Clear, pre-authorized site access permits and safety briefings',
      'High-value specialized project scopes with fair milestone payments',
      'Direct integration with building managers for rooftop safety systems',
      'No race to the bottom on price—safety and competence come first',
    ],
    operationalModel: 'Site-specific RAMS signoff; permit-to-work protocols with site security teams.',
    onboardingRoute: 'Rigorous H&S review (IRATA Level 3, LEEA, ATLAS, SafeContractor).',
    targetTrades: ['Rope Access Cleaning & Maint', 'BMU Cradle Statutory Testing', 'Lightning Conductor Testing', 'Pressure Vessel Survey'],
  },
  {
    id: 'tech-innovators',
    category: 'Technology & IoT Innovators',
    badge: 'SMART BUILDINGS & TELEMETRY',
    tagline: 'Deploying wireless vibration, thermal, and environmental sensor telemetry.',
    description: 'We offer an open testing ground for IoT hardware developers and software innovators to deploy condition-based monitoring sensors across live commercial plantrooms.',
    icon: Cpu,
    keyBenefits: [
      'Direct pilot access to live commercial HVAC and electrical plant',
      'Real-world operational telemetry validation alongside engineering teams',
      'Integration into EntireCAFM automated ticket generation pipeline',
      'Commercial joint-go-to-market opportunities for proven solutions',
    ],
    operationalModel: 'Pilot sandbox deployment with joint EntireFM engineering oversight.',
    onboardingRoute: 'Information security audit (ISO 27001 / UK GDPR) and hardware testing protocol.',
    targetTrades: ['Vibration IoT Sensors', 'Thermal Drone Surveys', 'Wireless Legionella Monitoring', 'AI Energy Telemetry'],
  },
];

export function OperatorPersonaSelector() {
  const [activePersonaId, setActivePersonaId] = useState(PERSONAS[0].id);

  const selected = PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0];
  const Icon = selected.icon;

  return (
    <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-14">
          <span className="eyebrow eyebrow-light">NETWORK ARCHITECTURE</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            Tailored Engagement for Every Operator Category
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Our supply chain is not one-size-fits-all. Select your business profile below to see how EntireFM structures contracts, work distribution, and onboarding for your specific capability.
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-200 mb-8">
          {PERSONAS.map((persona) => {
            const isSelected = persona.id === activePersonaId;
            return (
              <button
                key={persona.id}
                onClick={() => setActivePersonaId(persona.id)}
                className={`px-4 py-2.5 rounded-sm text-xs font-light tracking-wide transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white font-normal shadow-sm border border-slate-900'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {persona.category}
              </button>
            );
          })}
        </div>

        {/* Persona Detail Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-slate-200 rounded-sm p-8 lg:p-12 shadow-sm">
          {/* Left Column: Persona Overview & Value */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <Icon className="h-6 w-6 text-brand-pink" />
              </div>
              <div>
                <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink font-semibold">
                  {selected.badge}
                </span>
                <h3 className="text-2xl font-light text-slate-900">{selected.category}</h3>
              </div>
            </div>

            <p className="text-base font-light text-slate-800 italic">
              &ldquo;{selected.tagline}&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              {selected.description}
            </p>

            <div className="pt-4 space-y-3">
              <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block">
                COMMERCIAL &amp; OPERATIONAL ADVANTAGES
              </span>
              <ul className="space-y-2.5">
                {selected.keyBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 font-light">
                    <CheckCircle2 className="h-4 w-4 text-brand-pink shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Operating Model & Target Disciplines */}
          <div className="lg:col-span-5 bg-[#FAF9FB] p-7 rounded-sm border border-slate-200 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-500 block mb-1">
                  DISPATCH &amp; OPERATIONAL MODEL
                </span>
                <p className="text-xs text-slate-700 font-light leading-relaxed">
                  {selected.operationalModel}
                </p>
              </div>

              <div>
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-500 block mb-1">
                  ONBOARDING &amp; VETTING PROFILE
                </span>
                <p className="text-xs text-slate-700 font-light leading-relaxed">
                  {selected.onboardingRoute}
                </p>
              </div>

              <div>
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-500 block mb-2">
                  TARGET TRADES &amp; DISCIPLINES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.targetTrades.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 text-[11px] font-light text-slate-800 rounded-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <Link href="/suppliers/apply" className="btn-primary w-full justify-center text-xs py-3">
                Register as a {selected.category.split(' ')[0]} Partner <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
