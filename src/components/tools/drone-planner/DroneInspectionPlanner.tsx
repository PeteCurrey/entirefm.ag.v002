'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlannerState, 
  PlannerSiteInput, 
  PlannerInspectionInput, 
  PlannerContactInput,
  generateDroneRecommendation,
  calculateLeadPriority,
  generateDroneReference,
  DroneRecommendationResult
} from '@/config/dronePlanner';
import { PlannerProgress } from './PlannerProgress';
import { StepIntro } from './StepIntro';
import { StepSiteType } from './StepSiteType';
import { StepLocationScale } from './StepLocationScale';
import { StepAssets } from './StepAssets';
import { StepProblem } from './StepProblem';
import { StepUrgency } from './StepUrgency';
import { StepHeightAccess } from './StepHeightAccess';
import { StepEnvironment } from './StepEnvironment';
import { StepOutputs } from './StepOutputs';
import { StepRemediation } from './StepRemediation';
import { StepFrequency } from './StepFrequency';
import { PlannerRecommendationView } from './PlannerRecommendationView';
import { PlannerPrintableBrief } from './PlannerPrintableBrief';
import { PlannerSubmissionSuccess } from './PlannerSubmissionSuccess';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'entirefm_drone_planner_state_v1';

const STEP_NAMES = [
  'Introduction',
  'Property Classification',
  'Location & Scale',
  'Asset Scope',
  'Investigation Reason',
  'Urgency Level',
  'Height & Access',
  'Site Environment',
  'Required Deliverables',
  'Remedial Works',
  'Inspection Frequency',
  'Recommended Plan',
];

const INITIAL_STATE: PlannerState = {
  step: 0,
  site: {
    siteType: 'Office / Commercial Building',
    siteScale: 'Single Building',
  },
  inspection: {
    assetsToInspect: ['Roof'],
    inspectionReasons: ['Roof condition'],
    urgency: 'Planned / No Immediate Urgency',
    heightBand: '3–5 Storeys',
    accessDifficult: 'No',
    accessConstraints: ['unknown'],
    requestedOutputs: ['Not Sure — Recommend for Me'],
    remediationInterest: 'Possibly — advise me after the survey',
    frequency: 'One-Off Inspection',
  },
  contact: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    preferredContactMethod: 'Email',
  },
};

