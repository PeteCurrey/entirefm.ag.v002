'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReportShell from './ReportShell';
import ReactiveJobForm from './pilots/ReactiveJobForm';
import WeeklyFireAlarmForm from './pilots/WeeklyFireAlarmForm';
import EmergencyLightingScheduleForm from './pilots/EmergencyLightingScheduleForm';
import type { FullReportPack, SignatureType } from '@/server/field-reports/types';

interface Props {
  initialPack: FullReportPack;
  isReadOnly?: boolean;
}

export default function ReportViewerClient({ initialPack, isReadOnly }: Props) {
  const router = useRouter();
  const [pack, setPack] = useState<FullReportPack>(initialPack);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [autosaveState, setAutosaveState] = useState<'SAVING' | 'SAVED' | 'ERROR'>('SAVED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = pack.templateVersion.schema_json.sections || [];
  const totalSections = sections.length || 6;
  const completedSections = Math.min(
    totalSections,
    Object.keys(pack.responses).length + (pack.signatures.ENGINEER ? 1 : 0) + (Object.keys(pack.repeatableRows).length > 0 ? 1 : 0)
  );

  const handleAutosave = async (payload: {
    responses: Array<{ section_key: string; field_key: string; value: any }>;
    repeatableRows?: Record<string, any[]>;
  }) => {
    setAutosaveState('SAVING');
    try {
      const res = await fetch(`/api/field/reports/${pack.instance.id}/autosave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setAutosaveState('SAVED');
      } else {
        setAutosaveState('ERROR');
      }
    } catch {
      setAutosaveState('ERROR');
    }
  };

  const handleSign = async (sig: {
    signatureType: SignatureType;
    signatoryName: string;
    signatoryPosition?: string;
    signatureDataUrl?: string;
    declarationText?: string;
  }) => {
    try {
      const res = await fetch(`/api/field/reports/${pack.instance.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sig),
      });
      if (res.ok) {
        const json = await res.json();
        setPack((prev) => ({
          ...prev,
          signatures: {
            ...prev.signatures,
            [sig.signatureType]: json.signature,
          },
        }));
      }
    } catch (err) {
      console.error('Sign error', err);
    }
  };

  const handleSubmitReport = async () => {
    if (!pack.signatures.ENGINEER) {
      alert('Please complete and sign the Engineer Declaration before issuing the report.');
      return;
    }

    if (!confirm('Are you ready to submit and issue this controlled report? An immutable Rev 4.0 PDF will be generated.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/field/reports/${pack.instance.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoIssue: true }),
      });

      const json = await res.json();
      if (json.success) {
        router.refresh();
        alert(`Report ${pack.instance.report_number} successfully issued!`);
      } else {
        alert(`Submission failed: ${json.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReportShell
      pack={pack}
      activeSectionIndex={activeSectionIndex}
      totalSections={totalSections}
      completedSections={completedSections}
      autosaveState={autosaveState}
      onSelectSection={setActiveSectionIndex}
      onSubmitReport={handleSubmitReport}
      isSubmitting={isSubmitting}
    >
      {pack.template.template_code === 'ENT-RJR-01' && (
        <ReactiveJobForm
          pack={pack}
          onAutosave={handleAutosave}
          onSign={handleSign}
          isReadOnly={isReadOnly || pack.instance.status === 'ISSUED'}
        />
      )}

      {pack.template.template_code === 'ENT-PPM-01' && (
        <WeeklyFireAlarmForm
          pack={pack}
          onAutosave={handleAutosave}
          onSign={handleSign}
          isReadOnly={isReadOnly || pack.instance.status === 'ISSUED'}
        />
      )}

      {pack.template.template_code === 'ENT-FLS-EL' && (
        <EmergencyLightingScheduleForm
          pack={pack}
          onAutosave={handleAutosave}
          onSign={handleSign}
          isReadOnly={isReadOnly || pack.instance.status === 'ISSUED'}
        />
      )}
    </ReportShell>
  );
}
