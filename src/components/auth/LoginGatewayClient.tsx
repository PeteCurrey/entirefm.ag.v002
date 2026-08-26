'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { LoginAuthModal, LoginRole } from '@/components/auth/LoginAuthModal';

interface LoginGatewayClientProps {
  errorCode: string | null;
  redirectParam: string | null;
}

const CARDS: {
  role: LoginRole;
  label: string;
  eyebrow: string;
  description: string;
  cta: string;
  imageSrc: string;
  imageAlt: string;
  // Image focal point for object-position
  objectPosition: string;
}[] = [
  {
    role: 'CLIENT',
    label: 'Client',
    eyebrow: 'CLIENT ACCESS',
    description: 'Access your sites, requests, compliance and performance data.',
    cta: 'Continue as Client',
    imageSrc: '/images/editorial/entirefm-reception-2000w.webp',
    imageAlt: 'EntireFM managed commercial building reception',
    objectPosition: 'center center',
  },
  {
    role: 'SUPPLIER',
    label: 'Supplier',
    eyebrow: 'SUPPLIER PORTAL',
    description: 'Manage work orders, opportunities and supplier activity.',
    cta: 'Continue as Supplier',
    imageSrc: '/images/suppliers/supplier-events-hero.jpg',
    imageAlt: 'EntireFM supplier relationship meeting',
    objectPosition: 'center 30%',
  },
  {
    role: 'ENGINEER',
    label: 'Engineer',
    eyebrow: 'ENGINEER ACCESS',
    description: 'Access assigned jobs, site information and field workflows.',
    cta: 'Continue as Engineer',
    imageSrc: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
    imageAlt: 'EntireFM engineers on a rooftop plant deck',
    objectPosition: 'center 40%',
  },
];

export function LoginGatewayClient({ errorCode, redirectParam }: LoginGatewayClientProps) {
  const [activeRole, setActiveRole] = useState<LoginRole | null>(null);
  const [hoveredRole, setHoveredRole] = useState<LoginRole | null>(null);

  return (
    <>
      {/* Minimal header */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between h-[64px] px-6 sm:px-10 border-b border-white/[0.07] bg-brand-void/80 backdrop-blur-md">
        <Link href="/" className="text-[17px] font-extralight tracking-[0.08em] text-white">
          Entire<span className="font-bold text-hero-pink">FM</span>
        </Link>
        <Link
          href="/"
          className="text-[12px] font-light text-brand-mist/60 hover:text-white transition-colors"
        >
          ← Back to Website
        </Link>
      </header>

      {/* Three-panel gateway — full viewport */}
      <main className="flex flex-col lg:flex-row min-h-screen pt-[64px]">
        {CARDS.map((card) => {
          const isHovered = hoveredRole === card.role;

          return (
            <button
              key={card.role}
              type="button"
              onClick={() => setActiveRole(card.role)}
              onMouseEnter={() => setHoveredRole(card.role)}
              onMouseLeave={() => setHoveredRole(null)}
              aria-label={`Sign in as ${card.label}`}
              className="group relative flex flex-1 flex-col justify-end overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric focus-visible:ring-inset"
              style={{ minHeight: '33vh' }}
            >
              {/* Full-bleed photography */}
              <Image
                src={card.imageSrc}
                alt={card.imageAlt}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 33vw"
                className={`object-cover transition-transform duration-700 ease-brand ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}
                style={{ objectPosition: card.objectPosition }}
              />

              {/* Always-on base scrim — ensures text legibility at all times */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: isHovered
                    ? 'linear-gradient(to top, rgba(6,10,20,0.92) 0%, rgba(6,10,20,0.60) 50%, rgba(6,10,20,0.30) 100%)'
                    : 'linear-gradient(to top, rgba(6,10,20,0.88) 0%, rgba(6,10,20,0.50) 50%, rgba(6,10,20,0.20) 100%)',
                }}
              />

              {/* Vertical separator on desktop */}
              <div className="absolute inset-y-0 right-0 hidden lg:block w-px bg-white/[0.08]" />

              {/* Card content */}
              <div className="relative px-8 sm:px-10 lg:px-8 xl:px-12 pb-10 sm:pb-14">
                {/* Eyebrow */}
                <span
                  className={`text-[10px] font-normal uppercase tracking-[0.20em] block mb-4 transition-colors duration-300 ${
                    card.role === 'CLIENT' ? 'text-brand-electric-bright' :
                    card.role === 'SUPPLIER' ? 'text-brand-pink-light' :
                    'text-violet-300'
                  }`}
                >
                  {card.eyebrow}
                </span>

                {/* Role label */}
                <h2
                  className={`text-4xl sm:text-5xl font-extralight tracking-tight text-white leading-none mb-3 transition-transform duration-500 ${
                    isHovered ? 'translate-y-[-2px]' : ''
                  }`}
                >
                  {card.label}
                </h2>

                {/* Description */}
                <p className="text-[13.5px] font-light text-brand-mist/80 leading-relaxed mb-6 max-w-xs">
                  {card.description}
                </p>

                {/* CTA */}
                <div
                  className={`inline-flex items-center gap-2 text-sm font-light border-b pb-0.5 transition-all duration-300 ${
                    card.role === 'CLIENT'
                      ? 'text-brand-electric-bright border-brand-electric/40 group-hover:border-brand-electric'
                      : card.role === 'SUPPLIER'
                      ? 'text-brand-pink-light border-brand-pink/30 group-hover:border-brand-pink'
                      : 'text-violet-300 border-violet-400/30 group-hover:border-violet-400'
                  }`}
                >
                  {card.cta}
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </button>
          );
        })}
      </main>

      {/* Footer notice */}
      <footer className="fixed bottom-0 inset-x-0 z-20 border-t border-white/[0.06] bg-brand-void/60 backdrop-blur-sm py-3 px-6 text-center">
        <p className="text-[10.5px] font-light text-brand-mist/35">
          Protected Enterprise Environment · All access is audited · EntireFM Unified Operations Platform
        </p>
      </footer>

      {/* Auth modal overlay */}
      <LoginAuthModal
        role={activeRole}
        onClose={() => setActiveRole(null)}
        errorCode={errorCode}
        redirectParam={redirectParam ?? undefined}
      />
    </>
  );
}
