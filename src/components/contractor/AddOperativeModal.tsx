'use client';

import React, { useState } from 'react';
import { X, UserPlus, Wrench, Award, GraduationCap, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { EmploymentStatus } from '@/server/contractor/workforce-service';
import {
  CANONICAL_QUALIFICATIONS,
  CANONICAL_TRAINING_COURSES,
  CANONICAL_COMPETENCIES,
} from '@/server/contractor/competency-framework';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contractorOrgId: string;
}

export function AddOperativeModal({ isOpen, onClose, onSuccess, contractorOrgId }: Props) {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('Commercial Field Engineer');
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>('EMPLOYED');
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [homePostcode, setHomePostcode] = useState('');
  const [selectedTrades, setSelectedTrades] = useState<string[]>(['Mechanical & Electrical']);
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [training, setTraining] = useState<any[]>([]);

  if (!isOpen) return null;

  const toggleTrade = (trade: string) => {
    setSelectedTrades((prev) =>
      prev.includes(trade) ? prev.filter((t) => t !== trade) : [...prev, trade]
    );
  };

  const toggleCompetency = (code: string) => {
    setSelectedCompetencies((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErrorMsg('First name, last name, and work email are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contractor/workforce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorOrgId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          jobTitle: jobTitle.trim(),
          employmentStatus,
          isSupervisor,
          homePostcode: homePostcode.trim() || undefined,
          trades: selectedTrades,
          competencies: selectedCompetencies,
          qualifications,
          training,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to create operative');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while creating operative');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-void/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-edge-dark bg-brand-void/50">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              WORKFORCE ONBOARDING
            </span>
            <h2 className="text-base font-light text-white">Add Field Operative / Engineer</h2>
          </div>
          <button onClick={onClose} className="text-brand-mist/60 hover:text-white p-1 rounded-lg hover:bg-brand-edge-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-brand-void/30 border-b border-brand-edge-dark/50 text-[11px] font-normal">
          <span className={step === 1 ? 'text-brand-electric font-semibold' : 'text-brand-mist/40'}>
            1. Identity &amp; Role
          </span>
          <span className="text-brand-mist/30">&rarr;</span>
          <span className={step === 2 ? 'text-brand-electric font-semibold' : 'text-brand-mist/40'}>
            2. Trades &amp; Scopes
          </span>
          <span className="text-brand-mist/30">&rarr;</span>
          <span className={step === 3 ? 'text-brand-electric font-semibold' : 'text-brand-mist/40'}>
            3. Competencies
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-normal">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Basic Identity & Role */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-brand-mist/70 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. David"
                    className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-brand-mist/70 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Miller"
                    className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-brand-mist/70 block mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="david.m@apex-engineering.co.uk"
                    className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-brand-mist/70 block mb-1">Work Mobile Telephone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7700 900123"
                    className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-brand-mist/70 block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Senior HVAC Engineer"
                    className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-brand-mist/70 block mb-1">Employment Relationship</label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value as EmploymentStatus)}
                    className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-xs font-normal focus:border-brand-electric focus:outline-none"
                  >
                    <option value="EMPLOYED">Direct PAYE Employee</option>
                    <option value="DIRECTOR">Company Director / Partner</option>
                    <option value="SUBCONTRACTOR">Approved Subcontract Operative</option>
                    <option value="FREELANCE">Self-Employed Freelance</option>
                    <option value="AGENCY_WORKER">Agency Labour</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isSupervisor"
                  checked={isSupervisor}
                  onChange={(e) => setIsSupervisor(e.target.checked)}
                  className="rounded border-brand-edge-dark bg-brand-void text-brand-electric focus:ring-0"
                />
                <label htmlFor="isSupervisor" className="text-brand-mist text-xs font-sans">
                  Designate as Field Lead / Qualified Supervisor
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: Trades & Service Scopes */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-brand-mist/70 block mb-2 font-sans">Approved Engineering Trades</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Mechanical & Electrical',
                    'Electrical & Testing',
                    'Commercial Gas & Heating',
                    'HVAC & Refrigeration',
                    'Plumbing & Drainage',
                    'Fire & Life Safety',
                    'Water Hygiene & ACOP L8',
                    'Building Fabric & Roofing',
                    'Rope Access',
                    'Grounds & External',
                  ].map((trade) => {
                    const isSelected = selectedTrades.includes(trade);
                    return (
                      <button
                        key={trade}
                        type="button"
                        onClick={() => toggleTrade(trade)}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors font-sans text-xs ${
                          isSelected
                            ? 'bg-brand-electric/10 border-brand-electric text-white'
                            : 'bg-brand-void border-brand-edge-dark text-brand-mist/70 hover:bg-brand-edge-dark/30'
                        }`}
                      >
                        <span>{trade}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-electric shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1 font-sans">Home / Dispatch Postcode Area</label>
                <input
                  type="text"
                  value={homePostcode}
                  onChange={(e) => setHomePostcode(e.target.value)}
                  placeholder="e.g. M1 4BT"
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-normal text-xs focus:border-brand-electric focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Competencies & Accreditations */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="text-brand-mist/70 block mb-2 font-sans">
                Select Active Verified Competencies
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {CANONICAL_COMPETENCIES.map((comp) => {
                  const isSelected = selectedCompetencies.includes(comp.code);
                  return (
                    <button
                      key={comp.code}
                      type="button"
                      onClick={() => toggleCompetency(comp.code)}
                      className={`p-2.5 rounded-lg border text-left flex items-start justify-between transition-colors font-sans text-xs ${
                        isSelected
                          ? 'bg-brand-electric/10 border-brand-electric text-white'
                          : 'bg-brand-void border-brand-edge-dark text-brand-mist/70 hover:bg-brand-edge-dark/30'
                      }`}
                    >
                      <div>
                        <span className="font-medium text-white block">{comp.title}</span>
                        <span className="text-[10px] text-brand-mist/50 font-normal block mt-0.5">{comp.trade}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-electric shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-edge-dark bg-brand-void/50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
            >
              Cancel
            </button>
            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 1 && (!firstName.trim() || !lastName.trim() || !email.trim())) {
                    setErrorMsg('First name, last name, and work email are required.');
                    return;
                  }
                  setErrorMsg(null);
                  setStep(step + 1);
                }}
                className="px-4 py-2 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85"
              >
                Next &rarr;
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Add Operative'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
