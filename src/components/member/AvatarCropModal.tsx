'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, AlertCircle, Upload } from 'lucide-react';

interface AvatarCropModalProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (croppedBlob: Blob) => Promise<void> | void;
  saving?: boolean;
}

const CROP_CONTAINER_SIZE = 320; // Size of the interactive square viewport in px
const OUTPUT_SIZE = 800; // Target output resolution for sharp avatar

export function AvatarCropModal({
  file,
  isOpen,
  onClose,
  onConfirm,
  saving = false,
}: AvatarCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load image from file with validation
  useEffect(() => {
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file exceeds the 10MB maximum limit.');
      return;
    }

    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);

    const img = new window.Image();
    img.onload = () => {
      setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      imageRef.current = img;

      // Calculate initial zoom so image fits and covers container
      const minDim = Math.min(img.naturalWidth, img.naturalHeight);
      const initialScale = CROP_CONTAINER_SIZE / minDim;
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };
    img.onerror = () => {
      setError('Failed to load the selected image.');
    };
    img.src = objectUrl;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // Update canvas preview
  const drawPreview = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !naturalDimensions) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = CROP_CONTAINER_SIZE;
    canvas.height = CROP_CONTAINER_SIZE;

    ctx.clearRect(0, 0, CROP_CONTAINER_SIZE, CROP_CONTAINER_SIZE);

    const img = imageRef.current;
    const scale = (Math.max(CROP_CONTAINER_SIZE / img.naturalWidth, CROP_CONTAINER_SIZE / img.naturalHeight)) * zoom;
    const renderWidth = img.naturalWidth * scale;
    const renderHeight = img.naturalHeight * scale;

    const renderX = (CROP_CONTAINER_SIZE - renderWidth) / 2 + position.x;
    const renderY = (CROP_CONTAINER_SIZE - renderHeight) / 2 + position.y;

    ctx.save();
    ctx.drawImage(img, renderX, renderY, renderWidth, renderHeight);
    ctx.restore();
  }, [zoom, position, naturalDimensions]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Handle Drag / Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Touch for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.8), 3.5));
  };

  // Generate cropped output blob
  const handleConfirmCrop = async () => {
    if (!imageRef.current || !naturalDimensions) return;
    const img = imageRef.current;

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = OUTPUT_SIZE;
    outputCanvas.height = OUTPUT_SIZE;
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return;

    // High quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const ratio = OUTPUT_SIZE / CROP_CONTAINER_SIZE;
    const scale = (Math.max(CROP_CONTAINER_SIZE / img.naturalWidth, CROP_CONTAINER_SIZE / img.naturalHeight)) * zoom;
    const renderWidth = img.naturalWidth * scale * ratio;
    const renderHeight = img.naturalHeight * scale * ratio;

    const renderX = ((CROP_CONTAINER_SIZE - img.naturalWidth * scale) / 2 + position.x) * ratio;
    const renderY = ((CROP_CONTAINER_SIZE - img.naturalHeight * scale) / 2 + position.y) * ratio;

    ctx.drawImage(img, renderX, renderY, renderWidth, renderHeight);

    outputCanvas.toBlob(
      async (blob) => {
        if (blob) {
          await onConfirm(blob);
        } else {
          setError('Failed to process image crop.');
        }
      },
      'image/webp',
      0.92
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
    >
      <div className="bg-white rounded-[8px] border border-neutral-200 shadow-2xl max-w-lg w-full overflow-hidden text-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h3 id="crop-modal-title" className="text-base font-light text-neutral-900">
              Adjust Profile Photo
            </h3>
            <p className="text-xs font-extralight text-neutral-500">
              Drag to reposition and adjust the zoom for your avatar
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-1 text-neutral-400 hover:text-neutral-900 rounded-[4px] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-[6px] bg-rose-50 border border-rose-200 text-rose-800 text-xs font-light flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Interactive Crop Viewport + Circular Preview */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Square Interactive Canvas */}
            <div className="space-y-1 text-center">
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
                className="relative w-[320px] h-[320px] bg-neutral-900 rounded-[6px] overflow-hidden cursor-grab active:cursor-grabbing select-none border border-neutral-300 shadow-inner"
              >
                <canvas ref={canvasRef} className="w-full h-full" />
                
                {/* Circular Mask Overlay */}
                <div className="absolute inset-0 pointer-events-none border border-brand-electric/40 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
                
                {/* Centre crosshair hairline guide */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-4 h-px bg-white/30" />
                  <div className="h-4 w-px bg-white/30 absolute" />
                </div>
              </div>
              <span className="text-[11px] font-extralight text-neutral-400">
                Drag to reposition · Scroll / pinch to zoom
              </span>
            </div>

            {/* Live Circular Output Preview */}
            <div className="flex flex-col items-center space-y-2 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Preview
              </span>
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neutral-300 shadow-sm relative bg-[#121826]">
                <canvas
                  style={{
                    width: 80,
                    height: 80,
                    transform: `scale(${80 / CROP_CONTAINER_SIZE})`,
                    transformOrigin: 'top left',
                  }}
                  ref={(node) => {
                    if (node && canvasRef.current) {
                      node.width = CROP_CONTAINER_SIZE;
                      node.height = CROP_CONTAINER_SIZE;
                      const ctx = node.getContext('2d');
                      if (ctx) {
                        ctx.drawImage(canvasRef.current, 0, 0);
                      }
                    }
                  }}
                />
              </div>
              <span className="text-[10px] font-extralight text-neutral-400">
                Lobby UI
              </span>
            </div>
          </div>

          {/* Zoom Slider Controls */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-extralight text-neutral-600">
              <span className="flex items-center gap-1">
                <ZoomOut className="w-3.5 h-3.5" /> Scale
              </span>
              <span className="font-mono text-[11px]">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.8"
                max="3.0"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                }}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded border border-neutral-200 text-xs flex items-center gap-1 transition-colors shrink-0"
                title="Reset crop"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-extralight text-neutral-700 hover:text-neutral-900 rounded-[6px] border border-neutral-300 hover:border-neutral-400 bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            disabled={saving}
            className="px-5 py-2 text-xs font-extralight uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-[6px] flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>{saving ? 'Saving...' : 'Save Profile Photo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
