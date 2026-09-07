'use client';

import React, { useState } from 'react';
import { X, Shield, FileText, CheckCircle2, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function RamsWizardModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<number>(1);
  const [taskTitle, setTaskTitle] = useState('Commercial Air Handling Unit Filter Replacement');
  const [siteLocation, setSiteLocation] = useState('EntireFM Managed Facility');
  const [selectedHazards, setSelectedHazards] = useState<string[]>([
    'WORKING_AT_HEIGHT',
    'ELECTRICAL_ISOLATION',
    'DUST_AND_PARTICLES',
  ]);
  const [selectedPPE, setSelectedPPE] = useState<string[]>([
    'SAFETY_BOOTS',
    'HI_VIS',
    'GLOVES',
    'EYE_PROTECTION',
  ]);

  if (!isOpen) return null;

  const toggleHazard = (code: string) => {
    setSelectedHazards((prev) =>
      prev.includes(code) ? prev.filter((h) => h !== code) : [...prev, code]
    );
  };

  const togglePPE = (code: string) => {
    setSelectedPPE((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAFAF8] backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-[#E8E8E5] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E5] bg-[#FAFAF8]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              RAMS &amp; JOB PACK BUILDER
            </span>
            <h2 className="text-base font-light text-[#111111]">Create Task-Specific RAMS Document</h2>
          </div>
          <button onClick={onClose} className="text-[#6D6D68] hover:text-white p-1 rounded-lg hover:bg-[#F5F5F3]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-[#6D6D68] block mb-1">Task Title / Work Scope *</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5] text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[#6D6D68] block mb-1">Site / Facility Name</label>
                <input
                  type="text"
                  value={siteLocation}
                  onChange={(e) => setSiteLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5] text-white text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#6D6D68] block">Identified Task Hazards</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'WORKING_AT_HEIGHT', label: 'Working at Height / Ladders' },
                    { id: 'ELECTRICAL_ISOLATION', label: 'Electrical Isolation (Safe Isolation)' },
                    { id: 'DUST_AND_PARTICLES', label: 'Dust & Airborne Particulates' },
                    { id: 'CONFINED_SPACE', label: 'Confined / Enclosed Plant Space' },
                    { id: 'HOT_WORKS', label: 'Hot Works / Brazing' },
                    { id: 'MANUAL_HANDLING', label: 'Heavy Manual Handling' },
                  ].map((haz) => {
                    const isSelected = selectedHazards.includes(haz.id);
                    return (
                      <button
                        key={haz.id}
                        type="button"
                        onClick={() => toggleHazard(haz.id)}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-brand-electric/10 border-brand-electric text-white'
                            : 'bg-[#FAFAF8] border-[#E8E8E5] text-[#6D6D68] hover:bg-[#F5F5F3]'
                        }`}
                      >
                        <span>{haz.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-electric shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#111111]">Mandatory PPE &amp; Control Measures</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'SAFETY_BOOTS', label: 'Steel Toe Cap Safety Boots' },
                  { id: 'HI_VIS', label: 'High Visibility Vest / Jacket' },
                  { id: 'GLOVES', label: 'Cut Resistant / Nitrile Gloves' },
                  { id: 'EYE_PROTECTION', label: 'Safety Glasses / Goggles' },
                  { id: 'HARD_HAT', label: 'Hard Hat / Bump Cap' },
                  { id: 'RESPIRATOR', label: 'FFP3 Dust Mask / Respirator' },
                ].map((ppe) => {
                  const isSelected = selectedPPE.includes(ppe.id);
                  return (
                    <button
                      key={ppe.id}
                      type="button"
                      onClick={() => togglePPE(ppe.id)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-brand-electric/10 border-brand-electric text-white'
                          : 'bg-[#FAFAF8] border-[#E8E8E5] text-[#6D6D68] hover:bg-[#F5F5F3]'
                      }`}
                    >
                      <span>{ppe.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-electric shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E8E5] bg-[#FAFAF8] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg border border-[#E8E8E5] text-xs text-[#111111] hover:text-white"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#E8E8E5] text-xs text-[#111111] hover:text-white"
            >
              Cancel
            </button>
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85"
              >
                Continue to Controls &rarr;
              </button>
            ) : (
              <button
                onClick={() => {
                  alert('RAMS template compiled and saved to your organisation vault.');
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
              >
                Generate &amp; Save RAMS Pack
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
