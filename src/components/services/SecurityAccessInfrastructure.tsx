'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { KeyRound, Shield, Eye, Lock, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

interface SecurityLayer {
  id: string;
  layer: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  technologies: string[];
  statutoryStandard: string;
  monitoringProtocol: string;
}

const SECURITY_LAYERS: SecurityLayer[] = [
  {
    id: 'perimeter-anpr',
    layer: 'LAYER 01',
    name: 'Perimeter Vehicle Barriers & ANPR Automation',
    category: 'PERIMETER ACCESS & LOGISTICS',
    tagline: 'High-speed automated barriers and optical licence plate recognition.',
    description: 'Heavy-duty hydraulic rising arm barriers, automated cantilever sliding security gates, and high-accuracy Automatic Number Plate Recognition (ANPR) systems regulating commercial estate traffic flow and logging delivery vehicles.',
    imageSrc: '/images/editorial/entirefm-site-arrival-2000w.webp',
    imageAlt: 'EntireFM security barrier and automated vehicle access control at commercial business park',
    technologies: [
      'Heavy-Duty Fast-Acting Rising Arm Barriers',
      'Dual-Lane ANPR Optical Number Plate Cameras',
      'Underground Induction Loop Safety Sensors',
      'Intercom Help Point with VoIP Gateway Link',
    ],
    statutoryStandard: 'BS EN 12453 Safety in Use of Power Operated Doors & Gates',
    monitoringProtocol: 'Automated 24/7 Vehicle Whitelist Verification',
  },
  {
    id: 'turnstiles-speedlanes',
    layer: 'LAYER 02',
    name: 'Reception Speedlanes & Biometric Access Control',
    category: 'INTERNAL PEDESTRIAN ACCESS',
    tagline: 'Architectural optical speedlanes, contactless RFID, and biometric facial access.',
    description: 'Grade-A corporate reception access solutions integrating slimline glass speedlanes, high-throughput QR visitor passes, encrypted DESFire RFID access cards, and touchless biometric readers for authorized personnel.',
    imageSrc: '/images/editorial/entirefm-reception-2000w.webp',
    imageAlt: 'Corporate Grade-A office reception with speedlane turnstiles and access control',
    technologies: [
      'Optical Glass Flap Barrier Speedlanes',
      'Encrypted MIFARE DESFire EV3 Readers',
      'Touchless Biometric Facial Recognition Terminals',
      'Emergency Break-Glass Egress Release Overrides',
    ],
    statutoryStandard: 'BS EN 60839-11-1 Electronic Access Control Systems',
    monitoringProtocol: 'Sub-second Badge Scan & Anti-Passback Enforcement',
  },
  {
    id: 'cctv-analytics',
    layer: 'LAYER 03',
    name: 'IP CCTV Surveillance & Deep Video Analytics',
    category: 'SITUATIONAL AWARENESS & TELEMETRY',
    tagline: 'High-definition optical cameras with perimeter line-crossing analytics.',
    description: 'Comprehensive 4K IP dome and bullet camera networks paired with PTZ cameras on high-level brackets. Features automated intrusion line-crossing detection, night-vision infrared illumination, and secure cloud NVR recording.',
    imageSrc: '/images/locations/manchester/facilities-management-manchester-reception-front-of-house-1600w.webp',
    imageAlt: 'Front of house corporate security and CCTV monitoring in modern commercial building',
    technologies: [
      '4K WDR Ultra-Low-Light IP Dome Cameras',
      '360-Degree Panoramic Fish-Eye Overview Sensors',
      'AI Deep-Learning Line-Crossing & Loitering Triggers',
      'Encrypted Local NVR & Offsite Cloud Redundancy',
    ],
    statutoryStandard: 'BS EN 62676 Video Surveillance Systems & GDPR Data Compliance',
    monitoringProtocol: 'Continuous 30-Day Encrypted Retention & Motion Alerting',
  },
  {
    id: 'intruder-keyholding',
    layer: 'LAYER 04',
    name: 'Intruder Detection & SIA Keyholding Response',
    category: 'PHYSICAL SECURITY & RAPID DISPATCH',
    tagline: 'Grade 3 alarm systems with SIA-licensed mobile response patrol officers.',
    description: 'Commercial Grade 3 intruder alarm systems with dual-path signaling (4G cellular + IP) connected to our 24/7 Alarm Receiving Centre (ARC). Backed by direct SIA-licensed mobile patrol officers for fast site attendance and alarm verification.',
    imageSrc: '/images/editorial/entirefm-entirefm-premises-vans-2000w.webp',
    imageAlt: 'EntireFM security response fleet stationed ready for rapid attendance',
    technologies: [
      'Grade 3 Dual-Tech PIR & Microwave Motion Detectors',
      'Dual-Path 4G/IP Monitored Signaling Transmitters',
      'Magnetic High-Security Door & Shutter Contacts',
      'SIA Licensed Keyholding Response Vehicle Fleet',
    ],
    statutoryStandard: 'PD 6662:2017 & BS 8243 Alarm Systems Installation Standard',
    monitoringProtocol: '24/7 Monitored ARC with Contracted Attendance SLA',
  },
  {
    id: 'cafm-visitor-logs',
    layer: 'LAYER 05',
    name: 'EntireCAFM Visitor & Contractor Access Ledger',
    category: 'DIGITAL AUDIT & GOVERNANCE',
    tagline: 'Cloud visitor management, contractor induction logging & time tracking.',
    description: 'Digital front-of-house guest registration, contractor pre-qualification verification, RAMS approval sign-off, and automated building evacuation roll-call generation linked directly to EntireCAFM.',
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    imageAlt: 'EntireFM security manager reviewing digital visitor logs and contractor compliance',
    technologies: [
      'Touchless QR Code Guest Check-in Kiosks',
      'Contractor RAMS & Insurance Pre-Approval Gateway',
      'Live Evacuation Roll-Call Cloud App for Fire Wardens',
      'Real-Time Tenant Time-and-Attendance Analytics',
    ],
    statutoryStandard: 'Fire Safety Order 2005 (Roll Call) & ISO 27001 Security',
    monitoringProtocol: 'Instant Real-Time Cloud Synchronization',
  },
];

