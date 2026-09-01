'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, RotateCcw, Check } from 'lucide-react';
import type { SignatureType, ReportSignature } from '@/server/field-reports/types';

interface Props {
  type: SignatureType;
  title: string;
  defaultName: string;
  defaultPosition?: string;
  existingSignature?: ReportSignature;
  declarationText?: string;
  onSaveSignature: (sig: {
    signatureType: SignatureType;
    signatoryName: string;
    signatoryPosition?: string;
    signatureDataUrl?: string;
    declarationText?: string;
  }) => Promise<void>;
  disabled?: boolean;
}

export default function SignatureCapture({
  type,
  title,
  defaultName,
  defaultPosition,
  existingSignature,
  declarationText,
  onSaveSignature,
  disabled,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [name, setName] = useState(existingSignature?.signatory_name || defaultName || '');
  const [position, setPosition] = useState(existingSignature?.signatory_position || defaultPosition || '');
  const [isSaved, setIsSaved] = useState(!!existingSignature);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize Canvas for high-DPI displays
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#38BDF8'; // High-contrast electric blue ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || isSaved) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled || isSaved) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      let dataUrl: string | undefined;
      if (canvasRef.current && hasDrawn) {
        dataUrl = canvasRef.current.toDataURL('image/png');
      }

      await onSaveSignature({
        signatureType: type,
        signatoryName: name,
        signatoryPosition: position,
        signatureDataUrl: dataUrl,
        declarationText,
      });
      setIsSaved(true);
    } catch (err) {
      console.error('Signature save error', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            {title}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {declarationText || 'I confirm the accuracy of this record in accordance with EntireFM Rev 4.0 specifications.'}
          </p>
        </div>
        {isSaved && (
          <span className="text-[10px] font-normal uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
            <Check className="w-3 h-3" /> Signed
          </span>
        )}
      </div>

      {/* Name and Position */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Print Name *
          </label>
          <input
            type="text"
            value={name}
            disabled={disabled || isSaved}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jack Turner"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Position / Title
          </label>
          <input
            type="text"
            value={position}
            disabled={disabled || isSaved}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g. Lead M&E Engineer"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </div>
      </div>

      {/* Touch Signature Canvas */}
      {!isSaved ? (
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Touch / Stylus Signature (or sign digitally below)
          </label>
          <div className="relative border-2 border-dashed border-slate-700 bg-slate-950 rounded-xl overflow-hidden touch-none">
            <canvas
              ref={canvasRef}
              width={500}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[140px] cursor-crosshair"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-500 font-normal">
                Sign here with finger or stylus
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-1">
            <button
              type="button"
              onClick={clearCanvas}
              disabled={!hasDrawn || isSaving}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim() || isSaving}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Recording…' : 'Confirm Signature'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/80 border border-emerald-900/50 rounded-lg p-3 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-white">{name}</span>
            <span className="text-slate-400 ml-2">({position || 'Signatory'})</span>
            <div className="text-[10px] text-slate-500 font-normal mt-0.5">
              Signed at: {existingSignature?.signed_at ? new Date(existingSignature.signed_at).toLocaleString('en-GB') : 'Recorded in audit vault'}
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => setIsSaved(false)}
              className="text-[11px] text-indigo-400 hover:underline"
            >
              Change
            </button>
          )}
        </div>
      )}
    </div>
  );
}
