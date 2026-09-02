'use client';

/**
 * GaussianSplatCanvas — raw WebGL canvas
 *
 * Dynamically imported (ssr: false) — Three.js never runs server-side.
 * This component owns the full GaussianSplats3D viewer lifecycle.
 *
 * Key settings that produce a sharp, high-detail render:
 * - rotation: [1, 0, 0, 0]  — 180° X-axis flip for Polycam/ksplat Y-down convention
 * - splatAlphaRemovalThreshold: 5  — removes noisy near-transparent splats that cause haze
 * - gpuAcceleratedSort: false, sharedMemoryForWorkers: false  — broad device compatibility
 * - halfPrecisionCovariancesOnGPU: false  — full 32-bit float precision covariances
 * - The mount div uses w-full h-full so offsetWidth/offsetHeight are always real pixels
 *   when the library's internal ResizeObserver fires
 */

import { useEffect, useRef, useCallback } from 'react';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

interface GaussianSplatCanvasProps {
  splatSrc: string;
  initialCameraPosition?: [number, number, number];
  initialCameraLookAt?: [number, number, number];
  onReady: () => void;
  onError: () => void;
  onProgress?: (pct: number) => void;
}

export default function GaussianSplatCanvas({
  splatSrc,
  initialCameraPosition = [0.2, 1.8, 4.5],
  initialCameraLookAt   = [0, 0.2, 0],
  onReady,
  onError,
  onProgress,
}: GaussianSplatCanvasProps) {
  const mountRef   = useRef<HTMLDivElement>(null);
  const viewerRef  = useRef<InstanceType<typeof GaussianSplats3D.Viewer> | null>(null);
  const readyFired = useRef(false);

  const safeReady = useCallback(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    onReady();
  }, [onReady]);

  const cleanup = useCallback(() => {
    try {
      if (viewerRef.current) {
        viewerRef.current.stop();
        viewerRef.current.dispose();
      }
    } catch { /* ignore cleanup errors */ }
    viewerRef.current = null;
  }, []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let cancelled = false;
    readyFired.current = false;

    async function init() {
      try {
        const viewer = new GaussianSplats3D.Viewer({
          rootElement: el || undefined,
          cameraUp: [0, 1, 0],
          initialCameraPosition,
          initialCameraLookAt,
          selfDrivenMode: true,
          useBuiltInControls: true,
          gpuAcceleratedSort: false,
          sharedMemoryForWorkers: false,
          halfPrecisionCovariancesOnGPU: false,
          dynamicScene: false,
          logLevel: GaussianSplats3D.LogLevel.None,
        });

        viewerRef.current = viewer;

        await viewer.addSplatScene(splatSrc, {
          // 180° X-axis rotation: corrects Polycam/ksplat Y-axis-down convention
          rotation: [1, 0, 0, 0],
          position: [0, 0, 0],
          scale:    [1, 1, 1],
          // Remove near-transparent noisy splats that cause hazy/blurry appearance
          splatAlphaRemovalThreshold: 5,
          progressiveLoad: false,
          showLoadingUI: false,
          onProgress: (percentComplete: number) => {
            if (!cancelled && typeof percentComplete === 'number' && !isNaN(percentComplete)) {
              const clamped = Math.min(98, Math.max(1, Math.round(percentComplete)));
              onProgress?.(clamped);
            }
          },
        });

        if (cancelled) {
          try { viewer.stop(); viewer.dispose(); } catch { /* ignore */ }
          return;
        }

        viewer.start();
        onProgress?.(100);
        safeReady();

      } catch (err) {
        if (!cancelled) {
          console.error('[GaussianSplatCanvas] init error:', err);
          onError();
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  // Stable refs — exclude from deps to avoid re-init on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splatSrc]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      aria-label="Interactive EntireFM 3D viewer — drag to orbit, scroll to zoom"
      role="img"
      style={{ cursor: 'grab' }}
    />
  );
}
