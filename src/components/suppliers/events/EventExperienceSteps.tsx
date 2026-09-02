'use client';

import React from 'react';
import { DoorOpen, UserCheck, GraduationCap, MessageSquare, Handshake, Briefcase } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: DoorOpen,
    verb: 'Arrive',
    description: 'Register at a regional event or member session and meet the people already in the network.',
  },
  {
    number: '02',
    icon: UserCheck,
    verb: 'Meet',
    description: 'Introductions to other contractors, specialist engineers, operations leads, and OEM partners.',
  },
  {
    number: '03',
    icon: GraduationCap,
    verb: 'Learn',
    description: 'A structured technical or commercial briefing — new standards, product demonstrations, compliance guidance.',
  },
  {
    number: '04',
    icon: MessageSquare,
    verb: 'Discuss',
    description: 'Round-table or breakout format. Share challenges, hear how others are solving similar problems.',
  },
  {
    number: '05',
    icon: Handshake,
    verb: 'Connect',
    description: 'Exchange contacts. Follow up on conversations. Connect with suppliers or partner contractors.',
  },
  {
    number: '06',
    icon: Briefcase,
    verb: 'Take It Back',
    description: 'Return to your business with something concrete: a contact, a methodology, a standard, a competitive edge.',
  },
];

export function EventExperienceSteps() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAFAF8] border-b border-[#E8E8E5]">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-2xl mb-14 space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
              THE EVENT EXPERIENCE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
            Not another networking event.
          </h2>
          <p className="text-sm sm:text-base text-[#6D6D68] font-light leading-relaxed">
            Every EntireFM event is designed around a structured programme, not an open drinks evening. Here is what a typical session looks like from arrival to action.
          </p>
        </div>

        {/* Steps — horizontal scroll on mobile, grid on desktop */}
        <div className="relative">
          {/* Connector Line (desktop only) */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(1/12*100%+2px)] right-[calc(1/12*100%+2px)] h-px bg-[#E8E8E5] z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === STEPS.length - 1;
              return (
                <div key={step.number} className="relative flex flex-col items-center text-center group">
                  {/* Step Circle */}
                  <div className="relative z-10 flex items-center justify-center w-[60px] h-[60px] rounded-full bg-white border-2 border-[#E8E8E5] group-hover:border-[#EA580C] transition-colors duration-300 shadow-sm mb-4">
                    <Icon className="w-6 h-6 text-[#6D6D68] group-hover:text-[#EA580C] transition-colors" />
                  </div>

                  {/* Number + Verb */}
                  <div className="space-y-0.5 mb-3">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
                      {step.number}
                    </span>
                    <h3 className="text-sm font-semibold text-[#111111]">{step.verb}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-[11.5px] text-[#6D6D68] font-light leading-relaxed px-1">
                    {step.description}
                  </p>

                  {/* Arrow connector — visible on mobile, hidden on desktop (line handles it) */}
                  {!isLast && (
                    <div className="sm:hidden mt-4 text-[#E8E8E5]">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2L8 14M8 14L4 10M8 14L12 10" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing Note */}
        <div className="mt-14 p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E8E8E5] max-w-2xl mx-auto text-center">
          <p className="text-sm text-[#6D6D68] font-light leading-relaxed">
            <span className="font-semibold text-[#111111]">Membership does not guarantee work.</span> EntireFM events are designed to improve your business capability and professional position — not to act as a tender pipeline. Commercial introductions happen naturally through quality relationships.
          </p>
        </div>
      </div>
    </section>
  );
}