export function DroneInspectionPlanner() {
  const [state, setState] = useState<PlannerState>(INITIAL_STATE);
  const [hasSavedState, setHasSavedState] = useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Initialize reference number and check localStorage
  useEffect(() => {
    setReferenceNumber(generateDroneReference());
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.step === 'number' && parsed.step > 0 && parsed.step <= 11) {
          setHasSavedState(true);
        }
      }
    } catch {}
  }, []);

  // Save non-PII state locally when moving steps
  const saveStateLocally = (nextState: PlannerState) => {
    try {
      // Save only site & inspection parameters, not personal contact data
      const safeToStore = {
        step: nextState.step,
        site: nextState.site,
        inspection: nextState.inspection,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeToStore));
    } catch {}
  };

  const handleResume = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          step: parsed.step || 1,
          site: { ...prev.site, ...parsed.site },
          inspection: { ...prev.inspection, ...parsed.inspection },
        }));
        setHasSavedState(false);
      }
    } catch {}
  };

  const handleClearSaved = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHasSavedState(false);
    } catch {}
  };

  const goToStep = (stepNumber: number) => {
    setState((prev) => {
      const next = { ...prev, step: stepNumber };
      saveStateLocally(next);
      return next;
    });
    // Scroll smoothly to planner container top
    const elem = document.getElementById('drone-planner-container');
    if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNext = () => {
    if (state.step < 11) {
      goToStep(state.step + 1);
    }
  };

  const handleBack = () => {
    if (state.step > 0) {
      goToStep(state.step - 1);
    }
  };

  const handleStartAgain = () => {
    if (window.confirm('Are you sure you want to reset this inspection brief?')) {
      handleClearSaved();
      setReferenceNumber(generateDroneReference());
      setState(INITIAL_STATE);
      setIsSubmitted(false);
      setSubmitError(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate deterministic recommendation based on state
  const recommendation: DroneRecommendationResult = generateDroneRecommendation(
    state.site,
    state.inspection
  );

  // Form submission handler
  const handleSubmitBrief = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const leadPriority = calculateLeadPriority(state.site, state.inspection, state.contact);

    const structuredBrief = {
      referenceNumber,
      site: state.site,
      inspection: state.inspection,
      recommendation: {
        primaryService: recommendation.primaryService.title,
        inspectionPack: recommendation.inspectionPack?.title || 'Custom Scope',
        additionalServices: recommendation.additionalServices.map((s) => s.title),
        suggestedOutputs: recommendation.suggestedOutputs,
        remedialServices: recommendation.remedialServices.map((s) => s.name),
        scopeCategory: recommendation.scopeCategory,
      },
      leadPriority,
    };

    // Format human-readable message block
    const formattedMessage = [
      `=== DRONE INSPECTION PLANNER BRIEF [${referenceNumber}] ===`,
      `Site: ${state.site.siteName ? state.site.siteName + ', ' : ''}${state.site.city || 'UK'} (${state.site.siteType})`,
      `Scale & Height: ${state.site.siteScale} | ${state.inspection.heightBand}`,
      `Assets to Inspect: ${state.inspection.assetsToInspect.join(', ')}`,
      `Investigation Issue: ${state.inspection.inspectionReasons.join(', ')}`,
      `Urgency: ${state.inspection.urgency}`,
      `Access Constraints: ${state.inspection.accessConstraints.join(', ')}`,
      `Remedial Interest: ${state.inspection.remediationInterest}`,
      `Frequency: ${state.inspection.frequency}`,
      ``,
      `--- RECOMMENDED PLAN ---`,
      `Primary Service: ${recommendation.primaryService.title}`,
      `Inspection Pack: ${recommendation.inspectionPack?.title || 'None'}`,
      `Lead Priority: ${leadPriority}`,
      state.inspection.notes ? `\nClient Notes: ${state.inspection.notes}` : '',
    ].join('\n');

    const payload = {
      name: `${state.contact.firstName} ${state.contact.lastName}`,
      email: state.contact.email,
      phone: state.contact.phone,
      company: state.contact.company,
      service: `Drone Services: ${recommendation.primaryService.title}`,
      location: state.site.city || 'United Kingdom',
      message: formattedMessage,
      form_id: 'drone-inspection-planner',
      conversion_page: '/tools/drone-inspection-planner',
      page_type: 'tool',
      sector_interest: state.site.siteType,
      drone_brief: structuredBrief,
    };

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to submit inspection brief.');
      }

      // Clear local storage on successful submission
      handleClearSaved();
      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while submitting.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="drone-planner-container" className="w-full max-w-5xl mx-auto space-y-8">
      {/* Printable Brief Component (hidden on screen, visible during window.print()) */}
      <PlannerPrintableBrief
        site={state.site}
        inspection={state.inspection}
        contact={state.contact}
        recommendation={recommendation}
        referenceNumber={referenceNumber}
      />

      {/* Interactive Screen View */}
      <div className="print:hidden space-y-8">
        {/* Progress Bar (Visible on Steps 1 to 10) */}
        {state.step > 0 && state.step < 11 && !isSubmitted && (
          <PlannerProgress
            currentStep={state.step}
            totalSteps={10}
            stepName={STEP_NAMES[state.step]}
          />
        )}

        {/* Step Views */}
        <div className="min-h-[420px] flex flex-col justify-between">
          {state.step === 0 && !isSubmitted && (
            <StepIntro
              onStart={() => goToStep(1)}
              hasSavedState={hasSavedState}
              onResume={handleResume}
              onClearState={handleClearSaved}
            />
          )}

          {state.step === 1 && (
            <StepSiteType
              value={state.site.siteType}
              otherValue={state.site.siteTypeOther}
              onChange={(siteType, siteTypeOther) =>
                setState((prev) => ({
                  ...prev,
                  site: { ...prev.site, siteType, siteTypeOther },
                }))
              }
            />
          )}

          {state.step === 2 && (
            <StepLocationScale
              site={state.site}
              onChange={(updated) =>
                setState((prev) => ({
                  ...prev,
                  site: { ...prev.site, ...updated },
                }))
              }
            />
          )}

          {state.step === 3 && (
            <StepAssets
              inspection={state.inspection}
              onChange={(updated) =>
                setState((prev) => ({
                  ...prev,
                  inspection: { ...prev.inspection, ...updated },
                }))
              }
            />
          )}

          {state.step === 4 && (
            <StepProblem
              inspection={state.inspection}
              onChange={(updated) =>
                setState((prev) => ({
                  ...prev,
                  inspection: { ...prev.inspection, ...updated },
                }))
              }
            />
          )}

          {state.step === 5 && (
            <StepUrgency
              urgency={state.inspection.urgency}
              onChange={(urgency) =>
                setState((prev) => ({
                  ...prev,
                  inspection: { ...prev.inspection, urgency },
                }))
              }
            />
          )}

          {state.step === 6 && (
            <StepHeightAccess
              inspection={state.inspection}
              onChange={(updated) =>
                setState((prev) => ({
                  ...prev,
                  inspection: { ...prev.inspection, ...updated },
                }))
              }
            />
          )}

          {state.step === 7 && (
            <StepEnvironment
              environment={state.site.environment || 'Urban'}
              onChange={(environment) =>
                setState((prev) => ({
                  ...prev,
                  site: { ...prev.site, environment },
                }))
              }
            />
          )}

          {state.step === 8 && (
            <StepOutputs
              outputs={state.inspection.requestedOutputs}
              onChange={(requestedOutputs) =>
                setState((prev) => ({
                  ...prev,
                  inspection: { ...prev.inspection, requestedOutputs },
                }))
              }
            />
          )}

          {state.step === 9 && (
            <StepRemediation
              remediation={state.inspection.remediationInterest}
              onChange={(remediationInterest) =>
                setState((prev) => ({
                  ...prev,
                  inspection: { ...prev.inspection, remediationInterest },
                }))
              }
            />
          )}

          {state.step === 10 && (
            <StepFrequency
              frequency={state.inspection.frequency}
              onChange={(frequency) =>
                setState((prev) => ({
                  ...prev,
                  inspection: { ...prev.inspection, frequency },
                }))
              }
            />
          )}

          {state.step === 11 && !isSubmitted && (
            <PlannerRecommendationView
              site={state.site}
              inspection={state.inspection}
              contact={state.contact}
              recommendation={recommendation}
              referenceNumber={referenceNumber}
              onContactChange={(updated) =>
                setState((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, ...updated },
                }))
              }
              onSubmit={handleSubmitBrief}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onPrint={handlePrint}
              onStartAgain={handleStartAgain}
            />
          )}

          {isSubmitted && (
            <PlannerSubmissionSuccess
              referenceNumber={referenceNumber}
              clientName={`${state.contact.firstName} ${state.contact.lastName}`}
              email={state.contact.email}
              onPrint={handlePrint}
              onStartNew={handleStartAgain}
            />
          )}
        </div>

        {/* Step Navigation Controls (Steps 1 to 10) */}
        {state.step >= 1 && state.step <= 10 && (
          <div className="pt-6 border-t border-brand-edge-dark flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-white/20 bg-white/5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleStartAgain}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white mr-2"
                title="Reset brief"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-7 py-2.5 text-xs font-bold text-white shadow-md hover:scale-[1.02] transition-all"
              >
                <span>{state.step === 10 ? 'Generate Recommended Plan' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
