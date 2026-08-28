'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Box, 
  Compass, 
  Eye, 
  Sparkles,
  AlertCircle,
  Layers,
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
  initialCameraPosition = [0, 3.5, 6.5],
  initialCameraLookAt = [0, 0.8, 0],
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
      setDownloadProgress(5);

      // Dynamic import of GaussianSplats3D library
      const GaussianSplats3D = await import('@mkkellogg/gaussian-splats-3d');

      if (!containerRef.current) return;

      // Instantiate Viewer with tailored camera & performance parameters
      const viewer = new GaussianSplats3D.Viewer({
        rootElement: containerRef.current,
        cameraUp: [0, 1, 0],
        initialCameraPosition: initialCameraPosition,
        initialCameraLookAt: initialCameraLookAt,
        selfDrivenMode: true,
        useBuiltInControls: true,
        ignoreDevicePixelRatio: false,
        halfPrecisionCovariancesOnGPU: true, // Memory optimization
        gpuAcceleratedSort: true,
        integerBasedSort: true,
        splatRenderMode: GaussianSplats3D.SplatRenderMode.ThreeD,
        sharedMemoryForWorkers: false,
        dynamicScene: false,
        webXRMode: GaussianSplats3D.WebXRMode.None,
        logLevel: GaussianSplats3D.LogLevel.None,
      });

      viewerRef.current = viewer;

      setLoadingState('downloading');

      // Load the KSplat file with rotation around X axis (Math.PI) to invert Polycam's Y-down axis
      // Quaternion for 180° rotation around X-axis: [1, 0, 0, 0]
      await viewer.addSplatScene(splatUrl, {
        format: GaussianSplats3D.SceneFormat.KSplat,
        rotation: [1, 0, 0, 0],
        position: [0, 0, 0],
        scale: [1, 1, 1],
        splatAlphaRemovalThreshold: 1,
        showLoadingUI: false, // We use our bespoke luxury EntireFM UI
        onProgress: (percentComplete: number, percentLabel: string, loaderStatus: any) => {
          setDownloadProgress(Math.max(5, Math.min(99, Math.round(percentComplete))));
          if (percentComplete >= 95) {
            setLoadingState('processing');
          }
        },
      });

      // Start the render loop
      viewer.start();
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
      { threshold: 0.1, rootMargin: '200px' }
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
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Reset Camera View
  const handleResetView = useCallback(() => {
    if (!viewerRef.current || !viewerRef.current.controls) return;
    try {
      const controls = viewerRef.current.controls;
      controls.target.set(initialCameraLookAt[0], initialCameraLookAt[1], initialCameraLookAt[2]);
      if (viewerRef.current.camera) {
        viewerRef.current.camera.position.set(initialCameraPosition[0], initialCameraPosition[1], initialCameraPosition[2]);
        viewerRef.current.camera.lookAt(initialCameraLookAt[0], initialCameraLookAt[1], initialCameraLookAt[2]);
      }
      controls.update();
    } catch (e) {
      console.warn('Could not reset camera controls:', e);
    }
  }, [initialCameraPosition, initialCameraLookAt]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#060A14] rounded-sm overflow-hidden border border-white/15 shadow-2xl select-none group ${className}`}
      tabIndex={0}
      aria-label={`${title} - Interactive 3D drone reality capture model. Use mouse to orbit and scroll to zoom.`}
    >
      {/* ── Overlay: Top Left Metadata ──────────────────────────────────── */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-brand-void/85 backdrop-blur-md border border-white/15 shadow-md">
          <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
            {title}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-brand-void/70 backdrop-blur-sm px-2.5 py-0.5 rounded-sm border border-white/10 w-fit">
          {subtitle}
        </span>
      </div>

      {/* ── Overlay: Top Right Controls ─────────────────────────────────── */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setShowHelp((prev) => !prev)}
          title="Interaction Guide"
          className="p-2.5 rounded-sm bg-brand-void/85 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white hover:border-brand-pink transition-all shadow-md"
          aria-label="Toggle navigation help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        <button
          onClick={handleResetView}
          disabled={loadingState !== 'ready'}
          title="Reset Camera View"
          className="p-2.5 rounded-sm bg-brand-void/85 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white hover:border-brand-pink transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Reset camera view"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="p-2.5 rounded-sm bg-brand-void/85 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white hover:border-brand-pink transition-all shadow-md"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* ── Overlay: Bottom Interaction Bar ─────────────────────────────── */}
      <div className="absolute bottom-4 inset-x-4 z-20 pointer-events-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-300">
        <div className="bg-brand-void/85 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-white/15 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-white">
            <span className="text-brand-pink font-bold">DRAG:</span> Orbit Scene
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="hidden sm:flex items-center gap-1.5 text-white">
            <span className="text-brand-pink font-bold">SCROLL:</span> Zoom
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="hidden sm:flex items-center gap-1.5 text-white">
            <span className="text-brand-pink font-bold">RIGHT-CLICK:</span> Pan
          </span>
        </div>

        <div className="bg-brand-void/85 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/15 flex items-center gap-2 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>REAL-TIME RADIANCE FIELD RENDER</span>
        </div>
      </div>

      {/* ── Help Tooltip Modal ──────────────────────────────────────────── */}
      {showHelp && (
        <div className="absolute top-16 right-4 z-30 w-72 p-4 rounded-sm bg-brand-void/95 backdrop-blur-lg border border-brand-pink/40 shadow-2xl text-xs space-y-2.5 text-slate-200">
          <div className="flex items-center justify-between font-mono text-white border-b border-white/10 pb-1.5">
            <span className="text-brand-pink font-semibold">NAVIGATION GUIDE</span>
            <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono">
            <p><strong className="text-white">Left Mouse / 1-Finger Touch:</strong> Rotate and orbit around the structure.</p>
            <p><strong className="text-white">Mouse Wheel / Pinch:</strong> Smooth zoom in and out.</p>
            <p><strong className="text-white">Right Mouse / 2-Finger Touch:</strong> Pan the camera position.</p>
            <p><strong className="text-white">Reset Button:</strong> Return to initial aerial 3/4 perspective.</p>
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
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-pink block font-semibold">
              ENTIREFM 3D · DIGITAL TWIN CAPTURE
            </span>
            <h4 className="text-xl sm:text-2xl font-light text-white tracking-tight">
              {loadingState === 'connecting' && 'Connecting to 3D Stream…'}
              {loadingState === 'downloading' && `Downloading EntireFM 3D Model (${downloadProgress}%)`}
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
              style={{ width: `${downloadProgress}%` }}
            />
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            EntireFM 3D Spatial Engine · WebGL / WebGPU
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
            className="px-4 py-2 rounded-sm bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-white transition-colors"
          >
            Retry 3D Initialisation
          </button>
        </div>
      )}
    </div>
  );
}
