'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Box, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface GaussianSplatViewerProps {
  splatUrl?: string;
  splatCount?: number;
  title?: string;
  subtitle?: string;
  initialCameraPosition?: [number, number, number];
  initialCameraLookAt?: [number, number, number];
  className?: string;
  autoLoad?: boolean;
}

export function GaussianSplatViewer({
  splatUrl = '/assets/gaussian-splats/04_05_2026.ksplat',
  splatCount = 540274,
  title = 'LIVE 3D SURVEY · ENTIREFM 3D',
  subtitle = 'Captured by EntireFM Drone Services · EntireFM 3D Spatial Model',
  initialCameraPosition = [0, 2.5, 6.0],
  initialCameraLookAt = [0, -0.2, 0],
  className = '',
  autoLoad = true,
}: GaussianSplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const isInitializedRef = useRef<boolean>(false);

  const [loadingState, setLoadingState] = useState<'idle' | 'connecting' | 'downloading' | 'processing' | 'ready' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [isWebGlSupported, setIsWebGlSupported] = useState<boolean>(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setIsWebGlSupported(false);
        setLoadingState('error');
        setErrorMessage('WebGL 3D hardware acceleration is not supported on this browser or device.');
      }
    } catch {
      setIsWebGlSupported(false);
      setLoadingState('error');
      setErrorMessage('Unable to initialize WebGL hardware graphics context.');
    }
  }, []);

  // Initialize Viewer
  const initViewer = useCallback(async () => {
    if (isInitializedRef.current || !containerRef.current || !isWebGlSupported) return;
    isInitializedRef.current = true;

    try {
      setLoadingState('connecting');
      setDownloadProgress(10);

      // Dynamic import of GaussianSplats3D library
      const GaussianSplats3D = await import('@mkkellogg/gaussian-splats-3d');

      if (!containerRef.current) return;

      // Ensure root element has minimum dimensions before initializing
      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 500;

      // Instantiate Viewer with robust cross-browser settings
      const viewer = new GaussianSplats3D.Viewer({
        rootElement: containerRef.current,
        cameraUp: [0, 1, 0],
        initialCameraPosition: initialCameraPosition,
        initialCameraLookAt: initialCameraLookAt,
        selfDrivenMode: true,
        useBuiltInControls: true,
        ignoreDevicePixelRatio: false,
        halfPrecisionCovariancesOnGPU: false, // Standard 32-bit floats for 100% WebGL compatibility
        gpuAcceleratedSort: false,           // CPU WASM SIMD sort: 100% reliable across all devices
        sharedMemoryForWorkers: false,       // Allows execution without COOP/COEP isolation headers
        integerBasedSort: false,             // High precision sorting
        splatRenderMode: GaussianSplats3D.SplatRenderMode.ThreeD,
        sceneRevealMode: GaussianSplats3D.SceneRevealMode.Instant,
        dynamicScene: false,
        webXRMode: GaussianSplats3D.WebXRMode.None,
        logLevel: GaussianSplats3D.LogLevel.None,
        antialiased: false,
        focalAdjustment: 1.0,
      });

      viewerRef.current = viewer;

      setLoadingState('downloading');

      // Load KSplat asset
      await viewer.addSplatScene(splatUrl, {
        format: GaussianSplats3D.SceneFormat.KSplat,
        rotation: [0, 0, 0, 1], // Standard coordinate alignment
        position: [0, 0, 0],
        scale: [1, 1, 1],
        splatAlphaRemovalThreshold: 1,
        showLoadingUI: false, // Bespoke EntireFM progress UI
        progressiveLoad: false,
        onProgress: (percentComplete: number) => {
          if (typeof percentComplete === 'number' && !isNaN(percentComplete) && isFinite(percentComplete)) {
            const clamped = Math.max(5, Math.min(99, Math.round(percentComplete)));
            setDownloadProgress(clamped);
            if (clamped >= 95) {
              setLoadingState('processing');
            }
          } else {
            // Smooth progress ticker fallback when Content-Length is omitted by server
            setDownloadProgress((prev) => {
              const cur = typeof prev === 'number' && !isNaN(prev) ? prev : 10;
              const next = Math.min(92, cur + 15);
              return next;
            });
          }
        },
      });

      // Start render loop
      viewer.start();

      // Sync renderer size & camera aspect ratio immediately
      if (containerRef.current && viewer.renderer && viewer.camera) {
        const w = containerRef.current.clientWidth || width;
        const h = containerRef.current.clientHeight || height;
        viewer.renderer.setSize(w, h);
        if (viewer.camera.isPerspectiveCamera) {
          viewer.camera.aspect = w / h;
          viewer.camera.updateProjectionMatrix();
        }
        viewer.forceRenderNextFrame();
      }

      setDownloadProgress(100);
      setLoadingState('ready');

    } catch (err: any) {
      console.error('GaussianSplatViewer load error:', err);
      setLoadingState('error');
      setErrorMessage(err?.message || 'Failed to load EntireFM 3D asset.');
    }
  }, [splatUrl, initialCameraPosition, initialCameraLookAt, isWebGlSupported]);

  // Lazy load when near viewport via IntersectionObserver
  useEffect(() => {
    if (!autoLoad || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isInitializedRef.current) {
              initViewer();
            } else if (viewerRef.current) {
              viewerRef.current.start();
            }
          } else if (viewerRef.current && isInitializedRef.current) {
            // Pause render loop when offscreen to conserve GPU resources
            viewerRef.current.stop();
          }
        });
      },
      { threshold: 0.05, rootMargin: '250px' }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [autoLoad, initViewer]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.stop();
          viewerRef.current.dispose();
        } catch {
          // ignore cleanup errors
        }
        viewerRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, []);

  // Handle Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (viewerRef.current && containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        viewerRef.current.renderer?.setSize(w, h);
        if (viewerRef.current.camera?.isPerspectiveCamera) {
          viewerRef.current.camera.aspect = w / h;
          viewerRef.current.camera.updateProjectionMatrix();
        }
        viewerRef.current.forceRenderNextFrame();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Reset Camera View
  const handleResetView = useCallback(() => {
    if (!viewerRef.current) return;
    try {
      const viewer = viewerRef.current;
      if (viewer.controls) {
        viewer.controls.target.set(initialCameraLookAt[0], initialCameraLookAt[1], initialCameraLookAt[2]);
        viewer.controls.update();
      }
      if (viewer.camera) {
        viewer.camera.position.set(initialCameraPosition[0], initialCameraPosition[1], initialCameraPosition[2]);
        viewer.camera.up.set(0, 1, 0);
        viewer.camera.lookAt(initialCameraLookAt[0], initialCameraLookAt[1], initialCameraLookAt[2]);
        if (viewer.camera.isPerspectiveCamera && containerRef.current) {
          const w = containerRef.current.clientWidth || 800;
          const h = containerRef.current.clientHeight || 500;
          viewer.camera.aspect = w / h;
          viewer.camera.updateProjectionMatrix();
        }
      }
      viewer.forceRenderNextFrame();
    } catch (e) {
      console.warn('Could not reset camera controls:', e);
    }
  }, [initialCameraPosition, initialCameraLookAt]);

  const displayPercent = typeof downloadProgress === 'number' && !isNaN(downloadProgress) && downloadProgress > 0
    ? downloadProgress
    : 45;

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-[420px] aspect-[16/10] sm:aspect-[16/9] bg-[#060A14] rounded-sm overflow-hidden border border-white/15 shadow-2xl select-none group font-sans ${className}`}
      tabIndex={0}
      aria-label={`${title} - Interactive EntireFM 3D drone reality capture model. Use mouse to orbit and scroll to zoom.`}
    >
      {/* ── Overlay: Top Left Metadata ──────────────────────────────────── */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-brand-void/85 backdrop-blur-md border border-white/15 shadow-md">
          <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
          <span className="text-xs font-medium uppercase tracking-wider text-white">
            {title}
          </span>
        </div>
        <span className="text-[11px] text-slate-300 font-light bg-brand-void/70 backdrop-blur-sm px-2.5 py-0.5 rounded-sm border border-white/10 w-fit">
          {subtitle}
        </span>
      </div>

      {/* ── Overlay: Top Right Controls ─────────────────────────────────── */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setShowHelp((prev) => !prev)}
          title="Interaction Guide"
          className="p-2.5 rounded-sm bg-brand-void/85 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white hover:border-brand-pink transition-all shadow-md cursor-pointer"
          aria-label="Toggle navigation help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        <button
          onClick={handleResetView}
          disabled={loadingState !== 'ready'}
          title="Reset Camera View"
          className="p-2.5 rounded-sm bg-brand-void/85 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white hover:border-brand-pink transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Reset camera view"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="p-2.5 rounded-sm bg-brand-void/85 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white hover:border-brand-pink transition-all shadow-md cursor-pointer"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* ── Overlay: Bottom Interaction Bar ─────────────────────────────── */}
      <div className="absolute bottom-4 inset-x-4 z-20 pointer-events-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 font-light">
        <div className="bg-brand-void/85 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-white/15 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-white font-normal">
            <span className="text-brand-pink font-medium">DRAG:</span> Orbit Scene
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="hidden sm:flex items-center gap-1.5 text-white font-normal">
            <span className="text-brand-pink font-medium">SCROLL:</span> Zoom
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="hidden sm:flex items-center gap-1.5 text-white font-normal">
            <span className="text-brand-pink font-medium">RIGHT-CLICK:</span> Pan
          </span>
        </div>

        <div className="bg-brand-void/85 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/15 flex items-center gap-2 text-emerald-400 font-medium text-[11px] uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Interactive EntireFM 3D Engine</span>
        </div>
      </div>

      {/* ── Help Tooltip Modal ──────────────────────────────────────────── */}
      {showHelp && (
        <div className="absolute top-16 right-4 z-30 w-72 p-4 rounded-sm bg-brand-void/95 backdrop-blur-lg border border-brand-pink/40 shadow-2xl text-xs space-y-2.5 text-slate-200">
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-1.5">
            <span className="text-brand-pink font-medium uppercase tracking-wider text-[11px]">NAVIGATION GUIDE</span>
            <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
          </div>
          <div className="space-y-1.5 text-xs font-light">
            <p><strong className="text-white font-normal">Left Mouse / 1-Finger Touch:</strong> Rotate and orbit around the structure.</p>
            <p><strong className="text-white font-normal">Mouse Wheel / Pinch:</strong> Smooth zoom in and out.</p>
            <p><strong className="text-white font-normal">Right Mouse / 2-Finger Touch:</strong> Pan the camera position.</p>
            <p><strong className="text-white font-normal">Reset Button:</strong> Return to initial aerial 3/4 perspective.</p>
          </div>
        </div>
      )}

      {/* ── Loading Overlay Experience ──────────────────────────────────── */}
      {loadingState !== 'ready' && loadingState !== 'error' && (
        <div className="absolute inset-0 z-30 bg-[#060A14] flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border border-brand-pink/20 border-t-brand-pink animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Box className="h-6 w-6 text-brand-pink animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 max-w-md">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-pink block font-medium">
              ENTIREFM 3D · DIGITAL TWIN CAPTURE
            </span>
            <h4 className="text-xl sm:text-2xl font-light text-white tracking-tight">
              {loadingState === 'connecting' && 'Connecting to 3D Stream…'}
              {loadingState === 'downloading' && `Downloading EntireFM 3D Model (${displayPercent}%)`}
              {loadingState === 'processing' && 'Synthesizing EntireFM 3D Spatial Capture…'}
            </h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Streaming photorealistic interactive 3D spatial capture generated from high-overlap commercial drone flight.
            </p>
          </div>

          {/* Luxury Thin Progress Bar */}
          <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-electric transition-all duration-300 ease-out"
              style={{ width: `${displayPercent}%` }}
            />
          </div>

          <div className="text-xs text-slate-400 font-light">
            EntireFM 3D Spatial Engine · WebGL Hardware Accelerated
          </div>
        </div>
      )}

      {/* ── Error / Fallback State ──────────────────────────────────────── */}
      {loadingState === 'error' && (
        <div className="absolute inset-0 z-30 bg-[#060A14] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-md">
            <h4 className="text-lg font-light text-white">Interactive EntireFM 3D View Unavailable</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              {errorMessage || 'Your browser or device does not meet the WebGL hardware requirements to render real-time EntireFM 3D spatial models.'}
            </p>
          </div>
          <button
            onClick={() => {
              isInitializedRef.current = false;
              initViewer();
            }}
            className="px-4 py-2 rounded-sm bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
          >
            Retry 3D Initialisation
          </button>
        </div>
      )}
    </div>
  );
}
