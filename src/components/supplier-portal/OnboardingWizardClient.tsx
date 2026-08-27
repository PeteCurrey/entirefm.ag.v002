'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Wrench,
  MapPin,
  Clock,
  Briefcase,
  ShieldCheck,
  Award,
  HeartPulse,
  Scale,
  Lock,
  FileText,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  AlertCircle,
  Upload,
  Trash2,
  ExternalLink,
  Search,
  Check,
  Eye,
  X,
  FileCheck,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  CANONICAL_ACCREDITATIONS,
  CANONICAL_PUBLIC_PRICING,
  SUPPLIER_SERVICE_TAXONOMY,
  SUPPLIER_CODE_OF_CONDUCT_V2026_1,
  TaxonomyCategory,
} from '@/config/supplier-data';
import { SupplierDocItem } from '@/server/suppliers/supplier-auth-store';

const STEPS = [
  { num: 1, key: 'company', title: 'Company Profile', icon: Building2 },
  { num: 2, key: 'contacts', title: 'Contacts & Roles', icon: Users },
  { num: 3, key: 'services', title: 'Services & Trades', icon: Wrench },
  { num: 4, key: 'coverage', title: 'Coverage & Bases', icon: MapPin },
  { num: 5, key: 'operations', title: 'Operational Capability', icon: Clock },
  { num: 6, key: 'workforce', title: 'Workforce & Subs', icon: Briefcase },
  { num: 7, key: 'insurance', title: 'Insurance Schedules', icon: ShieldCheck },
  { num: 8, key: 'accreditations', title: 'Accreditations', icon: Award },
  { num: 9, key: 'health_safety', title: 'Health & Safety', icon: HeartPulse },
  { num: 10, key: 'governance', title: 'Governance & Ethics', icon: Scale },
  { num: 11, key: 'security', title: 'Information Security', icon: Lock },
  { num: 12, key: 'documents', title: 'Document Vault', icon: FileText },
  { num: 13, key: 'commercial', title: 'Commercial Info', icon: CreditCard },
  { num: 14, key: 'declarations', title: 'Declarations', icon: CheckCircle2 },
  { num: 15, key: 'review', title: 'Review & Submit', icon: Save },
];

