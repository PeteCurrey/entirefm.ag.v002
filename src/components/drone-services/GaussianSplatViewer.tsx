'use client';

/**
 * GaussianSplatViewer — shell component (SSR-safe)
 *
 * Mirrors the battle-tested 3D visual feature from TFTS Drone (https://www.tfts.co.uk/tfts-3d).
 *
 * Handles: poster, real progress bar (driven by canvas onProgress + smooth animation),
 * mobile/no-WebGL fallback, fullscreen toggle, control overlay.
 *
 * The heavy WebGL canvas is loaded via next/dynamic { ssr: false } so
 * Three.js never runs server-side.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Move, ZoomIn, Maximize2, Minimize2, RotateCcw, AlertCircle, HelpCircle } from 'lucide-react';

const GaussianSplatCanvas = dynamic(
  () => import('./GaussianSplatCanvas'),
  { ssr: false, loading: () => null }
);

export interface GaussianSplatViewerProps {
  splatSrc?: string;
  splatUrl?: string; // backwards compatibility
  posterSrc?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  splatCount?: number;
  caption?: string;
  ctaLabel?: string;
  ctaHref?: string;
  forceFallback?: boolean;
  className?: string;
  initialCameraPosition?: [number, number, number];
  initialCameraLookAt?: [number, number, number];
  autoLoad?: boolean;
}

const LOAD_LABELS: Record<number, string> = {
  0: 'Connecting to spatial data server',
  25: 'Downloading spatial splat data',
  70: 'Processing Gaussian primitives',
  90: 'Rendering 3D environment',
};

function getLabel(pct: number): string {
  const keys = Object.keys(LOAD_LABELS).map(Number).sort((a, b) => b - a);
  for (const k of keys) {
    if (pct >= k) return LOAD_LABELS[k];
  }
  return LOAD_LABELS[0];
}

function useIsWebGLSupported() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setSupported(!!ctx);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

function useInView(ref: React.RefObject<HTMLElement | null>, rootMargin = '200px') {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

export function GaussianSplatViewer({
  splatSrc,
  splatUrl,
  posterSrc = '/images/drone/gaussian-splat/casa-hotel.jpg',
  title = 'EntireFM 3D — Live Spatial Site Survey',
  subtitle = 'Captured by EntireFM Drone Services · EntireFM 3D Spatial Model',
  description,
  splatCount = 540274,
  caption,
  ctaLabel = 'Request EntireFM 3D Capture',
  ctaHref = '/services/drone-services/digital-twin-3d-capture',
  forceFallback = false,
  className = '',
  initialCameraPosition = [0.2, 1.8, 4.5],
  initialCameraLookAt = [0, 0.2, 0],
}: GaussianSplatViewerProps) {
  const resolvedSplatSrc = splatSrc || splatUrl || '/assets/gaussian-splats/04_05_2026.ksplat';
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef as React.RefObject<HTMLElement | null>);
  const webgl = useIsWebGLSupported();

  type Phase = 'idle' | 'loading' | 'live' | 'error' | 'fallback';
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFS] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const isMobile = typeof navigator !== 'undefined' &&
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const shouldFallback = forceFallback || isMobile || webgl === false;

  useEffect(() => {
    if (inView && webgl !== null && phase === 'idle') {
      setPhase(shouldFallback ? 'fallback' : 'loading');
    }
  }, [inView, webgl, phase, shouldFallback]);

  // Continuous subtle progress simulation while loading so the UI never feels frozen
  useEffect(() => {
    if (phase !== 'loading') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + Math.random() * 3 + 1;
        } else if (prev < 98) {
          return prev + 0.4;
        }
        return prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFS(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  const handleProgress = useCallback((pct: number) => {
    setProgress((prev) => Math.max(prev, pct));
  }, []);

  const handleReady = useCallback(() => {
    setProgress(100);
    // Small delay to let user see 100% before smooth reveal
    setTimeout(() => {
      setPhase('live');
    }, 250);
  }, []);

  const handleError = useCallback(() => setPhase('error'), []);
  const handleReset = useCallback(() => setResetKey((k) => k + 1), []);
  const handleRetry = useCallback(() => {
    setPhase('loading');
    setProgress(0);
    setResetKey((k) => k + 1);
  }, []);

  // Failsafe timeout: if loading has been ongoing for 18s and no error was thrown, open live
  useEffect(() => {
    if (phase !== 'loading') return;
    const timer = setTimeout(() => {
      setProgress(100);
      setPhase('live');
    }, 18000);
    return () => clearTimeout(timer);
  }, [phase]);

  const displayProgress = Math.min(100, Math.round(progress));

  return (
    <div
      ref={wrapperRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-[9999] bg-[#060A14] flex flex-col'
          : `relative w-full ${className}`
      }
      role="region"
      aria-label={`Interactive EntireFM 3D viewer: ${title}`}
    >
      <div
        className={`relative bg-[#060A14] border border-white/15 rounded-sm overflow-hidden shadow-2xl ${
          isFullscreen ? 'flex-1' : 'aspect-[16/10] sm:aspect-[16/9] min-h-[420px]'
        }`}
      >
        {/* Poster — always underneath, fades out smoothly when live */}
        {posterSrc && (
          <img
            src={posterSrc}
            alt={title}
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-1000 ${
              phase === 'live' ? 'opacity-0' : 'opacity-70'
            } ${phase === 'loading' ? 'scale-105 blur-sm' : ''}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none z-[1]" />

        {/* IDLE */}
        {phase === 'idle' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-center px-8">
              <div className="inline-flex items-center gap-2 text-brand-pink text-xs tracking-[0.25em] uppercase mb-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
                EntireFM 3D Spatial Data Ready
              </div>
              <p className="text-slate-400 text-xs tracking-widest uppercase font-light">
                Scroll to activate 3D viewer
              </p>
            </div>
          </div>
        )}

        {/* LOADING — dynamic circular & linear progress bar */}
        {phase === 'loading' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-[#060A14]/75 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6 relative" aria-hidden="true">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 30}`}
                  strokeDashoffset={`${2 * Math.PI * 30 * (1 - displayProgress / 100)}`}
                  className="transition-all duration-300"
                />
              </svg>
              <span className="text-white text-xs tabular-nums font-light">{displayProgress}%</span>
            </div>
            <p className="text-xs tracking-[0.25em] uppercase text-brand-pink mb-2 font-medium">
              {getLabel(displayProgress)}
            </p>
            <p className="text-[11px] tracking-[0.18em] uppercase text-slate-400 font-light">
              Preparing {splatCount.toLocaleString()} spatial splats
            </p>
            <div className="mt-6 w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-pink to-brand-pink-light transition-all duration-300 rounded-full"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* WebGL canvas — mounted during loading, smoothly fades in when live */}
        {(phase === 'loading' || phase === 'live') && !shouldFallback && (
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-700 ${
              phase === 'live' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <GaussianSplatCanvas
              key={resetKey}
              splatSrc={resolvedSplatSrc}
              onReady={handleReady}
              onError={handleError}
              onProgress={handleProgress}
              initialCameraPosition={initialCameraPosition}
              initialCameraLookAt={initialCameraLookAt}
            />
          </div>
        )}

        {/* FALLBACK */}
        {phase === 'fallback' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-10 text-center bg-[#060A14]/90 backdrop-blur-md">
            <div className="max-w-md space-y-4">
              <div className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center mx-auto text-slate-300">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm tracking-[0.2em] uppercase text-white font-medium">
                3D Viewer Hardware Requirements
              </h3>
              <p className="text-xs text-slate-400 tracking-wider leading-relaxed">
                The interactive EntireFM 3D viewer is optimised for desktop devices with WebGL 2 hardware graphics support.
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {phase === 'error' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-10 text-center bg-[#060A14]/95 backdrop-blur-md space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <h3 className="text-sm tracking-[0.2em] uppercase text-white font-medium">
              3D Model Initialisation Error
            </h3>
            <p className="text-xs text-slate-400 tracking-wider max-w-md leading-relaxed">
              The interactive spatial asset could not be loaded on this session.
            </p>
            <button
              onClick={handleRetry}
              className="px-5 py-2 rounded-sm bg-brand-pink/20 hover:bg-brand-pink/30 border border-brand-pink/40 text-xs tracking-wider uppercase text-white transition-colors"
            >
              Retry Initialisation
            </button>
          </div>
        )}

        {/* Live overlay */}
        {phase === 'live' && (
          <>
            {/* Top Left Metadata */}
            <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-1">
              <div className="bg-[#060A14]/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-sm flex items-center gap-2.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-wider text-white">
                  {title}
                </span>
                <span className="text-[11px] tracking-wider uppercase text-slate-400 hidden sm:inline">
                  · {splatCount.toLocaleString()} splats
                </span>
              </div>
              {subtitle && (
                <span className="text-[11px] text-slate-300 font-light bg-[#060A14]/70 backdrop-blur-sm px-2.5 py-0.5 rounded-sm border border-white/10 w-fit">
                  {subtitle}
                </span>
              )}
            </div>

            {/* Bottom Left Navigation Controls Guide */}
            <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
              <div className="bg-[#060A14]/85 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-sm flex items-center gap-4 text-xs text-slate-300 font-light shadow-md">
                <div className="flex items-center gap-1.5 text-white font-normal">
                  <Move className="w-3.5 h-3.5 text-brand-pink" aria-hidden="true" />
                  <span><strong className="text-brand-pink font-medium">DRAG:</strong> Orbit</span>
                </div>
                <div className="w-px h-3 bg-white/15" />
                <div className="flex items-center gap-1.5 text-white font-normal">
                  <ZoomIn className="w-3.5 h-3.5 text-brand-pink" aria-hidden="true" />
                  <span><strong className="text-brand-pink font-medium">SCROLL:</strong> Zoom</span>
                </div>
                <div className="w-px h-3 bg-white/15 hidden sm:block" />
                <span className="hidden sm:inline text-white/80">
                  <strong className="text-brand-pink font-medium">RIGHT-CLICK:</strong> Pan
                </span>
              </div>
            </div>

            {/* Top Right Action Controls */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
              <button
                onClick={() => setShowHelp((prev) => !prev)}
                title="Interaction Guide"
                className="p-2.5 rounded-sm bg-[#060A14]/85 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white hover:border-brand-pink transition-all shadow-md cursor-pointer"
                aria-label="Toggle navigation help"
              >
                <HelpCircle className="h-4 w-4" />
              </button>

              <button
                onClick={handleReset}
                title="Reset Camera View"
                aria-label="Reset camera view"
                className="p-2.5 rounded-sm bg-[#060A14]/85 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white hover:border-brand-pink transition-all shadow-md cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsFS((f) => !f)}
                title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                className="p-2.5 rounded-sm bg-[#060A14]/85 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white hover:border-brand-pink transition-all shadow-md cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>

            {/* Help Tooltip Modal */}
            {showHelp && (
              <div className="absolute top-16 right-4 z-40 w-72 p-4 rounded-sm bg-[#060A14]/95 backdrop-blur-lg border border-brand-pink/40 shadow-2xl text-xs space-y-2.5 text-slate-200">
                <div className="flex items-center justify-between text-white border-b border-white/10 pb-1.5">
                  <span className="text-brand-pink font-medium uppercase tracking-wider text-[11px]">
                    3D NAVIGATION GUIDE
                  </span>
                  <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    ✕
                  </button>
                </div>
                <div className="space-y-1.5 text-xs font-light">
                  <p><strong className="text-white font-normal">Left Mouse / 1-Finger Touch:</strong> Orbit around asset.</p>
                  <p><strong className="text-white font-normal">Mouse Wheel / Pinch:</strong> Zoom in / out.</p>
                  <p><strong className="text-white font-normal">Right Mouse / 2-Finger Touch:</strong> Pan camera.</p>
                  <p><strong className="text-white font-normal">Reset Button:</strong> Return to initial aerial view.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {!isFullscreen && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-[11px] tracking-wider uppercase text-slate-400 font-light flex items-center gap-2">
            <span>EntireFM 3D Visualisation</span>
            <span>·</span>
            <span>Desktop with WebGL 2 recommended</span>
          </div>
          {caption && (
            <p className="text-xs text-slate-400 font-light italic">
              {caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default GaussianSplatViewer;
