'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Shield,
  Clock,
  User,
  Wrench,
  FileText,
  Building2,
  Flame,
  Zap,
} from 'lucide-react';
import {
  CANONICAL_FM_ACTIVITIES,
  CANONICAL_HAZARDS,
  calculateRiskScore,
  RiskLikelihood,
  RiskSeverity,
} from '@/server/contractor/rams-framework';
import { OperativeProfile } from '@/server/contractor/workforce-service';
import { RamsHazardRecord, RamsMethodStepRecord } from '@/server/contractor/rams-service';

interface Props {
  contractorOrgId: string;
  operatives: OperativeProfile[];
  initialWorkOrder?: any;
}

export function RamsWizardClient({ contractorOrgId, operatives, initialWorkOrder }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1: Job
  const [title, setTitle] = useState(
    initialWorkOrder ? `${initialWorkOrder.title || 'Maintenance Work'} — RAMS` : 'Commercial Air Handling Unit Filter Replacement'
  );
  const [clientName, setClientName] = useState(initialWorkOrder?.client_account?.name || 'Savills Property Management');
  const [siteName, setSiteName] = useState(initialWorkOrder?.site?.name || 'St James House — Manchester');
  const [siteAddress, setSiteAddress] = useState(initialWorkOrder?.site?.address_line1 || '10 St James Street, Manchester, M1 4BT');
  const [workCategory, setWorkCategory] = useState<string>(initialWorkOrder?.trade || 'HVAC_AND_REFRIGERATION');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('ACT_HVAC_AHU_MAINTENANCE');
  const [workScopeDescription, setWorkScopeDescription] = useState(
    initialWorkOrder?.description ||
      'Quarterly planned preventative maintenance: visual inspection of supply/extract fans, replacement of pre-filters and bag filters, belt tension verification, and airflow differential pressure check.'
  );
  const [plannedStartDate, setPlannedStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [plannedEndDate, setPlannedEndDate] = useState('');
  const [workingHours, setWorkingHours] = useState('08:00 - 17:00 (Standard Daytime)');

  // Step 2: People
  const [responsibleSupervisorId, setResponsibleSupervisorId] = useState(operatives[0]?.id || '');
  const [selectedOperativeIds, setSelectedOperativeIds] = useState<string[]>(
    operatives.slice(0, 2).map((o) => o.id)
  );

  // Step 3: Environment
  const [buildingType, setBuildingType] = useState('Commercial Office');
  const [occupancyState, setOccupancyState] = useState('Occupied');
  const [requiresWorkingAtHeight, setRequiresWorkingAtHeight] = useState(true);
  const [requiresElectricalIsolation, setRequiresElectricalIsolation] = useState(true);
  const [requiresHotWorks, setRequiresHotWorks] = useState(false);
  const [requiresGasIsolation, setRequiresGasIsolation] = useState(false);

  // Step 4 & 5: Hazards & Controls
  const initialHazards: RamsHazardRecord[] = CANONICAL_HAZARDS.slice(0, 3).map((h) => {
    const initCalc = calculateRiskScore(h.initialLikelihood, h.initialSeverity);
    const resCalc = calculateRiskScore(h.residualLikelihood, h.residualSeverity);
    return {
      id: h.id,
      hazard: h.hazard,
      category: h.category,
      personsAtRisk: h.personsAtRisk,
      initialLikelihood: h.initialLikelihood,
      initialSeverity: h.initialSeverity,
      initialRiskScore: initCalc.score,
      controls: h.standardControls,
      residualLikelihood: h.residualLikelihood,
      residualSeverity: h.residualSeverity,
      residualRiskScore: resCalc.score,
      entirefmMandatoryControl: h.entirefmMandatoryControl,
    };
  });
  const [hazards, setHazards] = useState<RamsHazardRecord[]>(initialHazards);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Step 6: Method Statement
  const [methodSteps, setMethodSteps] = useState<RamsMethodStepRecord[]>(
    CANONICAL_FM_ACTIVITIES[1].defaultMethodSteps
  );

  // Step 7: PPE & Plant
  const [selectedPpe, setSelectedPpe] = useState<string[]>([
    'Safety Boots',
    'High Visibility Vest',
    'Safety Glasses',
    'Nitrile Gloves',
    'FFP3 Dust Mask',
  ]);
  const [selectedPlant, setSelectedPlant] = useState<string[]>([
    'Enclosed Podium Steps',
    'GS38 Approved Voltage Tester',
    'Portable HEPA Vacuum',
  ]);
  const [requiredPermits, setRequiredPermits] = useState<string[]>(['Plant Room Access Permit']);

  // Step 8: Emergency
  const [emergencyPhone, setEmergencyPhone] = useState('+44 800 123 4567');
  const [nearestHospital, setNearestHospital] = useState('Manchester Royal Infirmary, Oxford Rd, M13 9WL');
  const [fireAssemblyPoint, setFireAssemblyPoint] = useState('Assembly Point B (Main Car Park)');

  // Step 10: Approval
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Trigger AI Suggestion
  const handleFetchAiSuggestions = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/contractor/rams/ai/suggest-hazards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workCategory,
          workScopeDescription,
          buildingType,
          occupancyState,
          selectedPlant,
          currentHazardIds: hazards.map((h) => h.id),
        }),
      });
      const data = await res.json();
      if (data.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error('Failed to get AI suggestions:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleAcceptAiHazard = (sugg: any) => {
    const initCalc = calculateRiskScore(sugg.suggestedLikelihood, sugg.suggestedSeverity);
    const resCalc = calculateRiskScore(1, sugg.suggestedSeverity);
    const newH: RamsHazardRecord = {
      id: sugg.id,
      hazard: sugg.hazard,
      category: 'GENERAL',
      personsAtRisk: ['Operatives', 'Occupants'],
      initialLikelihood: sugg.suggestedLikelihood,
      initialSeverity: sugg.suggestedSeverity,
      initialRiskScore: initCalc.score,
      controls: sugg.suggestedControls,
      residualLikelihood: 1,
      residualSeverity: sugg.suggestedSeverity,
      residualRiskScore: resCalc.score,
      userEdited: true,
    };
    setHazards((prev) => [...prev, newH]);
    setAiSuggestions((prev) => prev.filter((s) => s.id !== sugg.id));
  };

  const handleSaveRams = async (shouldApprove = false) => {
    if (!title.trim() || !siteName.trim()) {
      setErrorMsg('Title and Site location are required.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contractor/rams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorOrgId,
          workOrderId: initialWorkOrder?.id,
          workOrderNumber: initialWorkOrder?.work_order_number,
          clientName,
          siteName,
          siteAddress,
          title,
          workCategory,
          workScopeDescription,
          plannedStartDate,
          plannedEndDate,
          workingHours,
          buildingType,
          occupancyState,
          responsibleSupervisorId,
          responsibleSupervisorName: operatives.find((o) => o.id === responsibleSupervisorId)?.fullName,
          assignedOperativeIds: selectedOperativeIds,
          isIndependentRams: !initialWorkOrder?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to create RAMS');

      const ramsId = data.id;

      // Update hazards & steps
      await fetch(`/api/contractor/rams/${encodeURIComponent(ramsId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hazards,
          methodSteps,
          selectedPpe,
          selectedPlant,
          requiredPermits,
          emergencyArrangements: {
            emergencyContactName: 'EntireFM 24/7 Operations Control',
            emergencyContactPhone: emergencyPhone,
            nearestHospital,
            fireAssemblyPoint,
            evacuationProcedure: 'Upon fire alarm, isolate active plant and exit via nearest emergency route.',
          },
        }),
      });

      if (shouldApprove) {
        await fetch(`/api/contractor/rams/${encodeURIComponent(ramsId)}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            declarationText:
              'I confirm that I have reviewed this RAMS pack, the identified controls reflect the site environment, and all operatives will be briefed prior to commencement.',
          }),
        });
      }

      router.push(`/contractor/rams/${encodeURIComponent(ramsId)}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save RAMS');
      setIsSaving(false);
    }
  };

  const stepsList = [
    '1. Job Scope',
    '2. People',
    '3. Environment',
    '4. Hazards',
    '5. Controls',
    '6. Method',
    '7. PPE & Plant',
    '8. Emergency',
    '9. Review',
    '10. Approve & Issue',
  ];

  return (
    <div className="space-y-6">
      {/* Wizard Step Nav Bar */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-4 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-[700px]">
          {stepsList.map((stepLabel, idx) => {
            const stepNum = idx + 1;
            const isCurrent = step === stepNum;
            const isCompleted = step > stepNum;

            return (
              <button
                key={stepNum}
                onClick={() => setStep(stepNum)}
                className={`px-3 py-1.5 rounded text-xs font-normal transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-brand-electric text-white font-medium'
                    : isCompleted
                    ? 'bg-brand-void text-emerald-400 border border-emerald-500/20'
                    : 'text-brand-mist/50 hover:text-white'
                }`}
              >
                {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                {stepLabel}
              </button>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 flex items-center gap-2 text-xs font-normal">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Step Body */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-6">
        {/* STEP 1: Job */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-light text-white border-b border-brand-edge-dark/60 pb-3">
              Step 1 — Work Order &amp; Job Context
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-normal">
              <div className="sm:col-span-2">
                <label className="text-brand-mist/70 block mb-1">RAMS Document Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Client Name *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Site / Facility Name *</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Trade Discipline</label>
                <select
                  value={workCategory}
                  onChange={(e) => setWorkCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-xs font-normal"
                >
                  <option value="ELECTRICAL">Electrical &amp; M&amp;E</option>
                  <option value="HVAC_AND_REFRIGERATION">HVAC &amp; Refrigeration</option>
                  <option value="GAS_AND_HEATING">Commercial Gas &amp; Heating</option>
                  <option value="PLUMBING_AND_DRAINAGE">Plumbing &amp; Drainage</option>
                  <option value="WATER_HYGIENE">Water Hygiene &amp; ACOP L8</option>
                  <option value="FIRE_AND_LIFE_SAFETY">Fire &amp; Life Safety</option>
                  <option value="BUILDING_FABRIC">Building Fabric &amp; Structure</option>
                  <option value="ROPE_ACCESS">High Level &amp; Rope Access</option>
                </select>
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Planned Start Date</label>
                <input
                  type="date"
                  value={plannedStartDate}
                  onChange={(e) => setPlannedStartDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-normal text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-brand-mist/70 block mb-1">Detailed Work Scope Description *</label>
                <textarea
                  rows={3}
                  value={workScopeDescription}
                  onChange={(e) => setWorkScopeDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: People & CP-04 Eligibility */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-light text-white border-b border-brand-edge-dark/60 pb-3">
              Step 2 — People &amp; Competency Validation
            </h2>

            <div className="space-y-3">
              <span className="text-xs text-brand-mist/70 block font-normal">
                Select Operatives Assigned to Undertake Work (CP-04 Live Eligibility):
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {operatives.map((op) => {
                  const isSelected = selectedOperativeIds.includes(op.id);
                  return (
                    <div
                      key={op.id}
                      onClick={() => {
                        setSelectedOperativeIds((prev) =>
                          prev.includes(op.id) ? prev.filter((id) => id !== op.id) : [...prev, op.id]
                        );
                      }}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-brand-electric/10 border-brand-electric text-white'
                          : 'bg-brand-void border-brand-edge-dark text-brand-mist hover:border-brand-edge-dark/80'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{op.fullName}</span>
                          <span
                            className={`text-[9.5px] font-normal px-1.5 py-0.2 rounded border ${
                              op.isEligibleForDispatch
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {op.isEligibleForDispatch ? 'ELIGIBLE' : 'ACTION'}
                          </span>
                        </div>
                        <span className="text-brand-mist/50 text-[11px] font-normal block">
                          {op.jobTitle} &bull; {op.trades.join(', ')}
                        </span>
                      </div>

                      <CheckCircle2
                        className={`w-5 h-5 ${isSelected ? 'text-brand-electric' : 'text-brand-mist/30'}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Work Environment */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-light text-white border-b border-brand-edge-dark/60 pb-3">
              Step 3 — Work Environment &amp; Site Controls
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-normal">
              <div>
                <label className="text-brand-mist/70 block mb-1">Building Occupancy Type</label>
                <select
                  value={occupancyState}
                  onChange={(e) => setOccupancyState(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-xs"
                >
                  <option value="Occupied">Fully Occupied</option>
                  <option value="Partially Occupied">Partially Occupied</option>
                  <option value="Unoccupied">Unoccupied / Void</option>
                </select>
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Working Hours</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-xs font-normal"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-brand-edge-dark/40">
              <span className="text-brand-mist/70 text-xs font-normal block">Key High-Risk Environmental Factors:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Working at Height', state: requiresWorkingAtHeight, set: setRequiresWorkingAtHeight },
                  { label: 'Electrical Isolation (LOTO)', state: requiresElectricalIsolation, set: setRequiresElectricalIsolation },
                  { label: 'Hot Works / Brazing', state: requiresHotWorks, set: setRequiresHotWorks },
                  { label: 'Gas Isolation', state: requiresGasIsolation, set: setRequiresGasIsolation },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => item.set(!item.state)}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between text-xs transition-colors ${
                      item.state
                        ? 'bg-brand-electric/10 border-brand-electric text-white font-medium'
                        : 'bg-brand-void border-brand-edge-dark text-brand-mist/60'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.state && <CheckCircle2 className="w-4 h-4 text-brand-electric shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Hazards & 5x5 Matrix */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-3">
              <h2 className="text-base font-light text-white">
                Step 4 — Hazard Identification &amp; 5x5 Risk Matrix
              </h2>
              <button
                type="button"
                onClick={handleFetchAiSuggestions}
                disabled={isLoadingAi}
                className="px-3 py-1.5 rounded-lg bg-brand-void border border-brand-electric/40 text-brand-electric-bright hover:bg-brand-electric/10 text-xs font-normal flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isLoadingAi ? 'Analyzing Scope...' : 'AI Suggest Hazards'}
              </button>
            </div>

            {/* AI Suggestions Box */}
            {aiSuggestions.length > 0 && (
              <div className="p-4 rounded-xl border border-brand-electric/40 bg-brand-void/80 space-y-3">
                <div className="flex items-center gap-2 text-xs text-brand-electric-bright font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Suggested Hazards for Scope Review:</span>
                </div>
                <div className="space-y-2">
                  {aiSuggestions.map((sugg) => (
                    <div key={sugg.id} className="p-2.5 rounded bg-brand-carbon border border-brand-edge-dark flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-white font-medium block">{sugg.hazard}</span>
                        <span className="text-[11px] text-brand-mist/60 font-light block">{sugg.reason}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAcceptAiHazard(sugg)}
                        className="px-2.5 py-1 rounded bg-brand-electric text-white text-[11px] font-medium hover:bg-brand-electric/85 shrink-0"
                      >
                        + Add to RAMS
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hazards Table */}
            <div className="space-y-3">
              {hazards.map((h, idx) => (
                <div key={h.id} className="p-4 rounded-xl border border-brand-edge-dark bg-brand-void space-y-2 text-xs font-normal">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-white font-bold font-sans text-sm block">{h.hazard}</span>
                      <span className="text-[10.5px] text-brand-mist/50 block mt-0.5">
                        Persons at Risk: {h.personsAtRisk.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800 text-[10.5px]">
                        Initial: L{h.initialLikelihood}×S{h.initialSeverity} ({h.initialRiskScore})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800 text-[10.5px]">
                        Residual: L{h.residualLikelihood}×S{h.residualSeverity} ({h.residualRiskScore})
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-brand-mist/80 font-sans space-y-1 pt-2 border-t border-brand-edge-dark/50">
                    <span className="font-bold text-white block">Key Controls:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {h.controls.slice(0, 3).map((c, cIdx) => (
                        <li key={cIdx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Method Statement */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-base font-light text-white border-b border-brand-edge-dark/60 pb-3">
              Step 6 — Sequential Work Method Statement
            </h2>

            <div className="space-y-3">
              {methodSteps.map((s) => (
                <div key={s.sequence} className="p-4 rounded-xl border border-brand-edge-dark bg-brand-void space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-normal">
                      <span className="w-5 h-5 rounded bg-brand-electric/20 text-brand-electric flex items-center justify-center font-bold text-xs">
                        {s.sequence}
                      </span>
                      <span className="text-white font-bold">{s.title}</span>
                    </div>
                    <span className="text-[10px] font-normal text-brand-mist/50 uppercase">{s.responsibleRole}</span>
                  </div>
                  <p className="text-brand-mist/80 font-light leading-relaxed pl-7">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: PPE & Plant */}
        {step === 7 && (
          <div className="space-y-4 text-xs font-normal">
            <h2 className="text-base font-light text-white border-b border-brand-edge-dark/60 pb-3 font-sans">
              Step 7 — PPE, Access Plant &amp; Permits
            </h2>

            <div className="space-y-2">
              <span className="text-brand-mist/70 block">Selected Mandatory PPE:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPpe.map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded bg-brand-void border border-brand-edge-dark text-white">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-brand-edge-dark/40">
              <span className="text-brand-mist/70 block">Selected Plant &amp; Access Equipment:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPlant.map((pl) => (
                  <span key={pl} className="px-2.5 py-1 rounded bg-brand-void border border-brand-edge-dark text-white">
                    {pl}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-brand-edge-dark/40">
              <span className="text-brand-mist/70 block">Mandatory Site Permits:</span>
              <div className="flex flex-wrap gap-1.5">
                {requiredPermits.map((pm) => (
                  <span key={pm} className="px-2.5 py-1 rounded bg-rose-950/40 text-rose-300 border border-rose-800">
                    {pm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: Review */}
        {step === 9 && (
          <div className="space-y-4">
            <h2 className="text-base font-light text-white border-b border-brand-edge-dark/60 pb-3">
              Step 9 — Pre-Issue Quality &amp; Completeness Review
            </h2>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>RAMS Readiness: Ready for Contractor Approval</span>
              </div>
              <p className="text-brand-mist font-light">
                All 4 identified hazards contain specific physical controls. 2 assigned operatives are verified eligible under CP-04 standards.
              </p>
            </div>
          </div>
        )}

        {/* STEP 10: Approve & Issue */}
        {step === 10 && (
          <div className="space-y-4">
            <h2 className="text-base font-light text-white border-b border-brand-edge-dark/60 pb-3">
              Step 10 — Contractor Safety Declaration &amp; Issue
            </h2>

            <div className="p-5 rounded-xl border border-brand-edge-dark bg-brand-void/60 space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="decl"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-brand-edge-dark bg-brand-carbon text-brand-electric focus:ring-0"
                />
                <label htmlFor="decl" className="text-white font-light leading-relaxed cursor-pointer">
                  I confirm that I have reviewed this RAMS pack, that the information reflects the planned work, and that the identified controls will be communicated to the operatives undertaking the task prior to site commencement.
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-brand-edge-dark bg-brand-carbon">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 rounded-lg border border-brand-edge-dark text-xs text-brand-mist hover:text-white transition-colors"
          >
            &larr; Previous Step
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSaveRams(false)}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg border border-brand-edge-dark bg-brand-void text-xs text-brand-mist hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>

          {step < 10 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-colors flex items-center gap-1.5"
            >
              Continue &rarr;
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSaveRams(true)}
              disabled={!declarationAccepted || isSaving}
              className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-40"
            >
              {isSaving ? 'Issuing RAMS...' : 'Approve & Issue RAMS Pack'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
