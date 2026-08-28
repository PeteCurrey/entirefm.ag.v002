'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Box, 
  RotateCw, 
  ZoomIn, 
  Maximize2, 
  Move, 
  Search, 
  ArrowRight,
  Info,
  Layers
} from 'lucide-react';

export function DroneGaussianSplatExperience() {
  const [rotation, setRotation] = useState({ x: 15, y: -25 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeModel, setActiveModel] = useState<'casa' | 'heritage'>('casa');

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setRotation(prev => ({
      x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.2)),
      y: prev.y + deltaX * 0.3
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.8, Math.min(1.8, prev - e.deltaY * 0.001)));
  };

  const resetView = () => {
    setRotation({ x: 15, y: -25 });
    setZoom(1);
  };

  return (
    <section 
      aria-label="3D Gaussian Splat & Reality Capture"
      className="py-24 sm:py-32 bg-black text-white overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom space-y-12">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
              <Box className="h-4 w-4" />
              <span>PHOTOREALISTIC 3D REALITY CAPTURE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-tight">
              3D Gaussian Splatting: <br />
              <span className="font-light text-hero-pink">
                Explore the Real Site in 3D Space.
              </span>
            </h2>

            <p className="text-base text-slate-300 font-light leading-relaxed max-w-2xl">
              Preserve, navigate, and inspect a photorealistic 3D digital model reconstructed from thousands of high-resolution aerial photographs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModel('casa')}
              className={`px-4 py-2 rounded-sm text-xs font-mono transition-all border ${
                activeModel === 'casa'
                  ? 'bg-brand-carbon border-brand-pink text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              CASA HOTEL ESTATE
            </button>
            <button
              onClick={() => setActiveModel('heritage')}
              className={`px-4 py-2 rounded-sm text-xs font-mono transition-all border ${
                activeModel === 'heritage'
                  ? 'bg-brand-carbon border-brand-pink text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              HERITAGE HOUSE COMPLEX
            </button>
          </div>
        </div>

        {/* Full-Width Immersive 3D Reality Capture Canvas */}
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="relative h-[500px] sm:h-[650px] lg:h-[750px] w-full rounded-sm overflow-hidden bg-gradient-to-b from-[#090D16] to-[#04060A] cursor-grab active:cursor-grabbing border border-white/15 select-none shadow-2xl flex items-center justify-center"
        >
          {/* 3D Model Image with CSS 3D Transformation for Interactive Spatial Exploration */}
          <div 
            className="relative w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
            style={{
              perspective: '1200px',
            }}
          >
            <div 
              className="relative w-[90%] h-[90%] transition-transform duration-75 ease-out rounded-sm overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)]"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
                transformStyle: 'preserve-3d',
              }}
            >
              <Image
                src={activeModel === 'casa' ? '/images/drone/gaussian-splat/casa-hotel.jpg' : '/images/drone/gaussian-splat/heritage-house.jpg'}
                alt="Photorealistic 3D Gaussian Splat model of commercial property"
                fill
                priority
                className="object-cover object-center filter brightness-[0.95] contrast-[1.1]"
                sizes="100vw"
              />

              <div className="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />
            </div>
          </div>

          {/* Interactive Instructions Overlay */}
          <div className="absolute bottom-6 left-6 z-20 flex flex-wrap items-center gap-4 bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-sm border border-white/10 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-2">
              <Move className="h-3.5 w-3.5 text-brand-pink" />
              <span>DRAG TO ROTATE</span>
            </div>
            <div className="w-px h-3 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-brand-pink" />
              <span>SCROLL TO ZOOM</span>
            </div>
            <div className="w-px h-3 bg-white/20 hidden sm:block" />
            <button
              onClick={resetView}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>RESET VIEW</span>
            </button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-6 right-6 z-20 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-white/10 font-mono text-xs text-brand-pink flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
            <span>GAUSSIAN SPLAT DATASET ACTIVE</span>
          </div>
        </div>

      </div>
    </section>
  );
}
