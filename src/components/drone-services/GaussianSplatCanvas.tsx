'use client';

/**
 * GaussianSplatCanvas — raw WebGL canvas using @mkkellogg/gaussian-splats-3d
 *
 * Dynamically imported with { ssr: false } so it only runs in the browser.
 * Mounts and owns the Three.js / WebGL lifecycle.
 *
 * Polycam exports with Y-axis down. We compensate by setting:
 *   rotation: [1, 0, 0, 0] (180° around X) with standard cameraUp [0, 1, 0]
 * so the scene renders upright and properly framed on load.
 */

import { useEffect, useRef, useCallback } from 'react';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

interface Props {
  splatSrc: string;
  onReady: () => void;
  onError: () => void;
  onProgress?: (pct: number) => void;
  initialCameraPosition?: [number, number, number];
  initialCameraLookAt?: [number, number, number];
}

export default function GaussianSplatCanvas({
  splatSrc,
  onReady,
  onError,
  onProgress,
  initialCameraPosition = [0.2, 1.8, 4.5],
  initialCameraLookAt = [0, 0.2, 0],
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<InstanceType<typeof GaussianSplats3D.Viewer> | null>(null);
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
    } catch {}
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
          orbitControls: {
            enableDamping: true,
            dampingFactor: 0.08,
            enableZoom: true,
            zoomSpeed: 0.8,
            minDistance: 0.5,
            maxDistance: 30,
            enablePan: true,
            panSpeed: 0.6,
            autoRotate: false,
            maxPolarAngle: Math.PI / 2 + 0.2, // Prevents flipping under the ground plane
          },
        });

        viewerRef.current = viewer;

        await viewer.addSplatScene(splatSrc, {
          splatAlphaRemovalThreshold: 5,
          rotation: [1, 0, 0, 0],
          position: [0, 0, 0],
          scale: [1, 1, 1],
          progressiveLoad: false,
          showLoadingUI: false,
          onProgress: (percentComplete: number) => {
            if (!cancelled && typeof percentComplete === 'number') {
              const clamped = Math.min(98, Math.max(1, Math.round(percentComplete)));
              onProgress?.(clamped);
            }
          },
        });

        if (cancelled) {
          try {
            viewer.stop();
            viewer.dispose();
          } catch {}
          return;
        }

        // Start viewer render loop
        viewer.start();

        // Signal completion
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
  }, [splatSrc, onReady, onError, onProgress, safeReady, cleanup, initialCameraPosition, initialCameraLookAt]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      aria-label="Interactive 3D viewer — drag to orbit, scroll to zoom"
      role="img"
      style={{ cursor: 'grab' }}
    />
  );
}
