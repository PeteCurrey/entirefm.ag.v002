'use client';

import React from 'react';
import {
  FileSearch,
  CheckCircle2,
  FileText,
  Truck,
  Wrench,
  Camera,
  ClipboardCheck,
  CreditCard,
  BarChart3,
  Award,
} from 'lucide-react';

export const OPERATIONAL_STAGES = [
  {
    step: '01',
    title: 'Opportunity Matching',
    icon: FileSearch,
    description: 'Work orders matched against trade discipline, geographic location, SLA capacity, risk category, and verified client constraints.',
  },
  {
    step: '02',
    title: 'Qualification & Assurance',
    icon: CheckCircle2,
    description: 'Automated verification of supplier insurance validity, operative competencies, RAMS submission, and site-access clearance.',
  },
  {
    step: '03',
    title: 'Controlled Work Order',
    icon: FileText,
    description: 'Dispatch with precise asset tagging, SFG20 task schedules, priority windows, access permits, and evidence capture specifications.',
  },
  {
    step: '04',
    title: 'Site Mobilisation',
    icon: Truck,
    description: 'Structured site arrival, dynamic risk assessment sign-off, client front-of-house check-in, and permit-to-work activation.',
  },
  {
    step: '05',
    title: 'Precision Delivery',
    icon: Wrench,
    description: 'Execution of planned preventative maintenance, reactive repair, or statutory inspection strictly against British Standards.',
  },
  {
    step: '06',
    title: 'Evidence & Diagnostics',
    icon: Camera,
    description: 'Operatives log calibrated instrument readings, asset condition codes, time-stamped defect photographs, and digital service sheets.',
  },
  {
    step: '07',
    title: 'Technical Validation',
    icon: ClipboardCheck,
    description: 'EntireFM compliance desk validates technical test sheets, statutory certificates, and evidence quality prior to task sign-off.',
  },
  {
    step: '08',
    title: 'Commercial Close',
    icon: CreditCard,
    description: 'Pre-authorised work orders match against agreed rate cards for automated invoice matching and prompt payment cycles.',
  },
  {
    step: '09',
    title: 'Performance Review',
    icon: BarChart3,
    description: 'SLA response times, first-time fix ratios, report quality, and client satisfaction feed into the supplier performance index.',
  },
  {
    step: '10',
    title: 'Preferred Partner Tier',
    icon: Award,
    description: 'Consistently high-performing suppliers unlock multi-estate frameworks, regional exclusivity, and strategic growth opportunities.',
  },
];

export function OperationalJourneySteps() {
  return (
    <section className="py-24 bg-brand-carbon text-white border-b border-brand-edge-dark">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <span className="eyebrow eyebrow-dark">OPERATIONAL GOVERNANCE</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
            The 10-Stage Operational Delivery Journey
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-mist/70 font-light leading-relaxed">
            From initial opportunity matching to final commercial settlement, EntireFM provides a transparent, digitally structured operating workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {OPERATIONAL_STAGES.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="bg-brand-graphite/70 border border-brand-edge-dark p-5 rounded-sm flex flex-col justify-between hover:border-brand-electric/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11.5px] font-light text-brand-electric-bright font-light">
                      STAGE {stage.step}
                    </span>
                    <Icon className="h-4 w-4 text-brand-mist/60" />
                  </div>
                  <h3 className="text-sm font-normal text-white mb-2">{stage.title}</h3>
                  <p className="text-[12px] text-brand-mist/70 leading-relaxed font-light">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