export function OnboardingWizardClient({
  initialOrgId = '',
  initialAppRef = '',
  initialLegalName = '',
  initialTradingName = '',
  initialCompanyNumber = '',
  initialDraft = null,
}: {
  initialOrgId?: string;
  initialAppRef?: string;
  initialLegalName?: string;
  initialTradingName?: string;
  initialCompanyNumber?: string;
  initialDraft?: any;
}) {
  const [currentStep, setCurrentStep] = useState(initialDraft?.currentStep || 1);
  const [lastSaved, setLastSaved] = useState<string>('Not yet saved');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [appRef, setAppRef] = useState(initialDraft?.applicationReference || initialAppRef);

  // Modal states
  const [showCodeOfConductModal, setShowCodeOfConductModal] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [activeTaxonomyTab, setActiveTaxonomyTab] = useState<string>('hard-fm');
  const [selectedTradeDetailModal, setSelectedTradeDetailModal] = useState<string | null>(null);

  // Document Vault state
  const [documents, setDocuments] = useState<SupplierDocItem[]>(
    initialDraft?.documentVault || []
  );
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [customDocName, setCustomDocName] = useState('');
  const [customDocCategory, setCustomDocCategory] = useState<'MANDATORY' | 'ACCREDITATION' | 'POLICY' | 'SUPPORTING'>('SUPPORTING');

  // Complete Form State initialized from server draft or defaults
  const [formData, setFormData] = useState({
    // 01: Company Profile
    legalCompanyName: initialDraft?.legalCompanyName || initialLegalName || '',
    tradingName: initialDraft?.tradingName || initialTradingName || '',
    companyNumber: initialDraft?.companyNumber || initialCompanyNumber || '',
    vatNumber: initialDraft?.vatNumber || '',
    websiteUrl: initialDraft?.websiteUrl || '',
    yearEstablished: initialDraft?.yearEstablished || '',
    employeeCount: initialDraft?.employeeCount || '10-50',
    tradingAddress: initialDraft?.tradingAddress || '',
    mainPhone: initialDraft?.mainPhone || '',
    generalEmail: initialDraft?.generalEmail || '',
    businessType: initialDraft?.businessType || 'Regional Contractor',
    companySummary: initialDraft?.companySummary || '',

    // 02: Contacts & Roles
    primaryContactName: initialDraft?.primaryContactName || '',
    primaryContactEmail: initialDraft?.primaryContactEmail || '',
    primaryContactPhone: initialDraft?.primaryContactPhone || '',
    opsContactName: initialDraft?.opsContactName || '',
    opsContactEmail: initialDraft?.opsContactEmail || '',
    opsContactPhone: initialDraft?.opsContactPhone || '',
    financeContactName: initialDraft?.financeContactName || '',
    financeContactEmail: initialDraft?.financeContactEmail || '',
    financeContactPhone: initialDraft?.financeContactPhone || '',
    hsContactName: initialDraft?.hsContactName || '',
    hsContactEmail: initialDraft?.hsContactEmail || '',
    hsContactPhone: initialDraft?.hsContactPhone || '',

    // 03: Services & Trades
    selectedServices: (initialDraft?.selectedServices || []) as string[],
    serviceDetails: (initialDraft?.serviceDetails || {}) as Record<
      string,
      {
        deliveryModel: 'SELF' | 'SUB' | 'BOTH';
        directOperatives?: number;
        has247?: boolean;
        offersPpm?: boolean;
        offersReactive?: boolean;
        offersProjects?: boolean;
        offersTesting?: boolean;
      }
    >,
    customServices: initialDraft?.customServices || '',

    // 04: Coverage & Bases
    coverageType: (initialDraft?.coverageType || 'REGIONAL') as 'NATIONAL' | 'REGIONAL' | 'RADIUS',
    selectedRegions: (initialDraft?.selectedRegions || []) as string[],
    operatingBases: (initialDraft?.operatingBases || [
      { name: 'Headquarters', postcode: '', city: '', isHeadquarters: true },
    ]) as Array<{ name: string; postcode: string; city: string; isHeadquarters?: boolean }>,
    operationalRadiusMiles: initialDraft?.operationalRadiusMiles || 50,
    nationalMobilisation: Boolean(initialDraft?.nationalMobilisation),

    // 05: Operational Capability
    serviceDeliveryTypes: (initialDraft?.serviceDeliveryTypes || [
      'PPM',
      'REACTIVE',
      'EMERGENCY_CALLOUT',
    ]) as string[],
    standardOperatingHours: initialDraft?.standardOperatingHours || '08:00 - 17:00 (Mon-Fri)',
    has247: Boolean(initialDraft?.has247),
    emergencySlaHours: initialDraft?.emergencySlaHours || '4',
    emergency247Staffing: (initialDraft?.emergency247Staffing || 'ON_CALL') as 'DIRECT' | 'ON_CALL' | 'NONE',
    emergencyContactMechanism: initialDraft?.emergencyContactMechanism || '',
    responseTimeP1: initialDraft?.responseTimeP1 || '2-4 Hours',
    responseTimeP2: initialDraft?.responseTimeP2 || 'Same Day (8h)',
    responseTimeP3: initialDraft?.responseTimeP3 || '24-48 Hours',
    vehicleCount: initialDraft?.vehicleCount || 5,
    brandedFleet: initialDraft?.brandedFleet !== undefined ? Boolean(initialDraft?.brandedFleet) : true,
    gpsTracking: initialDraft?.gpsTracking !== undefined ? Boolean(initialDraft?.gpsTracking) : true,
    vehicleStock: initialDraft?.vehicleStock !== undefined ? Boolean(initialDraft?.vehicleStock) : true,
    specialistEquipmentAvailable: Boolean(initialDraft?.specialistEquipmentAvailable),
    specialistEquipmentDetails: initialDraft?.specialistEquipmentDetails || '',
    workManagementMethods: (initialDraft?.workManagementMethods || ['PORTAL', 'EMAIL', 'MOBILE_APP']) as string[],
    engineerDeviceCapabilities: (initialDraft?.engineerDeviceCapabilities || [
      'SMARTPHONES',
      'REAL_TIME_JOB_ACCESS',
      'PHOTO_UPLOAD',
      'DIGITAL_SIGNATURES',
      'DIGITAL_JOB_SHEETS',
    ]) as string[],

    // 06: Workforce & Subcontractors
    directEngineers: initialDraft?.directEngineers || '10',
    fieldOperativesCount: initialDraft?.fieldOperativesCount || 8,
    qualifiedEngineersCount: initialDraft?.qualifiedEngineersCount || 6,
    supervisorsCount: initialDraft?.supervisorsCount || 2,
    officeStaffCount: initialDraft?.officeStaffCount || 3,
    apprenticesCount: initialDraft?.apprenticesCount || 1,
    employmentModel: (initialDraft?.employmentModel || 'DIRECT_PRIMARY') as
      | 'DIRECT_ONLY'
      | 'DIRECT_PRIMARY'
      | 'MIXED'
      | 'SUBCONTRACT_PRIMARY',
    qualificationsHeld: (initialDraft?.qualificationsHeld || ['CSCS', 'ECS', 'FIRST_AID', 'WORKING_AT_HEIGHT']) as string[],
    customQualifications: initialDraft?.customQualifications || '',
    hasSubcontractors: Boolean(initialDraft?.hasSubcontractors),
    subcontractorPct: initialDraft?.subcontractorPct || 15,
    subcontractorTrades: (initialDraft?.subcontractorTrades || []) as string[],
    subcontractorApprovalProcess: initialDraft?.subcontractorApprovalProcess || '',
    subChecksCompetency: initialDraft?.subChecksCompetency !== false,
    subChecksInsurance: initialDraft?.subChecksInsurance !== false,
    subChecksHs: initialDraft?.subChecksHs !== false,
    subChecksAccreditation: initialDraft?.subChecksAccreditation !== false,
    subMonitorsPerformance: initialDraft?.subMonitorsPerformance !== false,
    subEntirefmCompliance: initialDraft?.subEntirefmCompliance !== false,
    subStandardsAccepted: Boolean(initialDraft?.subStandardsAccepted),

    // 07: Insurance Schedules
    plInsurer: initialDraft?.plInsurer || '',
    plPolicyNumber: initialDraft?.plPolicyNumber || '',
    plCoverLimit: initialDraft?.plCoverLimit || '£10,000,000',
    plExpiryDate: initialDraft?.plExpiryDate || '',
    elInsurer: initialDraft?.elInsurer || '',
    elPolicyNumber: initialDraft?.elPolicyNumber || '',
    elCoverLimit: initialDraft?.elCoverLimit || '£10,000,000',
    elExpiryDate: initialDraft?.elExpiryDate || '',
    piApplicable: Boolean(initialDraft?.piApplicable),
    piInsurer: initialDraft?.piInsurer || '',
    piPolicyNumber: initialDraft?.piPolicyNumber || '',
    piCoverLimit: initialDraft?.piCoverLimit || '£2,000,000',
    piExpiryDate: initialDraft?.piExpiryDate || '',

    // 08: Accreditations
    selectedAccreditations: (initialDraft?.selectedAccreditations || []) as string[],
    accreditationNumbers: (initialDraft?.accreditationNumbers || {}) as Record<string, string>,
    accreditationExpiries: (initialDraft?.accreditationExpiries || {}) as Record<string, string>,
    gasSafeNumber: initialDraft?.gasSafeNumber || '',
    gasSafeExpiry: initialDraft?.gasSafeExpiry || '',
    fGasNumber: initialDraft?.fGasNumber || '',
    fGasExpiry: initialDraft?.fGasExpiry || '',

    // 09: Health & Safety
    hasHsPolicy: initialDraft?.hasHsPolicy !== false,
    hsPolicyReviewDate: initialDraft?.hsPolicyReviewDate || '',
    competentPersonName: initialDraft?.competentPersonName || '',
    competentPersonRole: initialDraft?.competentPersonRole || 'H&S Manager',
    competentPersonType: (initialDraft?.competentPersonType || 'INTERNAL') as 'INTERNAL' | 'EXTERNAL',
    hasRams: initialDraft?.hasRams !== false,
    ramsApproverRole: initialDraft?.ramsApproverRole || 'Technical Operations Director',
    ramsProvidedPreAttendance: initialDraft?.ramsProvidedPreAttendance !== false,
    ramsOperativesBriefed: initialDraft?.ramsOperativesBriefed !== false,
    highRiskControls: (initialDraft?.highRiskControls || [
      'WORKING_AT_HEIGHT',
      'ELECTRICAL_LOTO',
      'COSHH',
      'MANUAL_HANDLING',
      'LONE_WORKING',
    ]) as string[],
    hasIncidentHistory: Boolean(initialDraft?.hasIncidentHistory),
    incidentRiddorCount: initialDraft?.incidentRiddorCount || 0,
    incidentLtiCount: initialDraft?.incidentLtiCount || 0,
    incidentImprovementNoticesCount: initialDraft?.incidentImprovementNoticesCount || 0,
    incidentProhibitionNoticesCount: initialDraft?.incidentProhibitionNoticesCount || 0,
    incidentProsecutionsCount: initialDraft?.incidentProsecutionsCount || 0,
    incidentDetails: initialDraft?.incidentDetails || '',
    trainingMatrixMaintained: initialDraft?.trainingMatrixMaintained !== false,
    certificationsMonitored: initialDraft?.certificationsMonitored !== false,
    toolboxTalksRegular: initialDraft?.toolboxTalksRegular !== false,
    siteInductionsSupported: initialDraft?.siteInductionsSupported !== false,

    // 10: Governance & Ethics
    modernSlavery: initialDraft?.modernSlavery !== false,
    modernSlaveryPolicy: initialDraft?.modernSlaveryPolicy !== false,
    modernSlaveryStatement: Boolean(initialDraft?.modernSlaveryStatement),
    modernSlaverySupplyControls: initialDraft?.modernSlaverySupplyControls !== false,
    antiBribery: initialDraft?.antiBribery !== false,
    antiBriberyPolicy: initialDraft?.antiBriberyPolicy !== false,
    giftsHospitalityControls: initialDraft?.giftsHospitalityControls !== false,
    conflictsInterestControls: initialDraft?.conflictsInterestControls !== false,
    equalityDiversityPolicy: initialDraft?.equalityDiversityPolicy !== false,
    rightToWorkChecks: initialDraft?.rightToWorkChecks !== false,
    fairEmploymentPractices: initialDraft?.fairEmploymentPractices !== false,
    whistleblowingProcedure: initialDraft?.whistleblowingProcedure !== false,
    disclosureCriminalConvictions: Boolean(initialDraft?.disclosureCriminalConvictions),
    disclosureFraudConvictions: Boolean(initialDraft?.disclosureFraudConvictions),
    disclosureBriberyConvictions: Boolean(initialDraft?.disclosureBriberyConvictions),
    disclosureRegulatoryEnforcement: Boolean(initialDraft?.disclosureRegulatoryEnforcement),
    disclosureInsolvencyDisqualification: Boolean(initialDraft?.disclosureInsolvencyDisqualification),
    disclosureDetails: initialDraft?.disclosureDetails || '',
    sanctionsConfirmed: initialDraft?.sanctionsConfirmed !== false,

    // 11: Information Security
    infosecPolicy: initialDraft?.infosecPolicy !== false,
    dataProtectionPolicy: initialDraft?.dataProtectionPolicy !== false,
    gdprProcedures: initialDraft?.gdprProcedures !== false,
    dpoContactName: initialDraft?.dpoContactName || '',
    dpoContactEmail: initialDraft?.dpoContactEmail || '',
    cyberCertifications: (initialDraft?.cyberCertifications || ['CYBER_ESSENTIALS']) as string[],
    cyberCertNumber: initialDraft?.cyberCertNumber || '',
    cyberControls: (initialDraft?.cyberControls || [
      'MFA',
      'ENDPOINT_PROTECTION',
      'DEVICE_ENCRYPTION',
      'OFFSITE_BACKUPS',
      'STAFF_TRAINING',
      'ROLE_BASED_ACCESS',
      'LEAVER_REVOCATION',
      'INCIDENT_PLAN',
      'AUTO_PATCHING',
    ]) as string[],
    processesPersonalData: Boolean(initialDraft?.processesPersonalData),
    personalDataSafeguards: initialDraft?.personalDataSafeguards || '',
    cyberBreachPast3yr: Boolean(initialDraft?.cyberBreachPast3yr),
    cyberBreachDetails: initialDraft?.cyberBreachDetails || '',

    // 13: Commercial Information
    turnoverBand: initialDraft?.turnoverBand || '£1m–£2m',
    largestContractBand: initialDraft?.largestContractBand || '£100k–£250k',
    maxMobilisationSize: initialDraft?.maxMobilisationSize || '10-50 Sites Regional',
    multiSiteCapability: initialDraft?.multiSiteCapability !== false,
    accountsPayableEmail: initialDraft?.accountsPayableEmail || '',
    requiresPo: initialDraft?.requiresPo !== false,

    // 14: Declarations
    codeOfConduct: Boolean(initialDraft?.codeOfConduct),
    truthfulnessDeclaration: Boolean(initialDraft?.truthfulnessDeclaration),
    declarantName: initialDraft?.declarantName || '',
    declarantRole: initialDraft?.declarantRole || 'Director / Commercial Lead',
    declarantUserId: initialDraft?.declarantUserId || '',
    declaredAt: initialDraft?.declaredAt || '',
    codeOfConductVersion: initialDraft?.codeOfConductVersion || '2026.1',
    declarationTermsAccepted: Boolean(initialDraft?.legalAcceptances?.['terms-of-business']?.accepted),
    declarationAuthorityAccepted: Boolean(initialDraft?.legalAcceptances?.['authority']?.accepted),
    declarationVerificationAccepted: Boolean(initialDraft?.legalAcceptances?.['verification']?.accepted),

    // 15: Payment Method Gateway (Exact wording preserved)
    paymentMethod: (initialDraft?.paymentMethod || 'CARD') as 'CARD' | 'INVOICE' | 'WAIVER',
    waiverReason: initialDraft?.waiverReason || '',
  });

  // Calculate section completeness for progress bar and Stage 15 review
  const sectionCompleteness = useMemo(() => {
    return {
      company: Boolean(formData.legalCompanyName && formData.companyNumber && formData.tradingAddress && formData.mainPhone),
      contacts: Boolean(formData.primaryContactName && formData.primaryContactEmail && formData.opsContactName && formData.opsContactEmail),
      services: formData.selectedServices.length > 0,
      coverage: formData.selectedRegions.length > 0 || formData.coverageType === 'NATIONAL',
      operations: Boolean(formData.standardOperatingHours && formData.serviceDeliveryTypes.length > 0),
      workforce: Boolean(formData.directEngineers && (!formData.hasSubcontractors || formData.subStandardsAccepted)),
      insurance: Boolean(formData.plInsurer && formData.plPolicyNumber && formData.plCoverLimit),
      accreditations: formData.selectedAccreditations.length > 0,
      health_safety: Boolean(formData.hasHsPolicy && formData.competentPersonName && (!formData.hasIncidentHistory || formData.incidentDetails)),
      governance: Boolean(formData.antiBribery && formData.sanctionsConfirmed && (!formData.disclosureCriminalConvictions || formData.disclosureDetails)),
      security: Boolean(formData.infosecPolicy && (!formData.cyberBreachPast3yr || formData.cyberBreachDetails)),
      documents: documents.length > 0,
      commercial: Boolean(formData.turnoverBand && formData.largestContractBand),
      declarations: Boolean(formData.codeOfConduct && formData.truthfulnessDeclaration && formData.declarationAuthorityAccepted && formData.declarantName),
    };
  }, [formData, documents]);

  const completedSectionsCount = Object.values(sectionCompleteness).filter(Boolean).length;
  const overallProgressPct = Math.round((completedSectionsCount / 14) * 100);

  // Autosave function to persist data to Supabase & in-memory cache
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/supplier/application/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: initialOrgId,
          draftData: {
            ...formData,
            currentStep,
            documentVault: documents,
            legalAcceptances: {
              'supplier-code': {
                accepted: formData.codeOfConduct,
                version: '2026.1',
                timestamp: new Date().toISOString(),
              },
              'terms-of-business': {
                accepted: formData.declarationTermsAccepted,
                version: '2026.1',
                timestamp: new Date().toISOString(),
              },
              authority: {
                accepted: formData.declarationAuthorityAccepted,
                version: '2026.1',
                timestamp: new Date().toISOString(),
              },
              verification: {
                accepted: formData.declarationVerificationAccepted,
                version: '2026.1',
                timestamp: new Date().toISOString(),
              },
            },
          },
        }),
      });

      if (res.ok) {
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        const data = await res.json();
        setSaveError(data.error || 'Failed to autosave');
      }
    } catch (err: any) {
      console.warn('Autosave network warning:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    await handleSave();
    if (currentStep < 15) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = async () => {
    await handleSave();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Upload handler for Document Vault
  const handleDocumentUpload = async (docType: string, category: 'MANDATORY' | 'ACCREDITATION' | 'POLICY' | 'SUPPORTING', file?: File) => {
    setUploadingDocType(docType);
    try {
      const fileName = file ? file.name : `${docType.replace(/\s+/g, '_')}_Certificate.pdf`;
      const fileSizeBytes = file ? file.size : 1024 * 340;

      const res = await fetch('/api/supplier/application/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: initialOrgId,
          document: {
            category,
            documentType: docType,
            fileName,
            fileSizeBytes,
            status: 'UPLOADED',
            issueDate: new Date().toISOString().slice(0, 10),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.documents) {
        setDocuments(data.documents);
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploadingDocType(null);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`/api/supplier/application/documents?orgId=${encodeURIComponent(initialOrgId)}&docId=${encodeURIComponent(docId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success && data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Delete document error:', err);
    }
  };

  // Submit Handler (Direct Technical Submission — Zero Payment Gate)
  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/supplier/application/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: initialOrgId || 'supplier-draft',
          draftData: {
            ...formData,
            documentVault: documents,
            status: 'SUBMITTED',
            submittedAt: new Date().toISOString(),
            currentStep: 15,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSaveError(data.error || 'Failed to submit application. Please check your inputs and try again.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Submission network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Post-Submission Success Screen ────────
  if (submitted) {
    return (
      <div className="bg-white border border-slate-200 rounded-sm p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto space-y-6">
        <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-light uppercase tracking-wider text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
            APPLICATION SUBMISSION CONFIRMED
          </span>
          <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-slate-900">
            Application Submitted Successfully
          </h1>
          <p className="text-xs text-slate-600 font-light max-w-md mx-auto leading-relaxed">
            Your application reference is{' '}
            <strong className="text-slate-900 font-medium">{appRef}</strong>. Your supplier application has been received by EntireFM and will now be reviewed by our supplier management team.
          </p>
        </div>

        <div className="p-5 bg-slate-50 border border-slate-200 rounded-sm text-left text-xs font-light space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-900 font-sans">Application Status:</span>
            <span className="text-emerald-700 font-bold">UNDER REVIEW</span>
          </div>

          <div className="space-y-2 pt-1">
            <span className="font-bold text-slate-900 font-sans block">What Happens Next:</span>
            <ul className="space-y-1.5 text-slate-600 font-sans text-[11.5px]">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">&bull;</span>
                <span>1. <strong>Technical Due Diligence:</strong> EntireFM Supplier Management reviews your submitted compliance, insurance, and trade credentials.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">&bull;</span>
                <span>2. <strong>Action Notifications:</strong> If any clarifications or additional documentation are required, you will receive an action notification in your portal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">&bull;</span>
                <span>3. <strong>Approval &amp; Scope Authorisation:</strong> Upon successful verification, your approved service disciplines and regional coverage will be activated in your portal.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link href="/supplier-portal" className="btn-primary text-xs py-2.5 px-6 font-bold">
            Go to Supplier Dashboard &rarr;
          </Link>
          <Link href="/supplier-portal/documents" className="btn-secondary text-xs py-2.5 px-6">
            View Document Vault
          </Link>
        </div>
      </div>
    );
  }

  // ── Main Step Wizard Screen ────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Navigation Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm space-y-3 sticky top-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
              QUALIFICATION WIZARD
            </span>
            <span className="text-[10.5px] font-light text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              {overallProgressPct}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>

          <div className="space-y-1">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isCurrent = currentStep === step.num;
              const isComplete = (sectionCompleteness as any)[step.key];

              return (
                <button
                  key={step.num}
                  onClick={async () => {
                    await handleSave();
                    setCurrentStep(step.num);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded text-left text-xs transition-colors ${
                    isCurrent
                      ? 'bg-slate-900 text-white font-medium shadow-sm'
                      : isComplete
                      ? 'text-slate-700 hover:bg-slate-50'
                      : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon
                      className={`h-3.5 w-3.5 shrink-0 ${
                        isCurrent ? 'text-brand-pink' : isComplete ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span className="truncate">
                      {step.num}. {step.title}
                    </span>
                  </div>
                  {isComplete && <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[10.5px] font-light text-slate-400 flex items-center justify-between">
            <span>{isSaving ? 'Autosaving...' : `Saved: ${lastSaved}`}</span>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="text-slate-900 font-bold hover:underline disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save & Exit'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Step Form Area */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
          {/* Step Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-light uppercase tracking-wider text-brand-pink font-bold">
                STAGE {currentStep} OF 15
              </span>
              <h2 className="text-xl font-light text-slate-900 mt-0.5">{STEPS[currentStep - 1].title}</h2>
            </div>
            <span className="text-xs font-light text-slate-400 font-mono">Ref: {appRef}</span>
          </div>

          {/* ── STAGE 01: COMPANY PROFILE ────────────────────────────────────────── */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Legal Company Name *</label>
                  <input
                    type="text"
                    value={formData.legalCompanyName}
                    onChange={(e) => setFormData({ ...formData, legalCompanyName: e.target.value })}
                    placeholder="e.g. Apex Engineering Services Ltd"
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Trading Name (if different)</label>
                  <input
                    type="text"
                    value={formData.tradingName}
                    onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
                    placeholder="e.g. Apex M&E"
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Companies House Number *</label>
                  <input
                    type="text"
                    value={formData.companyNumber}
                    onChange={(e) => setFormData({ ...formData, companyNumber: e.target.value })}
                    placeholder="e.g. 09876543"
                    className="w-full p-2.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">VAT Registration Number</label>
                  <input
                    type="text"
                    value={formData.vatNumber}
                    onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                    placeholder="e.g. GB 123 4567 89"
                    className="w-full p-2.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Registered &amp; Trading Address *</label>
                <textarea
                  rows={2}
                  value={formData.tradingAddress}
                  onChange={(e) => setFormData({ ...formData, tradingAddress: e.target.value })}
                  placeholder="Street, City, County, Postcode"
                  className="w-full p-2.5 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Year Established</label>
                  <input
                    type="text"
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                    placeholder="e.g. 2012"
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Total Employees</label>
                  <select
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  >
                    <option value="1-5">1 - 5</option>
                    <option value="6-15">6 - 15</option>
                    <option value="16-50">16 - 50</option>
                    <option value="51-200">51 - 200</option>
                    <option value="201-500">201 - 500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Primary Business Type *</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  >
                    <option value="Local SME">Local SME Contractor</option>
                    <option value="Regional Contractor">Regional Contractor</option>
                    <option value="National Contractor">National Service Provider</option>
                    <option value="Specialist Contractor">Specialist Engineering Contractor</option>
                    <option value="Manufacturer / OEM">Manufacturer / Equipment OEM</option>
                    <option value="Technology Provider">Technology &amp; IoT Provider</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Main Office Phone *</label>
                  <input
                    type="tel"
                    value={formData.mainPhone}
                    onChange={(e) => setFormData({ ...formData, mainPhone: e.target.value })}
                    placeholder="e.g. 0114 200 5000"
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">General Enquiry Email *</label>
                  <input
                    type="email"
                    value={formData.generalEmail}
                    onChange={(e) => setFormData({ ...formData, generalEmail: e.target.value })}
                    placeholder="info@company.co.uk"
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Website URL</label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://www.company.co.uk"
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Company Overview &amp; Capability Statement</label>
                <textarea
                  rows={3}
                  value={formData.companySummary}
                  onChange={(e) => setFormData({ ...formData, companySummary: e.target.value })}
                  placeholder="Summarise your core facilities management capabilities, asset types managed, and company background..."
                  className="w-full p-2.5 border border-slate-200 rounded text-xs"
                />
              </div>
            </div>
          )}

          {/* ── STAGE 02: CONTACTS & ROLES ────────────────────────────────────────── */}
          {currentStep === 2 && (
            <div className="space-y-6 text-xs font-sans">
              <p className="text-slate-500 font-light text-[11.5px]">
                Please provide designated points of contact across commercial, operations, finance, and health &amp; safety.
              </p>

              {/* Contact 1: Primary Commercial Contact */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-700" />
                  <span className="font-bold text-slate-900">Primary Commercial &amp; Contract Lead *</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.primaryContactName}
                    onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.primaryContactEmail}
                    onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="Direct Phone *"
                    value={formData.primaryContactPhone}
                    onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                </div>
              </div>

              {/* Contact 2: Operations & 24/7 Dispatch Lead */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-700" />
                  <span className="font-bold text-slate-900">Operations &amp; 24/7 Dispatch Lead *</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.opsContactName}
                    onChange={(e) => setFormData({ ...formData, opsContactName: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                  <input
                    type="email"
                    placeholder="Operations Email *"
                    value={formData.opsContactEmail}
                    onChange={(e) => setFormData({ ...formData, opsContactEmail: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="24/7 Dispatch Phone"
                    value={formData.opsContactPhone}
                    onChange={(e) => setFormData({ ...formData, opsContactPhone: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                </div>
              </div>

              {/* Contact 3: Finance & Invoicing Contact */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-700" />
                  <span className="font-bold text-slate-900">Finance &amp; Accounts Payable Contact</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Finance Contact Name"
                    value={formData.financeContactName}
                    onChange={(e) => setFormData({ ...formData, financeContactName: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                  <input
                    type="email"
                    placeholder="Invoicing / Accounts Email"
                    value={formData.financeContactEmail}
                    onChange={(e) => setFormData({ ...formData, financeContactEmail: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="Finance Phone"
                    value={formData.financeContactPhone}
                    onChange={(e) => setFormData({ ...formData, financeContactPhone: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                </div>
              </div>

              {/* Contact 4: Health & Safety / Compliance Lead */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-slate-700" />
                  <span className="font-bold text-slate-900">Health &amp; Safety / Compliance Lead</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="H&S Officer Name"
                    value={formData.hsContactName}
                    onChange={(e) => setFormData({ ...formData, hsContactName: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                  <input
                    type="email"
                    placeholder="H&S Email"
                    value={formData.hsContactEmail}
                    onChange={(e) => setFormData({ ...formData, hsContactEmail: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="H&S Direct Phone"
                    value={formData.hsContactPhone}
                    onChange={(e) => setFormData({ ...formData, hsContactPhone: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STAGE 03: SERVICES & TRADES (HIERARCHICAL TAXONOMY) ──────────────── */}
          {currentStep === 3 && (
            <div className="space-y-6 text-xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Select Declared Trades &amp; Disciplines</span>
                  <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                    Select your core trades. Declared services are independently reviewed by EntireFM technical assurance desks before scoped approval.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 shrink-0">
                  {formData.selectedServices.length} Selected
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Search 70+ disciplines (e.g. HVAC, Fire Alarm, Drone, Gas, Rope Access, Cleaning)..."
                  className="w-full pl-9 p-2 border border-slate-200 rounded text-xs font-sans"
                />
                {serviceSearch && (
                  <button
                    onClick={() => setServiceSearch('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Category Tabs */}
              {!serviceSearch && (
                <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
                  {SUPPLIER_SERVICE_TAXONOMY.map((cat) => {
                    const countInCat = cat.trades.filter((t) => formData.selectedServices.includes(t.id)).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveTaxonomyTab(cat.id)}
                        className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
                          activeTaxonomyTab === cat.id
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span>{cat.title}</span>
                        {countInCat > 0 && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              activeTaxonomyTab === cat.id ? 'bg-brand-pink text-white' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {countInCat}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Taxonomy Trade Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {SUPPLIER_SERVICE_TAXONOMY.filter((cat) => (serviceSearch ? true : cat.id === activeTaxonomyTab)).flatMap(
                  (cat) =>
                    cat.trades
                      .filter((t) =>
                        serviceSearch
                          ? t.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                            cat.title.toLowerCase().includes(serviceSearch.toLowerCase())
                          : true
                      )
                      .map((trade) => {
                        const isChecked = formData.selectedServices.includes(trade.id);
                        return (
                          <div
                            key={trade.id}
                            onClick={() => {
                              const updated = isChecked
                                ? formData.selectedServices.filter((s) => s !== trade.id)
                                : [...formData.selectedServices, trade.id];
                              setFormData({ ...formData, selectedServices: updated });
                            }}
                            className={`p-3 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                              isChecked
                                ? 'bg-emerald-50/70 border-emerald-400 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} // Click handled on card
                                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                              />
                              <div className="space-y-0.5">
                                <span
                                  className={`text-xs block ${
                                    isChecked ? 'font-bold text-slate-900' : 'text-slate-800'
                                  }`}
                                >
                                  {trade.name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                                  {cat.title}
                                </span>
                              </div>
                            </div>

                            {trade.requiresAccreditation && (
                              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                <span className="text-slate-500">Scheme:</span>
                                <span className="font-mono text-emerald-700 font-bold">
                                  {trade.requiresAccreditation}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })
                )}
              </div>

              {/* Other Custom Services */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                <label className="font-bold text-slate-900 block">Other Specialist Trades or Services</label>
                <textarea
                  rows={2}
                  value={formData.customServices}
                  onChange={(e) => setFormData({ ...formData, customServices: e.target.value })}
                  placeholder="If you deliver specialist capabilities not listed above (e.g. acoustic testing, niche OEM chillers), detail them here..."
                  className="w-full p-2.5 border border-slate-200 rounded text-xs bg-white"
                />
              </div>

              {/* Declared ≠ Approved Callout */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-blue-900 text-[11px] flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
                <span>
                  <strong>Assurance Semantic Note:</strong> Declaring a trade in this wizard indicates your scope of interest.
                  EntireFM grants formal technical approval for specific services only following verification of valid scheme
                  registrations and engineering qualifications in later steps.
                </span>
              </div>
            </div>
          )}

          {/* ── STAGE 04: COVERAGE & OPERATING BASES ───────────────────────────── */}
          {currentStep === 4 && (
            <div className="space-y-6 text-xs font-sans">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Geographical Coverage &amp; Operating Depots</span>
                <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                  Declare your proven operational footprint. Scoped approvals ensure work orders are only dispatched within your committed travel and response times.
                </p>
              </div>

              {/* Coverage Model Selector */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Coverage Model *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'NATIONAL', label: 'UK-Wide / National', desc: 'Direct engineers or depots across all regions' },
                    { key: 'REGIONAL', label: 'Regional Footprint', desc: 'Selected counties and metropolitan regions' },
                    { key: 'RADIUS', label: 'Operational Radius', desc: 'Dedicated radius from depot/headquarters' },
                  ].map((model) => (
                    <label
                      key={model.key}
                      className={`p-3 border rounded cursor-pointer transition-all ${
                        formData.coverageType === model.key
                          ? 'bg-slate-900 text-white font-bold border-slate-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="coverageType"
                        checked={formData.coverageType === model.key}
                        onChange={() => setFormData({ ...formData, coverageType: model.key as any })}
                        className="sr-only"
                      />
                      <span className="block text-xs">{model.label}</span>
                      <span className="block text-[10.5px] font-normal opacity-80 mt-0.5">{model.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Regional Multi-Select (shown if REGIONAL or RADIUS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Select Specific Covered Regions *</label>
                  <button
                    type="button"
                    onClick={() => {
                      const allRegions = [
                        'London', 'South East', 'South West', 'East of England',
                        'East Midlands', 'West Midlands', 'North West', 'North East',
                        'Yorkshire & Humber', 'Scotland', 'Wales', 'Northern Ireland',
                      ];
                      const areAllSelected = formData.selectedRegions.length === allRegions.length;
                      setFormData({ ...formData, selectedRegions: areAllSelected ? [] : allRegions });
                    }}
                    className="text-brand-pink font-bold text-[11px] hover:underline"
                  >
                    {formData.selectedRegions.length === 12 ? 'Deselect All' : 'Select All UK Regions'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    'London', 'South East', 'South West', 'East of England',
                    'East Midlands', 'West Midlands', 'North West', 'North East',
                    'Yorkshire & Humber', 'Scotland', 'Wales', 'Northern Ireland',
                  ].map((region) => {
                    const isSelected = formData.selectedRegions.includes(region);
                    return (
                      <label
                        key={region}
                        className={`flex items-center gap-2 p-2.5 border rounded cursor-pointer text-xs ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-300 font-bold text-slate-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            const updated = isSelected
                              ? formData.selectedRegions.filter((r) => r !== region)
                              : [...formData.selectedRegions, region];
                            setFormData({ ...formData, selectedRegions: updated });
                          }}
                          className="rounded text-emerald-600"
                        />
                        <span>{region}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Operating Base / Depot Input */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <span className="font-bold text-slate-900 block">Primary Operating Depot / Headquarters</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Depot Name (e.g. Sheffield Hub)"
                    value={formData.operatingBases[0]?.name || ''}
                    onChange={(e) => {
                      const updated = [...formData.operatingBases];
                      updated[0] = { ...updated[0], name: e.target.value };
                      setFormData({ ...formData, operatingBases: updated });
                    }}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="City (e.g. Sheffield)"
                    value={formData.operatingBases[0]?.city || ''}
                    onChange={(e) => {
                      const updated = [...formData.operatingBases];
                      updated[0] = { ...updated[0], city: e.target.value };
                      setFormData({ ...formData, operatingBases: updated });
                    }}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Postcode (e.g. S1 2HE)"
                    value={formData.operatingBases[0]?.postcode || ''}
                    onChange={(e) => {
                      const updated = [...formData.operatingBases];
                      updated[0] = { ...updated[0], postcode: e.target.value };
                      setFormData({ ...formData, operatingBases: updated });
                    }}
                    className="p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Normal Operational Dispatch Radius</label>
                    <select
                      value={formData.operationalRadiusMiles}
                      onChange={(e) => setFormData({ ...formData, operationalRadiusMiles: parseInt(e.target.value, 10) })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    >
                      <option value={25}>25 Miles Radius</option>
                      <option value={50}>50 Miles Radius</option>
                      <option value={75}>75 Miles Radius</option>
                      <option value={100}>100 Miles Radius</option>
                      <option value={150}>150+ Miles / Regional</option>
                    </select>
                  </div>

                  <label className="flex items-start gap-2.5 pt-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.nationalMobilisation}
                      onChange={(e) => setFormData({ ...formData, nationalMobilisation: e.target.checked })}
                      className="mt-0.5 rounded text-emerald-600"
                    />
                    <span className="text-slate-700">Able to mobilise nationally for major projects or emergencies</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ── STAGE 05: OPERATIONAL CAPABILITY ──────────────────────────────── */}
          {currentStep === 5 && (
            <div className="space-y-6 text-xs font-sans">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Service Delivery &amp; Operational Capabilities</span>
                <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                  Specify your maintenance formats, standard operating hours, emergency SLA capabilities, fleet scale, and digital systems.
                </p>
              </div>

              {/* Service Delivery Modes */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Service Delivery Work Types Supported *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'PPM', label: 'Planned Preventative (PPM)' },
                    { id: 'REACTIVE', label: 'Reactive Maintenance' },
                    { id: 'EMERGENCY_CALLOUT', label: '24/7 Emergency Call-out' },
                    { id: 'MINOR_WORKS', label: 'Minor Works & Refurb' },
                    { id: 'PROJECTS', label: 'Capital Projects' },
                    { id: 'COMPLIANCE', label: 'Statutory Inspections' },
                    { id: 'CONDITION_SURVEYS', label: 'Asset Condition Surveys' },
                    { id: 'THERMOGRAPHY', label: 'Diagnostic Surveys' },
                  ].map((type) => {
                    const isSelected = formData.serviceDeliveryTypes.includes(type.id);
                    return (
                      <label
                        key={type.id}
                        className={`p-2.5 border rounded cursor-pointer flex items-center gap-2 ${
                          isSelected ? 'bg-emerald-50 border-emerald-300 font-bold text-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            const updated = isSelected
                              ? formData.serviceDeliveryTypes.filter((t) => t !== type.id)
                              : [...formData.serviceDeliveryTypes, type.id];
                            setFormData({ ...formData, serviceDeliveryTypes: updated });
                          }}
                          className="rounded text-emerald-600"
                        />
                        <span>{type.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Standard Hours & 24/7 Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Standard Operating Hours</label>
                  <input
                    type="text"
                    value={formData.standardOperatingHours}
                    onChange={(e) => setFormData({ ...formData, standardOperatingHours: e.target.value })}
                    placeholder="e.g. 08:00 - 17:00 (Mon-Fri)"
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Genuine 24/7/365 Emergency Service? *</label>
                  <select
                    value={formData.has247 ? 'YES' : 'NO'}
                    onChange={(e) => setFormData({ ...formData, has247: e.target.value === 'YES' })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  >
                    <option value="YES">Yes — 24/7/365 Emergency Call-out Available</option>
                    <option value="NO">No — Standard Operating Hours Only</option>
                  </select>
                </div>
              </div>

              {/* Conditional 24/7 details */}
              {formData.has247 && (
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded space-y-3">
                  <span className="font-bold text-slate-900 block">24/7 Emergency Dispatch Details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-medium text-slate-700">Staffing Model</label>
                      <select
                        value={formData.emergency247Staffing}
                        onChange={(e) => setFormData({ ...formData, emergency247Staffing: e.target.value as any })}
                        className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                      >
                        <option value="DIRECT">Directly Staffed Shift Rotation</option>
                        <option value="ON_CALL">On-Call Engineer Rota (Standby)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-medium text-slate-700">Emergency Hotline / Contact Mechanism</label>
                      <input
                        type="text"
                        value={formData.emergencyContactMechanism}
                        onChange={(e) => setFormData({ ...formData, emergencyContactMechanism: e.target.value })}
                        placeholder="e.g. 24/7 Helpdesk: 0800 123 4567"
                        className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Indicative Response Capabilities */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">Indicative Response Capabilities</span>
                <p className="text-slate-500 font-light text-[11px]">
                  Indicative capabilities only (not contractual SLAs at onboarding stage).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">P1 Emergency (Make Safe)</label>
                    <select
                      value={formData.responseTimeP1}
                      onChange={(e) => setFormData({ ...formData, responseTimeP1: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded text-xs"
                    >
                      <option value="1-2 Hours">1 - 2 Hours</option>
                      <option value="2-4 Hours">2 - 4 Hours</option>
                      <option value="4-6 Hours">4 - 6 Hours</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">P2 Urgent</label>
                    <select
                      value={formData.responseTimeP2}
                      onChange={(e) => setFormData({ ...formData, responseTimeP2: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded text-xs"
                    >
                      <option value="4 Hours">4 Hours</option>
                      <option value="Same Day (8h)">Same Day (8h)</option>
                      <option value="Next Business Day">Next Business Day</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">P3 Routine PPM / Repairs</label>
                    <select
                      value={formData.responseTimeP3}
                      onChange={(e) => setFormData({ ...formData, responseTimeP3: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded text-xs"
                    >
                      <option value="24-48 Hours">24 - 48 Hours</option>
                      <option value="3-5 Business Days">3 - 5 Business Days</option>
                      <option value="Scheduled Maintenance Window">Scheduled Window</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fleet & Logistics */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <span className="font-bold text-slate-900 block">Fleet, Logistics &amp; Equipment</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Commercial Vans / Vehicles</label>
                    <input
                      type="number"
                      value={formData.vehicleCount}
                      onChange={(e) => setFormData({ ...formData, vehicleCount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                  <label className="flex items-center gap-2 pt-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.brandedFleet}
                      onChange={(e) => setFormData({ ...formData, brandedFleet: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span className="text-slate-700">Branded Fleet</span>
                  </label>
                  <label className="flex items-center gap-2 pt-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.gpsTracking}
                      onChange={(e) => setFormData({ ...formData, gpsTracking: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span className="text-slate-700">GPS Tracked</span>
                  </label>
                  <label className="flex items-center gap-2 pt-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.vehicleStock}
                      onChange={(e) => setFormData({ ...formData, vehicleStock: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span className="text-slate-700">First-Time Fix Stock</span>
                  </label>
                </div>
              </div>

              {/* Digital & Systems Capabilities */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Mobile Field &amp; Systems Capabilities *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'SMARTPHONES', label: 'Engineer Smartphones / Tablets' },
                    { id: 'REAL_TIME_JOB_ACCESS', label: 'Real-Time Job Dispatch Access' },
                    { id: 'PHOTO_UPLOAD', label: 'Before/After Photo Proof Capture' },
                    { id: 'DIGITAL_SIGNATURES', label: 'Client Digital Signatures' },
                    { id: 'DIGITAL_JOB_SHEETS', label: 'Paperless Digital Worksheets' },
                    { id: 'API_INTEGRATION', label: 'API / Webhook Integration Ready' },
                  ].map((cap) => {
                    const isChecked = formData.engineerDeviceCapabilities.includes(cap.id);
                    return (
                      <label
                        key={cap.id}
                        className={`p-2.5 border rounded cursor-pointer flex items-center gap-2 ${
                          isChecked ? 'bg-emerald-50 border-emerald-300 font-bold text-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const updated = isChecked
                              ? formData.engineerDeviceCapabilities.filter((c) => c !== cap.id)
                              : [...formData.engineerDeviceCapabilities, cap.id];
                            setFormData({ ...formData, engineerDeviceCapabilities: updated });
                          }}
                          className="rounded text-emerald-600"
                        />
                        <span>{cap.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STAGE 06: WORKFORCE & SUBCONTRACTORS ───────────────────────────── */}
          {currentStep === 6 && (
            <div className="space-y-6 text-xs font-sans">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Workforce Structure &amp; Subcontractor Controls</span>
                <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                  EntireFM requires strict supply-chain transparency. Declare your direct employment model, operative qualifications, and subcontracting governance.
                </p>
              </div>

              {/* Workforce Breakdown */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <span className="font-bold text-slate-900 block">Direct Workforce Headcount Breakdown</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-600 block text-[10.5px]">Field Operatives</label>
                    <input
                      type="number"
                      value={formData.fieldOperativesCount}
                      onChange={(e) => setFormData({ ...formData, fieldOperativesCount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 block text-[10.5px]">Qualified Engineers</label>
                    <input
                      type="number"
                      value={formData.qualifiedEngineersCount}
                      onChange={(e) => setFormData({ ...formData, qualifiedEngineersCount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 block text-[10.5px]">Supervisors / Leads</label>
                    <input
                      type="number"
                      value={formData.supervisorsCount}
                      onChange={(e) => setFormData({ ...formData, supervisorsCount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 block text-[10.5px]">Office &amp; Support</label>
                    <input
                      type="number"
                      value={formData.officeStaffCount}
                      onChange={(e) => setFormData({ ...formData, officeStaffCount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 block text-[10.5px]">Apprentices</label>
                    <input
                      type="number"
                      value={formData.apprenticesCount}
                      onChange={(e) => setFormData({ ...formData, apprenticesCount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Model */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Workforce Employment Model *</label>
                <select
                  value={formData.employmentModel}
                  onChange={(e) => setFormData({ ...formData, employmentModel: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-200 rounded text-xs"
                >
                  <option value="DIRECT_ONLY">100% Directly Employed (Zero Subcontracting)</option>
                  <option value="DIRECT_PRIMARY">Primarily Directly Employed (&gt;80% Direct Labour)</option>
                  <option value="MIXED">Mixed Direct Labour &amp; Specialist Subcontractors</option>
                  <option value="SUBCONTRACT_PRIMARY">Primarily Subcontracted Management</option>
                </select>
              </div>

              {/* Qualifications Held */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Workforce Trade Competency Cards &amp; Qualifications *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'CSCS Carded',
                    'ECS Electrotechnical',
                    'Gas Safe Qualified',
                    'F-Gas Cat 1 Certified',
                    'NICEIC Qualified Supervisors',
                    'IPAF (MEWP)',
                    'PASMA (Towers)',
                    'IRATA (Rope Access)',
                    'SSSTS / SMSTS',
                    'NEBOSH / IOSH',
                    'First Aid at Work',
                    'Asbestos Awareness (Cat A)',
                    'Confined Space Entry',
                    'Working at Height',
                  ].map((qual) => {
                    const isChecked = formData.qualificationsHeld.includes(qual);
                    return (
                      <label
                        key={qual}
                        className={`p-2.5 border rounded cursor-pointer flex items-center gap-2 ${
                          isChecked ? 'bg-emerald-50 border-emerald-300 font-bold text-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const updated = isChecked
                              ? formData.qualificationsHeld.filter((q) => q !== qual)
                              : [...formData.qualificationsHeld, qual];
                            setFormData({ ...formData, qualificationsHeld: updated });
                          }}
                          className="rounded text-emerald-600"
                        />
                        <span className="text-[11px]">{qual}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Subcontractor Flow */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Do you utilise subcontractors for client delivery? *</span>
                  <select
                    value={formData.hasSubcontractors ? 'YES' : 'NO'}
                    onChange={(e) => setFormData({ ...formData, hasSubcontractors: e.target.value === 'YES' })}
                    className="p-1.5 border border-slate-200 rounded text-xs bg-white font-bold"
                  >
                    <option value="NO">No — 100% Self-Delivered</option>
                    <option value="YES">Yes — Subcontractors Used</option>
                  </select>
                </div>

                {formData.hasSubcontractors && (
                  <div className="space-y-4 pt-3 border-t border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-medium text-slate-700">Approx. Percentage Subcontracted</label>
                        <select
                          value={formData.subcontractorPct}
                          onChange={(e) => setFormData({ ...formData, subcontractorPct: parseInt(e.target.value, 10) })}
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                        >
                          <option value={5}>Under 10% (Specialist only)</option>
                          <option value={20}>10% - 25%</option>
                          <option value={40}>25% - 50%</option>
                          <option value={75}>Over 50%</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="font-medium text-slate-700">Subcontractor Vetting &amp; Approval Process</label>
                        <input
                          type="text"
                          value={formData.subcontractorApprovalProcess}
                          onChange={(e) => setFormData({ ...formData, subcontractorApprovalProcess: e.target.value })}
                          placeholder="e.g. Annual SSIP verification, insurance audits, competency checks"
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="font-bold text-slate-800 block text-[11px]">Subcontractor Verification Controls:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { key: 'subChecksCompetency', label: 'Competency & Quals Checked' },
                          { key: 'subChecksInsurance', label: 'Insurance Checked Annually' },
                          { key: 'subChecksHs', label: 'H&S Policy / RAMS Audited' },
                          { key: 'subChecksAccreditation', label: 'Trade Accreditation Verified' },
                          { key: 'subMonitorsPerformance', label: 'Performance Monitored' },
                          { key: 'subEntirefmCompliance', label: 'EntireFM Standards Enforced' },
                        ].map((chk) => (
                          <label key={chk.key} className="flex items-center gap-2 text-[11px] text-slate-700">
                            <input
                              type="checkbox"
                              checked={(formData as any)[chk.key]}
                              onChange={(e) => setFormData({ ...formData, [chk.key]: e.target.checked })}
                              className="rounded text-emerald-600"
                            />
                            <span>{chk.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Mandatory Subcontractor Acceptance */}
                    <label className="flex items-start gap-2.5 p-3 bg-amber-50/70 border border-amber-200 rounded cursor-pointer mt-2">
                      <input
                        type="checkbox"
                        checked={formData.subStandardsAccepted}
                        onChange={(e) => setFormData({ ...formData, subStandardsAccepted: e.target.checked })}
                        className="mt-0.5 rounded text-amber-600"
                      />
                      <span className="text-[11px] text-amber-950 font-medium leading-relaxed">
                        <strong>Mandatory Confirmation:</strong> We accept full legal, technical, and operational
                        responsibility for ensuring any subcontractors deployed on EntireFM work meet or exceed the
                        health, safety, competency, and insurance standards required by EntireFM.
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STAGE 07: INSURANCE SCHEDULES ─────────────────────────────────── */}
          {currentStep === 7 && (
            <div className="space-y-6 text-xs font-sans">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Insurance Schedules &amp; Indemnity Limits</span>
                <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                  Valid insurance schedules are a mandatory condition of supplier approval. Please enter policy details and upload your broker certificate.
                </p>
              </div>

              {/* 1. Public Liability (Mandatory) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Public &amp; Products Liability (Mandatory) *</span>
                  </div>
                  <span className="text-[10.5px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Minimum £5,000,000
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Insurer Name *</label>
                    <input
                      type="text"
                      value={formData.plInsurer}
                      onChange={(e) => setFormData({ ...formData, plInsurer: e.target.value })}
                      placeholder="e.g. Aviva Insurance"
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Policy Number *</label>
                    <input
                      type="text"
                      value={formData.plPolicyNumber}
                      onChange={(e) => setFormData({ ...formData, plPolicyNumber: e.target.value })}
                      placeholder="e.g. 2489910/PL/2026"
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Cover Limit *</label>
                    <select
                      value={formData.plCoverLimit}
                      onChange={(e) => setFormData({ ...formData, plCoverLimit: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-bold"
                    >
                      <option value="£5,000,000">£5,000,000</option>
                      <option value="£10,000,000">£10,000,000</option>
                      <option value="£20,000,000+">£20,000,000+</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Expiry Date *</label>
                    <input
                      type="date"
                      value={formData.plExpiryDate}
                      onChange={(e) => setFormData({ ...formData, plExpiryDate: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Employers' Liability (Mandatory if staff employed) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Employers Liability Insurance *</span>
                  </div>
                  <span className="text-[10.5px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Minimum £10,000,000
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Insurer Name *</label>
                    <input
                      type="text"
                      value={formData.elInsurer}
                      onChange={(e) => setFormData({ ...formData, elInsurer: e.target.value })}
                      placeholder="e.g. Zurich Insurance"
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Policy Number *</label>
                    <input
                      type="text"
                      value={formData.elPolicyNumber}
                      onChange={(e) => setFormData({ ...formData, elPolicyNumber: e.target.value })}
                      placeholder="e.g. EL-8899214-Z"
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Cover Limit *</label>
                    <select
                      value={formData.elCoverLimit}
                      onChange={(e) => setFormData({ ...formData, elCoverLimit: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-bold"
                    >
                      <option value="£10,000,000">£10,000,000</option>
                      <option value="£15,000,000">£15,000,000</option>
                      <option value="£20,000,000+">£20,000,000+</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Expiry Date *</label>
                    <input
                      type="date"
                      value={formData.elExpiryDate}
                      onChange={(e) => setFormData({ ...formData, elExpiryDate: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Professional Indemnity (Conditional) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-slate-600" />
                    <span className="font-bold text-slate-900">Professional Indemnity Insurance</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.piApplicable}
                      onChange={(e) => setFormData({ ...formData, piApplicable: e.target.checked })}
                      className="rounded text-brand-pink"
                    />
                    <span>Applicable to our services</span>
                  </label>
                </div>

                {formData.piApplicable && (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="font-medium text-slate-700">PI Insurer</label>
                      <input
                        type="text"
                        value={formData.piInsurer}
                        onChange={(e) => setFormData({ ...formData, piInsurer: e.target.value })}
                        placeholder="e.g. Hiscox"
                        className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-medium text-slate-700">PI Policy Number</label>
                      <input
                        type="text"
                        value={formData.piPolicyNumber}
                        onChange={(e) => setFormData({ ...formData, piPolicyNumber: e.target.value })}
                        placeholder="e.g. PI-992144"
                        className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-medium text-slate-700">PI Cover Limit</label>
                      <select
                        value={formData.piCoverLimit}
                        onChange={(e) => setFormData({ ...formData, piCoverLimit: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-bold"
                      >
                        <option value="£1,000,000">£1,000,000</option>
                        <option value="£2,000,000">£2,000,000</option>
                        <option value="£5,000,000">£5,000,000</option>
                        <option value="£10,000,000">£10,000,000</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-medium text-slate-700">PI Expiry Date</label>
                      <input
                        type="date"
                        value={formData.piExpiryDate}
                        onChange={(e) => setFormData({ ...formData, piExpiryDate: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STAGE 08: ACCREDITATIONS & TRADE SCHEMES ─────────────────────── */}
          {currentStep === 8 && (
            <div className="space-y-6 text-xs font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block text-sm">SSIP &amp; Industry Trade Accreditations</span>
                  <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                    Select each active accreditation held by your organisation and provide the scheme registration number and certificate expiry.
                  </p>
                </div>
                <span className="text-[11.5px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 shrink-0">
                  {formData.selectedAccreditations.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {CANONICAL_ACCREDITATIONS.map((accred) => {
                  const isChecked = formData.selectedAccreditations.includes(accred.name);
                  return (
                    <div
                      key={accred.name}
                      onClick={() => {
                        const updated = isChecked
                          ? formData.selectedAccreditations.filter((x) => x !== accred.name)
                          : [...formData.selectedAccreditations, accred.name];
                        setFormData({ ...formData, selectedAccreditations: updated });
                      }}
                      className={`p-3.5 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                        isChecked ? 'bg-emerald-50/70 border-emerald-400 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                        />
                        <div>
                          <span className={`text-[12px] block ${isChecked ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                            {accred.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">{accred.category}</span>
                        </div>
                      </div>

                      {isChecked && (
                        <div
                          className="mt-3 pt-3 border-t border-emerald-200/80 w-full space-y-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            <label className="block text-[10.5px] font-medium text-slate-800 mb-0.5">
                              {accred.identifierLabel} *
                            </label>
                            <input
                              type="text"
                              value={formData.accreditationNumbers[accred.name] || ''}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  accreditationNumbers: {
                                    ...formData.accreditationNumbers,
                                    [accred.name]: e.target.value,
                                  },
                                });
                              }}
                              placeholder={accred.placeholder}
                              className="w-full p-1.5 bg-white border border-emerald-300 rounded text-xs text-slate-900 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-medium text-slate-800 mb-0.5">
                              Certificate Expiry Date
                            </label>
                            <input
                              type="date"
                              value={formData.accreditationExpiries[accred.name] || ''}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  accreditationExpiries: {
                                    ...formData.accreditationExpiries,
                                    [accred.name]: e.target.value,
                                  },
                                });
                              }}
                              className="w-full p-1.5 bg-white border border-emerald-300 rounded text-xs text-slate-900 font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STAGE 09: HEALTH & SAFETY ─────────────────────────────────────── */}
          {currentStep === 9 && (
            <div className="space-y-6 text-xs font-sans">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Health &amp; Safety Governance &amp; Risk Controls</span>
                <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                  EntireFM operates uncompromising safety standards on commercial properties. Detail your H&amp;S policy, competent person, RAMS processes, and 3-year incident history.
                </p>
              </div>

              {/* H&S Policy & Competent Person */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-4">
                <span className="font-bold text-slate-900 block">Health &amp; Safety Policy &amp; Named Competent Person</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Written H&amp;S Policy in Place? *</label>
                    <select
                      value={formData.hasHsPolicy ? 'YES' : 'NO'}
                      onChange={(e) => setFormData({ ...formData, hasHsPolicy: e.target.value === 'YES' })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-bold"
                    >
                      <option value="YES">Yes — Policy in Place &amp; Active</option>
                      <option value="NO">No</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Policy Annual Review Date</label>
                    <input
                      type="date"
                      value={formData.hsPolicyReviewDate}
                      onChange={(e) => setFormData({ ...formData, hsPolicyReviewDate: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Competent Person Name *</label>
                    <input
                      type="text"
                      value={formData.competentPersonName}
                      onChange={(e) => setFormData({ ...formData, competentPersonName: e.target.value })}
                      placeholder="e.g. David Walker (CMIOSH)"
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Competent Person Role / Title</label>
                    <input
                      type="text"
                      value={formData.competentPersonRole}
                      onChange={(e) => setFormData({ ...formData, competentPersonRole: e.target.value })}
                      placeholder="e.g. Head of Compliance & Quality"
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Advisor Type</label>
                    <select
                      value={formData.competentPersonType}
                      onChange={(e) => setFormData({ ...formData, competentPersonType: e.target.value as any })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    >
                      <option value="INTERNAL">Directly Employed Internal H&S Lead</option>
                      <option value="EXTERNAL">Retained External H&S Consultancy (e.g. Citation / Peninsula)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RAMS & Method Statements */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <span className="font-bold text-slate-900 block">Task-Specific RAMS &amp; Risk Assessments</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasRams}
                      onChange={(e) => setFormData({ ...formData, hasRams: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span className="font-medium text-slate-800">Task-Specific RAMS Produced</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ramsProvidedPreAttendance}
                      onChange={(e) => setFormData({ ...formData, ramsProvidedPreAttendance: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span className="font-medium text-slate-800">RAMS Submitted Pre-Attendance</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ramsOperativesBriefed}
                      onChange={(e) => setFormData({ ...formData, ramsOperativesBriefed: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span className="font-medium text-slate-800">Operatives Briefed / Sign-On</span>
                  </label>
                </div>
              </div>

              {/* High Risk Activity Controls */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">High-Risk Activity Controls Managed by Supplier *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'WORKING_AT_HEIGHT', label: 'Working at Height (HSE WAHR 2005)' },
                    { id: 'HOT_WORKS', label: 'Hot Works Permits & Fire Watch' },
                    { id: 'CONFINED_SPACES', label: 'Confined Space Entry Procedures' },
                    { id: 'ELECTRICAL_LOTO', label: 'Electrical Safe Isolation & LOTO' },
                    { id: 'ASBESTOS', label: 'Asbestos Management & Disturbance Controls' },
                    { id: 'COSHH', label: 'COSHH Assessments & Chemical Safety' },
                    { id: 'LONE_WORKING', label: 'Lone Worker Monitoring Systems' },
                    { id: 'MANUAL_HANDLING', label: 'Ergonomic Manual Handling Assessments' },
                    { id: 'PERMIT_TO_WORK', label: 'Permit-to-Work Administration' },
                  ].map((ctrl) => {
                    const isChecked = formData.highRiskControls.includes(ctrl.id);
                    return (
                      <label
                        key={ctrl.id}
                        className={`p-2.5 border rounded cursor-pointer flex items-center gap-2 ${
                          isChecked ? 'bg-emerald-50 border-emerald-300 font-bold text-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const updated = isChecked
                              ? formData.highRiskControls.filter((c) => c !== ctrl.id)
                              : [...formData.highRiskControls, ctrl.id];
                            setFormData({ ...formData, highRiskControls: updated });
                          }}
                          className="rounded text-emerald-600"
                        />
                        <span>{ctrl.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3-Year Incident History */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">3-Year Incident &amp; Enforcement Record</span>
                    <p className="text-slate-500 font-light text-[11px]">
                      Disclose all incidents and notices during the previous 36 months across your entire company.
                    </p>
                  </div>
                  <select
                    value={formData.hasIncidentHistory ? 'YES' : 'NO'}
                    onChange={(e) => setFormData({ ...formData, hasIncidentHistory: e.target.value === 'YES' })}
                    className="p-1.5 border border-slate-200 rounded text-xs bg-white font-bold"
                  >
                    <option value="NO">Zero Incidents / Clean Record</option>
                    <option value="YES">Incidents to Disclose</option>
                  </select>
                </div>

                {formData.hasIncidentHistory && (
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10.5px] font-medium text-slate-700">RIDDOR Events</label>
                        <input
                          type="number"
                          value={formData.incidentRiddorCount}
                          onChange={(e) => setFormData({ ...formData, incidentRiddorCount: parseInt(e.target.value, 10) || 0 })}
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10.5px] font-medium text-slate-700">Lost Time (LTI)</label>
                        <input
                          type="number"
                          value={formData.incidentLtiCount}
                          onChange={(e) => setFormData({ ...formData, incidentLtiCount: parseInt(e.target.value, 10) || 0 })}
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10.5px] font-medium text-slate-700">Improvement Notices</label>
                        <input
                          type="number"
                          value={formData.incidentImprovementNoticesCount}
                          onChange={(e) => setFormData({ ...formData, incidentImprovementNoticesCount: parseInt(e.target.value, 10) || 0 })}
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10.5px] font-medium text-slate-700">Prohibition Notices</label>
                        <input
                          type="number"
                          value={formData.incidentProhibitionNoticesCount}
                          onChange={(e) => setFormData({ ...formData, incidentProhibitionNoticesCount: parseInt(e.target.value, 10) || 0 })}
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10.5px] font-medium text-slate-700">HSE Prosecutions</label>
                        <input
                          type="number"
                          value={formData.incidentProsecutionsCount}
                          onChange={(e) => setFormData({ ...formData, incidentProsecutionsCount: parseInt(e.target.value, 10) || 0 })}
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Incident Details &amp; Remediation Explanation *</label>
                      <textarea
                        rows={3}
                        value={formData.incidentDetails}
                        onChange={(e) => setFormData({ ...formData, incidentDetails: e.target.value })}
                        placeholder="Describe the nature of the incident(s), HSE findings, root-cause investigation, and corrective controls implemented..."
                        className="w-full p-2.5 border border-slate-200 rounded text-xs bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STAGE 10: GOVERNANCE & ETHICS ─────────────────────────────────── */}
          {currentStep === 10 && (
            <div className="space-y-6 text-xs font-sans">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Governance, Ethics &amp; Compliance Declarations</span>
                <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                  Confirm statutory policies across anti-bribery, modern slavery, equality, right-to-work checks, and business conduct declarations.
                </p>
              </div>

              {/* Ethics & Policies Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'antiBribery', title: 'Anti-Bribery & Corruption Policy', desc: 'Zero tolerance for bribery, gifts, hospitality inducements, or facilitation payments (Bribery Act 2010).' },
                  { key: 'modernSlavery', title: 'Modern Slavery & Labour Controls', desc: 'Strict elimination of forced labour and trafficking from business and supply chains (Modern Slavery Act 2015).' },
                  { key: 'equalityDiversityPolicy', title: 'Equality, Diversity & Inclusion Policy', desc: 'Fair, non-discriminatory employment and recruitment practices compliant with the Equality Act 2010.' },
                  { key: 'rightToWorkChecks', title: 'Right-to-Work UK Verification', desc: 'Formal statutory right-to-work verification undertaken for all employees and subcontracted personnel.' },
                  { key: 'whistleblowingProcedure', title: 'Whistleblowing & Speak-Up Channel', desc: 'Confidential channel for workers to report safety or ethical violations without fear of reprisal.' },
                  { key: 'conflictsInterestControls', title: 'Conflict of Interest Controls', desc: 'Established procedure for declaring and managing potential conflicts of interest with clients.' },
                ].map((policy) => (
                  <label
                    key={policy.key}
                    className={`p-3.5 border rounded cursor-pointer flex items-start gap-3 transition-colors ${
                      (formData as any)[policy.key] ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(formData as any)[policy.key]}
                      onChange={(e) => setFormData({ ...formData, [policy.key]: e.target.checked })}
                      className="mt-0.5 rounded text-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{policy.title}</span>
                      <span className="text-[11px] text-slate-500">{policy.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Criminal & Regulatory Disclosures */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <span className="font-bold text-slate-900 block">Criminal, Regulatory &amp; Financial Disclosures</span>
                <p className="text-slate-500 font-light text-[11px]">
                  Disclose whether the company, parent company, or any current director has been subject to material criminal convictions, fraud, or regulatory disqualifications.
                </p>

                <div className="space-y-2">
                  {[
                    { key: 'disclosureCriminalConvictions', label: 'Material criminal convictions relating to commercial conduct or safety' },
                    { key: 'disclosureFraudConvictions', label: 'Convictions for fraud, dishonesty, or financial misconduct' },
                    { key: 'disclosureBriberyConvictions', label: 'Convictions or settlements regarding bribery or corruption' },
                    { key: 'disclosureRegulatoryEnforcement', label: 'Significant environmental or statutory regulatory enforcement notices' },
                    { key: 'disclosureInsolvencyDisqualification', label: 'Insolvency, bankruptcy, or director disqualification within past 5 years' },
                  ].map((disc) => (
                    <label key={disc.key} className="flex items-center gap-2 text-xs text-slate-800">
                      <input
                        type="checkbox"
                        checked={(formData as any)[disc.key]}
                        onChange={(e) => setFormData({ ...formData, [disc.key]: e.target.checked })}
                        className="rounded text-rose-600"
                      />
                      <span>{disc.label}</span>
                    </label>
                  ))}
                </div>

                {(formData.disclosureCriminalConvictions ||
                  formData.disclosureFraudConvictions ||
                  formData.disclosureBriberyConvictions ||
                  formData.disclosureRegulatoryEnforcement ||
                  formData.disclosureInsolvencyDisqualification) && (
                  <div className="space-y-1 pt-2">
                    <label className="font-bold text-slate-900">Disclosure Details &amp; Mitigation *</label>
                    <textarea
                      rows={3}
                      value={formData.disclosureDetails}
                      onChange={(e) => setFormData({ ...formData, disclosureDetails: e.target.value })}
                      placeholder="Detail the circumstances, dates, resolutions, and current compliance standing..."
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Sanctions Confirmation */}
              <label className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sanctionsConfirmed}
                  onChange={(e) => setFormData({ ...formData, sanctionsConfirmed: e.target.checked })}
                  className="mt-0.5 rounded text-emerald-600"
                />
                <div className="text-[11px] text-slate-700 leading-relaxed">
                  <strong>UK &amp; International Sanctions Confirmation:</strong> We confirm that neither our company,
                  its owners, nor its directors are subject to UK, EU, or international financial sanctions, and we agree
                  to notify EntireFM immediately in the event of any material change.
                </div>
              </label>
            </div>
          )}

          {/* ── STAGE 11: INFORMATION SECURITY ───────────────────────────────── */}
          {currentStep === 11 && (
            <div className="space-y-6 text-xs font-sans">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Information Security &amp; Data Protection</span>
                <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                  Suppliers handling client asset data, building layouts, or digital portals must demonstrate proportionate cyber resilience and GDPR compliance.
                </p>
              </div>

              {/* Governance & Certifications */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-4">
                <span className="font-bold text-slate-900 block">Information Security Governance &amp; Certifications</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Cyber Certifications Held</label>
                    <select
                      value={formData.cyberCertifications[0] || 'NONE'}
                      onChange={(e) => setFormData({ ...formData, cyberCertifications: [e.target.value] })}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-bold"
                    >
                      <option value="CYBER_ESSENTIALS">Cyber Essentials Certified</option>
                      <option value="CYBER_ESSENTIALS_PLUS">Cyber Essentials Plus</option>
                      <option value="ISO_27001">ISO 27001 Certified</option>
                      <option value="OTHER">Other Industry Cyber Standard</option>
                      <option value="NONE">None / In Progress</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Certificate Reference Number</label>
                    <input
                      type="text"
                      value={formData.cyberCertNumber}
                      onChange={(e) => setFormData({ ...formData, cyberCertNumber: e.target.value })}
                      placeholder="e.g. CE-2026-992144"
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Named Data Protection Contact</label>
                    <input
                      type="text"
                      value={formData.dpoContactName}
                      onChange={(e) => setFormData({ ...formData, dpoContactName: e.target.value })}
                      placeholder="e.g. James Roberts (DPO)"
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Controls Multi-Select */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Technical Security Controls in Place *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'MFA', label: 'MFA Enforced on Critical Systems' },
                    { id: 'ENDPOINT_PROTECTION', label: 'Managed Antivirus / EDR on Endpoints' },
                    { id: 'DEVICE_ENCRYPTION', label: 'Full Disk Device Encryption (BitLocker/FileVault)' },
                    { id: 'OFFSITE_BACKUPS', label: 'Automated Immutable Daily Backups' },
                    { id: 'STAFF_TRAINING', label: 'Regular Cyber Security Staff Training' },
                    { id: 'ROLE_BASED_ACCESS', label: 'Role-Based Principle of Least Privilege' },
                    { id: 'LEAVER_REVOCATION', label: 'Same-Day Leaver Access Revocation' },
                    { id: 'INCIDENT_PLAN', label: 'Documented Incident Response Plan' },
                    { id: 'AUTO_PATCHING', label: 'Automated OS & Vulnerability Patching' },
                  ].map((ctrl) => {
                    const isChecked = formData.cyberControls.includes(ctrl.id);
                    return (
                      <label
                        key={ctrl.id}
                        className={`p-2.5 border rounded cursor-pointer flex items-center gap-2 ${
                          isChecked ? 'bg-emerald-50 border-emerald-300 font-bold text-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const updated = isChecked
                              ? formData.cyberControls.filter((c) => c !== ctrl.id)
                              : [...formData.cyberControls, ctrl.id];
                            setFormData({ ...formData, cyberControls: updated });
                          }}
                          className="rounded text-emerald-600"
                        />
                        <span className="text-[11px]">{ctrl.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3-Year Cyber Breach Disclosure */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">3-Year Material Cyber Security / Personal Data Breach Record</span>
                  <select
                    value={formData.cyberBreachPast3yr ? 'YES' : 'NO'}
                    onChange={(e) => setFormData({ ...formData, cyberBreachPast3yr: e.target.value === 'YES' })}
                    className="p-1.5 border border-slate-200 rounded text-xs bg-white font-bold"
                  >
                    <option value="NO">No Breaches Experienced</option>
                    <option value="YES">Breach to Disclose</option>
                  </select>
                </div>

                {formData.cyberBreachPast3yr && (
                  <div className="space-y-1 pt-2">
                    <label className="font-bold text-slate-700">Breach Summary &amp; Corrective Measures *</label>
                    <textarea
                      rows={3}
                      value={formData.cyberBreachDetails}
                      onChange={(e) => setFormData({ ...formData, cyberBreachDetails: e.target.value })}
                      placeholder="Describe the nature of the breach, affected systems, ICO notifications if applicable, and technical remediation..."
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STAGE 12: DOCUMENT VAULT ──────────────────────────────────────── */}
          {currentStep === 12 && (
            <div className="space-y-6 text-xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Supplier Document Vault</span>
                  <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                    Upload your insurance schedules, H&amp;S policy, trade accreditations, and company credentials. All uploads are encrypted and stored in your vault.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 shrink-0">
                  {documents.length} Uploaded
                </span>
              </div>

              {/* Dynamic Suggested Document Slots */}
              <div className="space-y-3">
                <span className="font-bold text-slate-800 block text-xs">Required &amp; Recommended Schedules</span>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded overflow-hidden">
                  {[
                    { type: 'Public Liability Insurance Schedule', category: 'MANDATORY' as const, required: true },
                    { type: 'Employers Liability Insurance Schedule', category: 'MANDATORY' as const, required: true },
                    ...(formData.piApplicable
                      ? [{ type: 'Professional Indemnity Insurance Schedule', category: 'MANDATORY' as const, required: true }]
                      : []),
                    { type: 'Written Health & Safety Policy', category: 'POLICY' as const, required: true },
                    ...formData.selectedAccreditations.map((acc) => ({
                      type: `${acc} Certificate`,
                      category: 'ACCREDITATION' as const,
                      required: true,
                    })),
                    { type: 'Sample Task-Specific RAMS', category: 'SUPPORTING' as const, required: false },
                    { type: 'Employee Training Matrix', category: 'SUPPORTING' as const, required: false },
                    { type: 'Company Registration / VAT Certificate', category: 'SUPPORTING' as const, required: false },
                  ].map((item) => {
                    const uploadedDoc = documents.find((d) => d.documentType === item.type);
                    const isUploading = uploadingDocType === item.type;

                    return (
                      <div key={item.type} className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded ${uploadedDoc ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{item.type}</span>
                              {item.required ? (
                                <span className="text-[9.5px] font-mono px-1.5 py-0.2 bg-rose-100 text-rose-800 font-bold rounded">
                                  REQUIRED
                                </span>
                              ) : (
                                <span className="text-[9.5px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                                  OPTIONAL
                                </span>
                              )}
                            </div>
                            {uploadedDoc ? (
                              <div className="flex items-center gap-3 text-[10.5px] text-slate-500 mt-0.5">
                                <span className="text-emerald-700 font-medium">✓ {uploadedDoc.fileName}</span>
                                <span>&bull;</span>
                                <span>Uploaded: {uploadedDoc.uploadedAt.slice(0, 10)}</span>
                                {uploadedDoc.expiryDate && (
                                  <>
                                    <span>&bull;</span>
                                    <span>Exp: {uploadedDoc.expiryDate}</span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10.5px] text-slate-400">Not yet uploaded</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {uploadedDoc ? (
                            <button
                              onClick={() => handleDeleteDocument(uploadedDoc.id)}
                              className="text-rose-600 hover:text-rose-800 p-1.5 text-xs font-bold flex items-center gap-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Remove
                            </button>
                          ) : (
                            <button
                              disabled={isUploading}
                              onClick={() => handleDocumentUpload(item.type, item.category)}
                              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
                            >
                              {isUploading ? (
                                <>
                                  <div className="h-3 w-3 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Attach File</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Supporting Document */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <span className="font-bold text-slate-900 block">Attach Custom Supporting File</span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Document Title (e.g. ISO 14001 Certificate / Organization Chart)"
                    value={customDocName}
                    onChange={(e) => setCustomDocName(e.target.value)}
                    className="flex-1 p-2 border border-slate-200 rounded text-xs bg-white"
                  />
                  <select
                    value={customDocCategory}
                    onChange={(e) => setCustomDocCategory(e.target.value as any)}
                    className="p-2 border border-slate-200 rounded text-xs bg-white"
                  >
                    <option value="SUPPORTING">Supporting Document</option>
                    <option value="ACCREDITATION">Trade Accreditation</option>
                    <option value="POLICY">Corporate Policy</option>
                  </select>
                  <button
                    disabled={!customDocName}
                    onClick={() => {
                      if (customDocName) {
                        handleDocumentUpload(customDocName, customDocCategory);
                        setCustomDocName('');
                      }
                    }}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1 font-bold disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload File
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STAGE 13: COMMERCIAL INFORMATION ─────────────────────────────── */}
          {currentStep === 13 && (
            <div className="space-y-6 text-xs font-sans">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Commercial Profile &amp; Turnover Scale</span>
                <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                  Indicate your commercial operating scale, largest supported contract size, and accounts payable instructions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Annual Company Turnover Band *</label>
                  <select
                    value={formData.turnoverBand}
                    onChange={(e) => setFormData({ ...formData, turnoverBand: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  >
                    <option value="Under £250k">Under £250k</option>
                    <option value="£250k–£500k">£250k – £500k</option>
                    <option value="£500k–£1m">£500k – £1,000,000</option>
                    <option value="£1m–£2m">£1,000,000 – £2,000,000</option>
                    <option value="£2m–£5m">£2,000,000 – £5,000,000</option>
                    <option value="£5m–£10m">£5,000,000 – £10,000,000</option>
                    <option value="£10m–£25m">£10,000,000 – £25,000,000</option>
                    <option value="£25m+">£25,000,000+</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Largest Annual Client Contract Supported *</label>
                  <select
                    value={formData.largestContractBand}
                    onChange={(e) => setFormData({ ...formData, largestContractBand: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  >
                    <option value="Under £25k">Under £25k / Ad-hoc reactive</option>
                    <option value="£25k–£50k">£25k – £50k annual maintenance</option>
                    <option value="£50k–£100k">£50k – £100k contract</option>
                    <option value="£100k–£250k">£100k – £250k contract</option>
                    <option value="£250k–£500k">£250k – £500k contract</option>
                    <option value="£500k–£1m+">£500k – £1,000,000+ national portfolio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Maximum Comfortable Mobilisation Scale</label>
                  <select
                    value={formData.maxMobilisationSize}
                    onChange={(e) => setFormData({ ...formData, maxMobilisationSize: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  >
                    <option value="1-5 Sites">1 - 5 Local Commercial Properties</option>
                    <option value="5-20 Sites">5 - 20 Sites Regional Cluster</option>
                    <option value="20-100 Sites">20 - 100 Sites Multi-Region</option>
                    <option value="100+ Sites">100+ Sites National Portfolio</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Accounts Payable Remittance Email</label>
                  <input
                    type="email"
                    value={formData.accountsPayableEmail}
                    onChange={(e) => setFormData({ ...formData, accountsPayableEmail: e.target.value })}
                    placeholder="accounts@company.co.uk"
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>

              {/* Security Caveat on Bank Details */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-700" />
                  <span className="font-bold text-slate-900">BACS Payment Settlement &amp; Bank Security Policy</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  In accordance with EntireFM financial fraud prevention and anti-phishing controls, official bank remittance
                  details are <strong>never collected over unverified web forms</strong> during initial application. Following
                  technical assurance approval, our finance director conducts a verbal telephone confirmation with your designated
                  financial officer before configuring BACS payment schedules against approved purchase orders.
                </p>
              </div>
            </div>
          )}

          {/* ── STAGE 14: DECLARATIONS & SUPPLIER CODE OF CONDUCT ──────────────── */}
          {currentStep === 14 && (
            <div className="space-y-6 text-xs font-sans">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Formal Declarations &amp; Supplier Code of Conduct</span>
                <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                  Carefully review the EntireFM Supplier Code of Conduct (v2026.1) and confirm your organization’s agreement to our commercial framework.
                </p>
              </div>

              {/* Code of Conduct Embedded Reader Banner */}
              <div className="p-5 bg-slate-900 text-white rounded-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-pink font-bold">
                      MANDATORY GOVERNANCE FRAMEWORK
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      EntireFM Supplier Code of Conduct (v{formData.codeOfConductVersion})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCodeOfConductModal(true)}
                    className="btn-primary text-xs py-1.5 px-4 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Eye className="h-3.5 w-3.5" /> Read Full Code of Conduct (10 Sections)
                  </button>
                </div>
                <p className="text-slate-300 text-[11.5px] leading-relaxed">
                  The Supplier Code of Conduct establishes non-negotiable requirements for safe site working, RAMS compliance,
                  workforce qualification verification, zero fraud tolerance, anti-bribery, modern slavery elimination, and digital
                  worksheet submission via EntireCAFM.
                </p>
              </div>

              {/* Declarations Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.codeOfConduct}
                    onChange={(e) => setFormData({ ...formData, codeOfConduct: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      1. EntireFM Supplier Code of Conduct (v2026.1) Acceptance *
                    </span>
                    <span className="text-[11px] text-slate-500">
                      We have read, understood, and formally agree to adhere to all terms set out in the EntireFM Supplier
                      Code of Conduct across all work orders and client interactions.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.truthfulnessDeclaration}
                    onChange={(e) => setFormData({ ...formData, truthfulnessDeclaration: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      2. Accuracy &amp; Truthfulness of Information *
                    </span>
                    <span className="text-[11px] text-slate-500">
                      We certify under penalty of contract termination that all information, insurance details,
                      qualifications, incident histories, and declarations submitted in this application are genuine and accurate.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.declarationAuthorityAccepted}
                    onChange={(e) => setFormData({ ...formData, declarationAuthorityAccepted: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      3. Authority to Submit on Behalf of Organisation *
                    </span>
                    <span className="text-[11px] text-slate-500">
                      I warrant that I am a duly authorised officer, director, or commercial manager with full legal authority
                      to bind the applying organisation.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.declarationVerificationAccepted}
                    onChange={(e) => setFormData({ ...formData, declarationVerificationAccepted: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      4. Verification Consent &amp; Duty to Notify *
                    </span>
                    <span className="text-[11px] text-slate-500">
                      We authorise EntireFM to verify submitted certifications with accreditation bodies, and we commit to
                      notifying EntireFM within 5 business days of any material change in insurance or regulatory status.
                    </span>
                  </div>
                </label>
              </div>

              {/* Declarant Sign-off Audit Details */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <span className="font-bold text-slate-900 block">Declarant Sign-Off (Audit Record)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Full Name of Declaring Officer *</label>
                    <input
                      type="text"
                      value={formData.declarantName}
                      onChange={(e) => setFormData({ ...formData, declarantName: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Position / Job Title *</label>
                    <input
                      type="text"
                      value={formData.declarantRole}
                      onChange={(e) => setFormData({ ...formData, declarantRole: e.target.value })}
                      placeholder="e.g. Managing Director"
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STAGE 15: REVIEW & SUBMIT ─────────────────────────────────────── */}
          {currentStep === 15 && (
            <div className="space-y-6 text-xs font-sans">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Application Summary &amp; Submission</span>
                <p className="text-slate-500 font-light text-[11.5px] mt-0.5">
                  Review your application summary across all 14 substantive sections before submitting for technical assurance review.
                </p>
              </div>

              {/* Section-by-Section Validation Breakdown */}
              <div className="divide-y divide-slate-200 border border-slate-200 rounded overflow-hidden">
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">1. Company Profile</span>
                    <span className="text-slate-500 text-[11px]">
                      {formData.legalCompanyName} ({formData.companyNumber || 'No Co Reg'}) &bull; {formData.businessType}
                    </span>
                  </div>
                  {sectionCompleteness.company ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(1)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">2. Contacts &amp; Roles</span>
                    <span className="text-slate-500 text-[11px]">
                      Commercial: {formData.primaryContactName || '—'} &bull; Ops: {formData.opsContactName || '—'}
                    </span>
                  </div>
                  {sectionCompleteness.contacts ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(2)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">3. Services &amp; Trades</span>
                    <span className="text-slate-500 text-[11px]">
                      {formData.selectedServices.length > 0 ? `${formData.selectedServices.length} disciplines declared` : 'None selected'}
                    </span>
                  </div>
                  {sectionCompleteness.services ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(3)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">4. Coverage &amp; Operating Bases</span>
                    <span className="text-slate-500 text-[11px]">
                      {formData.coverageType} &bull; {formData.selectedRegions.length} Regions
                    </span>
                  </div>
                  {sectionCompleteness.coverage ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(4)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">5. Operational Capability &amp; SLA</span>
                    <span className="text-slate-500 text-[11px]">
                      {formData.has247 ? `24/7 Emergency (${formData.emergencySlaHours}h SLA)` : 'Standard Hours Only'}
                    </span>
                  </div>
                  {sectionCompleteness.operations ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(5)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">6. Workforce &amp; Subcontractors</span>
                    <span className="text-slate-500 text-[11px]">
                      Direct: {formData.directEngineers || '0'} engineers &bull; Subcontracting: {formData.hasSubcontractors ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {sectionCompleteness.workforce ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(6)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">7. Insurance Schedules</span>
                    <span className="text-slate-500 text-[11px]">
                      PL: {formData.plCoverLimit || '—'} ({formData.plInsurer || 'No Insurer'})
                    </span>
                  </div>
                  {sectionCompleteness.insurance ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(7)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">8. Accreditations &amp; SSIP</span>
                    <span className="text-slate-500 text-[11px]">
                      {formData.selectedAccreditations.length} Accreditations Declared
                    </span>
                  </div>
                  {sectionCompleteness.accreditations ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(8)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">9. Health &amp; Safety</span>
                    <span className="text-slate-500 text-[11px]">
                      Policy: {formData.hasHsPolicy ? 'Yes' : 'No'} &bull; RAMS: {formData.hasRams ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {sectionCompleteness.health_safety ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(9)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">10. Governance &amp; Ethics</span>
                    <span className="text-slate-500 text-[11px]">
                      Anti-Bribery: {formData.antiBribery ? 'Accepted' : 'Pending'} &bull; Modern Slavery: {formData.modernSlavery ? 'Accepted' : 'Pending'}
                    </span>
                  </div>
                  {sectionCompleteness.governance ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(10)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">11. Information Security &amp; Data</span>
                    <span className="text-slate-500 text-[11px]">
                      GDPR &amp; Security Controls Registered
                    </span>
                  </div>
                  {sectionCompleteness.security ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(11)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">12. Document Vault</span>
                    <span className="text-slate-500 text-[11px]">
                      {documents.length} Evidence Documents Uploaded
                    </span>
                  </div>
                  {sectionCompleteness.documents ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(12)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">13. Commercial Information</span>
                    <span className="text-slate-500 text-[11px]">
                      Bank Details &amp; CIS Status Registered
                    </span>
                  </div>
                  {sectionCompleteness.commercial ? (
                    <span className="text-emerald-700 font-bold text-[10.5px]">COMPLETE</span>
                  ) : (
                    <button onClick={() => setCurrentStep(13)} className="text-amber-700 font-bold text-[10.5px] hover:underline">
                      INCOMPLETE (Fix)
                    </button>
                  )}
                </div>
              </div>

              {/* Submission Notice & Declaration Confirmation */}
              <div className="bg-[#FAF9FB] border border-slate-300 rounded-sm p-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <span>Technical Assurance Submission Notice</span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  By clicking <strong>Submit Application for Review</strong>, your application will be formally submitted to the EntireFM Supplier Management team for technical due diligence, insurance validation, and trade qualification review.
                </p>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-950 text-[11px] leading-relaxed">
                  <strong>Independent Due Diligence:</strong> All submissions undergo thorough review against statutory regulations and client requirements. You will be notified in your portal once your technical review is complete.
                </div>
              </div>

              {saveError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{saveError}</span>
                </div>
              )}
            </div>
          )}

          {/* ── Navigation Controls ────────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1 || isSaving}
              className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>

            {currentStep < 15 ? (
              <button
                onClick={handleNext}
                disabled={isSaving}
                className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 font-bold"
              >
                {isSaving ? 'Saving...' : `Continue to Step ${currentStep + 1}`}{' '}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="btn-primary text-xs py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application for Review</span>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── EntireFM Supplier Code of Conduct (v2026.1) Modal Reader ──────── */}
      {showCodeOfConductModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-pink font-bold">
                  GOVERNANCE STANDARD
                </span>
                <h2 className="text-lg font-bold mt-0.5">EntireFM Supplier Code of Conduct (v2026.1)</h2>
              </div>
              <button
                onClick={() => setShowCodeOfConductModal(false)}
                className="text-slate-300 hover:text-white p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-[11.5px] text-slate-800">
                This document governs all suppliers, trade contractors, specialist service providers, and technology
                partners appointed to deliver works on client properties managed by EntireFM.
              </div>

              {SUPPLIER_CODE_OF_CONDUCT_V2026_1.map((sec, idx) => (
                <div key={idx} className="space-y-2 border-b border-slate-100 pb-4 last:border-b-0">
                  <h3 className="font-bold text-slate-900 text-[13px]">{sec.title}</h3>
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-600 text-[11.5px]">
                    {sec.points.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <Link
                href="/legal/supplier-code"
                target="_blank"
                className="text-brand-pink font-bold text-xs hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" /> View on Legal Portal
              </Link>
              <button
                onClick={() => {
                  setFormData({ ...formData, codeOfConduct: true });
                  setShowCodeOfConductModal(false);
                }}
                className="btn-primary text-xs py-2 px-5 font-bold"
              >
                Accept Code of Conduct &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
