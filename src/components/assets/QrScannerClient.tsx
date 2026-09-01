'use client';

/**
 * CLIENT COMPONENT: QrScannerClient
 * =================================
 * Mobile-first camera scanner with BarcodeDetector API, manual fallback,
 * and rapid asset resolution.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, QrCode, Search, CheckCircle, AlertTriangle, RefreshCw, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface QrScannerClientProps {
  sessionUser: {
    id: string;
    name: string;
    role: string;
    orgType: string;
  };
}

export function QrScannerClient({ sessionUser }: QrScannerClientProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedAsset, setResolvedAsset] = useState<any | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [scanStream, setScanStream] = useState<MediaStream | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const scanLoopRef = useRef<number | null>(null);
  const isDetectingRef = useRef(false);

  // Stop Camera & Frame Loop
  const stopCamera = () => {
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    if (scanStream) {
      scanStream.getTracks().forEach((track) => track.stop());
      setScanStream(null);
    }
    setCameraActive(false);
  };

  // Continuous live video decode loop
  const startLiveScanLoop = () => {
    const checkFrame = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2 || isDetectingRef.current || hasScanned) {
        if (cameraActive) {
          scanLoopRef.current = requestAnimationFrame(checkFrame);
        }
        return;
      }

      isDetectingRef.current = true;
      try {
        if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
          const detector = new (window as any).BarcodeDetector({ formats: ['qr_code', 'code_128', 'ean_13'] });
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
            const raw = barcodes[0].rawValue.trim();
            if (raw) {
              setHasScanned(true);
              stopCamera();
              resolveScannedCode(raw);
              return;
            }
          }
        } else if (canvasRef.current && videoRef.current.videoWidth > 0) {
          // Fallback canvas frame inspection for standard browsers
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          }
        }
      } catch (err) {
        // Continue loop on non-fatal frame decode errors
      } finally {
        isDetectingRef.current = false;
        if (!hasScanned) {
          scanLoopRef.current = requestAnimationFrame(checkFrame);
        }
      }
    };

    scanLoopRef.current = requestAnimationFrame(checkFrame);
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    setHasScanned(false);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera stream not supported in this browser environment. Use photo upload or manual entry below.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.warn);
          startLiveScanLoop();
        };
      }
      setScanStream(stream);
      setCameraActive(true);
    } catch (err: any) {
      console.warn('[CAMERA_INIT_ERROR]', err);
      setCameraError(err.message || 'Unable to access camera');
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle barcode / QR text resolution
  const resolveScannedCode = async (code: string) => {
    if (!code || isResolving) return;
    setIsResolving(true);
    setResolveError(null);

    // Extract asset ID or reference if URL was scanned
    let target = code.trim();
    if (target.includes('/asset/')) {
      const parts = target.split('/asset/');
      target = parts[parts.length - 1].split('?')[0].split('#')[0];
    }

    try {
      const res = await fetch(`/api/asset-intelligence/${encodeURIComponent(target)}`);
      if (res.ok) {
        const data = await res.json();
        setResolvedAsset(data.asset || data);
        stopCamera();
        return;
      }

      // Fallback search by asset reference
      const searchRes = await fetch(`/api/admin/assets?search=${encodeURIComponent(target)}`);
      if (searchRes.ok) {
        const data = await searchRes.json();
        if (data.assets && data.assets.length > 0) {
          setResolvedAsset(data.assets[0]);
          stopCamera();
          return;
        }
      }

      // Navigate directly to /asset/[target] as candidate ID
      router.push(`/asset/${encodeURIComponent(target)}`);
    } catch (err: any) {
      setResolveError(`Failed to resolve asset code '${target}'. Please verify reference.`);
    } finally {
      setIsResolving(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      resolveScannedCode(manualCode.trim());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate scanning photo by prompting or parsing
    const reader = new FileReader();
    reader.onload = () => {
      // In production, BarcodeDetector API reads from image bitmap
      if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code', 'code_128', 'ean_13'] });
        const img = new Image();
        img.src = reader.result as string;
        img.onload = async () => {
          try {
            const barcodes = await barcodeDetector.detect(img);
            if (barcodes.length > 0) {
              resolveScannedCode(barcodes[0].rawValue);
              return;
            }
            setResolveError('No QR code detected in image. Try manual search.');
          } catch {
            setResolveError('Could not process image. Try manual reference.');
          }
        };
      } else {
        setResolveError('Image scanning not supported in this browser. Please type the Asset Reference below.');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* ─── SCANNER VIEWPORT ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/80 overflow-hidden shadow-2xl relative">
        <div className="p-4 border-b border-brand-edge-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-brand-electric" />
            <span className="text-xs font-medium text-white uppercase tracking-wider">Camera Viewfinder</span>
          </div>
          {cameraActive && (
            <button
              onClick={stopCamera}
              className="text-[11px] text-brand-mist/60 hover:text-white px-2 py-1 rounded border border-brand-edge-dark"
            >
              Stop Camera
            </button>
          )}
        </div>

        <div className="relative aspect-video sm:aspect-[4/3] bg-brand-void/90 flex items-center justify-center overflow-hidden">
          {cameraActive ? (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Animated Target Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 border-2 border-brand-electric rounded-2xl relative shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white rounded-br" />
                  <div className="w-full h-0.5 bg-brand-electric/80 absolute top-1/2 -translate-y-1/2 animate-pulse" />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-carbon border border-brand-edge-dark flex items-center justify-center mx-auto text-brand-electric">
                <QrCode className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white font-normal">Ready to Scan Asset Tag</p>
                <p className="text-[11px] text-brand-mist/60 max-w-xs mx-auto">
                  Point camera at the EntireFM asset QR tag or upload a clear photo of the equipment label.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={startCamera}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-electric/20"
                >
                  <Camera className="w-4 h-4" /> Open Camera
                </button>
                <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-brand-edge-dark bg-brand-void text-brand-mist text-xs hover:text-white cursor-pointer transition-all flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4" /> Upload Tag Photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-0 bg-brand-void/90 flex items-center justify-center p-6 text-center">
              <div className="max-w-xs space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-xs text-white font-normal">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 rounded-lg bg-brand-electric text-white text-xs"
                >
                  Retry Camera
                </button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* ─── MANUAL ASSET REFERENCE SEARCH ───────────────────────────────── */}
      <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-5 space-y-3">
        <h2 className="text-xs font-medium text-white uppercase tracking-wider">Manual Reference / Tag Lookup</h2>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-mist/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. AST-00142, EFM-ASSET-099, or UUID"
              className="w-full rounded-xl bg-brand-void border border-brand-edge-dark pl-9 pr-4 py-2.5 text-xs text-white placeholder-brand-mist/30 focus:border-brand-electric focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={!manualCode.trim() || isResolving}
            className="px-4 py-2.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all disabled:opacity-40 flex items-center gap-1.5"
          >
            {isResolving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            Resolve
          </button>
        </form>

        {resolveError && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{resolveError}</span>
          </div>
        )}
      </div>

      {/* ─── RESOLVED ASSET PREVIEW CARD ─────────────────────────────────── */}
      {resolvedAsset && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10.5px] font-bold">
                  {resolvedAsset.asset_reference || 'TAG MATCHED'}
                </span>
                <span className="text-xs text-brand-mist/60">{resolvedAsset.category || 'Asset'}</span>
              </div>
              <h3 className="text-lg font-light text-white">{resolvedAsset.name}</h3>
              <p className="text-xs text-brand-mist/70 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-electric" />
                {resolvedAsset.site?.name || 'Site Registered'}
              </p>
            </div>
            <a
              href={`/asset/${resolvedAsset.id}`}
              className="px-4 py-2 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all flex items-center gap-1.5 shadow-md shadow-brand-electric/20"
            >
              Open Asset <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
