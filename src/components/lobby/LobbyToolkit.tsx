import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CuratedResourceItem } from '@/data/lobby/types';

interface LobbyToolkitProps {
  items: CuratedResourceItem[];
}

export function LobbyToolkit({ items }: LobbyToolkitProps) {
  // Ensure we have at least 3 items to match the design logic safely, otherwise fallback to whatever is available
  const mainTool = items[0];
  const subTool1 = items[1];
  const subTool2 = items[2];

  return (
    <section className="bg-brand-void py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 space-y-4">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-electric">
            FM Toolkit
          </h2>
          <p className="text-3xl sm:text-4xl font-extralight text-white leading-tight">
            Tools built for commercial estate teams
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* LARGE CARD (2/3 width on lg) */}
          {mainTool && (
            <Link 
              href={mainTool.url}
              className="lg:col-span-2 relative overflow-hidden group cursor-pointer block min-h-[360px] rounded-sm"
            >
              <Image 
                src="/images/editorial/entirefm-access-control-install-1200w.webp"
                alt="Tool Background"
                fill
                className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.025] group-hover:brightness-90 brightness-75 motion-reduce:transition-none"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
              
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 bg-black/30 px-2.5 py-1 rounded-sm self-start backdrop-blur-sm">
                  {mainTool.category}
                </span>

                <div className="space-y-3 pr-8">
                  <h3 className="text-2xl sm:text-3xl font-light text-white leading-snug">
                    {mainTool.title}
                  </h3>
                  <p className="text-sm font-light text-white/70 line-clamp-1 max-w-xl">
                    {mainTool.description}
                  </p>
                  
                  <div className="pt-4 flex items-center text-[13px] text-white font-medium group-hover:text-brand-electric transition-colors">
                    <span className="mr-2">Open Tool</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* SMALL CARDS STACK (1/3 width on lg) */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            
            {/* Small Card 1 */}
            {subTool1 && (
              <Link 
                href={subTool1.url}
                className="relative overflow-hidden group cursor-pointer block min-h-[170px] flex-1 rounded-sm"
              >
                <Image 
                  src="/images/editorial/entirefm-hvac-thermal-survey-1200w.webp"
                  alt="Tool Background"
                  fill
                  className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.025] group-hover:brightness-90 brightness-75 motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
                
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 bg-black/30 px-2 py-0.5 rounded-sm self-start backdrop-blur-sm">
                    {subTool1.category}
                  </span>

                  <div className="space-y-2 mt-4">
                    <h3 className="text-lg font-light text-white leading-snug">
                      {subTool1.title}
                    </h3>
                    
                    <div className="flex items-center text-xs text-white/90 group-hover:text-brand-electric transition-colors">
                      <span className="mr-1.5">Open</span>
                      <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Small Card 2 */}
            {subTool2 && (
              <Link 
                href={subTool2.url}
                className="relative overflow-hidden group cursor-pointer block min-h-[170px] flex-1 rounded-sm"
              >
                <Image 
                  src="/images/editorial/entirefm-plumbing-pressure-test-1200w.webp"
                  alt="Tool Background"
                  fill
                  className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.025] group-hover:brightness-90 brightness-75 motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
                
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 bg-black/30 px-2 py-0.5 rounded-sm self-start backdrop-blur-sm">
                    {subTool2.category}
                  </span>

                  <div className="space-y-2 mt-4">
                    <h3 className="text-lg font-light text-white leading-snug">
                      {subTool2.title}
                    </h3>
                    
                    <div className="flex items-center text-xs text-white/90 group-hover:text-brand-electric transition-colors">
                      <span className="mr-1.5">Open</span>
                      <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
                    </div>
                  </div>
                </div>
              </Link>
            )}
            
          </div>
        </div>

      </div>
    </section>
  );
}