export function SecurityAccessInfrastructure() {
  const [activeId, setActiveId] = useState<string>('turnstiles-speedlanes');
  const active = SECURITY_LAYERS.find((l) => l.id === activeId) || SECURITY_LAYERS[1];

  return (
    <section className="py-20 lg:py-28 bg-[#060C16] text-white relative overflow-hidden border-t border-white/[0.06]">
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-electric/10 border border-brand-electric/30 mb-4">
            <KeyRound className="w-3.5 h-3.5 text-brand-electric-bright" />
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-brand-electric-bright">
              INTEGRATED ACCESS & PHYSICAL PROTECTION
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white tracking-tight leading-[1.15]">
            Perimeter-to-Portal Security Infrastructure
          </h2>
          <p className="mt-4 text-sm sm:text-base text-brand-mist/75 font-light leading-relaxed">
            Commercial estate protection requires a seamless multi-layer security model. From vehicle ANPR perimeter barriers and reception speedlanes to AI-powered CCTV and SIA keyholding response, discover our integrated solutions.
          </p>
        </div>

        {/* 5-Layer Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10">
          {SECURITY_LAYERS.map((item) => {
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
                  <span className={`text-[11px] font-normal${isSelected ? 'text-brand-electric-bright' : 'text-brand-mist/40'}`}>
                    {item.layer}
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
        <div className="bg-[#09111F] border border-white/[0.08] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#09111F] via-[#09111F]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#09111F]" />

              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-sm border border-white/10 flex items-center justify-between">
                <span className="text-[10.5px] font-medium text-brand-electric-bright uppercase tracking-wider">
                  {active.category}
                </span>
                <span className="text-[10px] font-light text-brand-mist/70">
                  SIA & NSI Aligned
                </span>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal text-brand-electric-bright px-2 py-0.5 rounded-xs bg-brand-electric/15 border border-brand-electric/30">
                    {active.layer}
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

              {/* Technologies List */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-brand-mist/50 block">
                  Hardware & Integrated Technologies:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {active.technologies.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-sm bg-white/[0.03] border border-white/[0.05]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-electric-bright shrink-0 mt-0.5" />
                      <span className="text-xs font-light text-white/90 leading-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standards & Monitoring */}
              <div className="pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10.5px] font-medium text-brand-mist/50 uppercase tracking-wider block">
                    Security Compliance Standard
                  </span>
                  <p className="text-xs font-normal text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {active.statutoryStandard}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10.5px] font-medium text-brand-mist/50 uppercase tracking-wider block">
                    Monitoring Protocol
                  </span>
                  <p className="text-xs font-normal text-brand-mist/90 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-brand-electric-bright shrink-0" />
                    {active.monitoringProtocol}
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
