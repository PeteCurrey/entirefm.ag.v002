/**
 * ENTIREFM CPD & TRAINING STORE — DATABASE-BACKED
 * =================================================
 * Tracks authentic professional development hours earned through
 * technical research, live room participation, and verified learning.
 */

import { CpdLogEntry, MemberCpdSummary, ExternalTrainingProvider, CpdActivityType } from './types';
import { dbQuery } from '@/server/db/client';

export const RECOMMENDED_TRAINING_PROVIDERS: ExternalTrainingProvider[] = [
  {
    id: 'iwfm-academy',
    name: 'IWFM Academy',
    shortName: 'IWFM',
    accreditationBody: 'Institute of Workplace and Facilities Management',
    logoText: 'IWFM',
    description:
      'The UK chartered body for workplace and facilities management, offering regulated qualification pathways from Level 2 through Level 6 qualifications.',
    disciplines: ['Estate Strategy', 'Contract Management', 'FM Leadership', 'Workplace Experience'],
    officialPortalUrl: 'https://www.iwfm.org.uk/professional-development/academy.html',
    statusBadge: 'Regulated Awarding Body',
    courseHighlights: [
      {
        title: 'IWFM Level 4 Diploma in Facilities Management',
        level: 'Level 4 (Undergraduate equivalent)',
        duration: '12–18 Months',
        format: 'Hybrid / Distance Learning',
        officialUrl: 'https://www.iwfm.org.uk/qualifications/level-4.html',
      },
      {
        title: 'Managing FM Contracts & SLA Negotiation',
        level: 'Practitioner Masterclass',
        duration: '2 Days CPD',
        format: 'Live Virtual Classroom',
        officialUrl: 'https://www.iwfm.org.uk/professional-development/academy.html',
      },
    ],
  },
  {
    id: 'cibse-training',
    name: 'CIBSE Training & Building Services Academy',
    shortName: 'CIBSE',
    accreditationBody: 'Chartered Institution of Building Services Engineers',
    logoText: 'CIBSE',
    description:
      'Specialist engineering CPD and qualifications covering electrical systems, HVAC plant, low-carbon building design, and statutory building services engineering.',
    disciplines: ['HVAC & Refrigeration', 'Electrical Distribution', 'Building Safety Act', 'Energy Decarbonisation'],
    officialPortalUrl: 'https://www.cibse.org/training',
    statusBadge: 'Engineering Council Licensed',
    courseHighlights: [
      {
        title: 'Building Safety Act: The Golden Thread for Engineers',
        level: 'Statutory Compliance Briefing',
        duration: '1 Day (7 Hours CPD)',
        format: 'Live Online / In-Person (London)',
        officialUrl: 'https://www.cibse.org/training',
      },
      {
        title: 'Electrical Distribution in Commercial Buildings',
        level: 'Senior Technical',
        duration: '2 Days (14 Hours CPD)',
        format: 'In-Person Workshop',
        officialUrl: 'https://www.cibse.org/training',
      },
    ],
  },
  {
    id: 'nebosh-health-safety',
    name: 'NEBOSH Environmental & Safety Courses',
    shortName: 'NEBOSH',
    accreditationBody: 'National Examination Board in Occupational Safety and Health',
    logoText: 'NEBOSH',
    description:
      'Globally recognised health, safety, environmental, and risk management qualifications essential for duty holders and estates managers.',
    disciplines: ['Statutory Health & Safety', 'Fire Risk Assessment', 'Environmental Management'],
    officialPortalUrl: 'https://www.nebosh.org.uk/qualifications',
    statusBadge: 'Statutory Benchmark',
    courseHighlights: [
      {
        title: 'NEBOSH National General Certificate in Occupational Health and Safety',
        level: 'Level 3 (Gold Standard)',
        duration: '10 Days / Self-Paced',
        format: 'Online & Exam Centre',
        officialUrl: 'https://www.nebosh.org.uk/qualifications/national-general-certificate',
      },
      {
        title: 'NEBOSH Certificate in Fire Safety',
        level: 'Level 3 Specialist',
        duration: '5 Days + Practical Assessment',
        format: 'Virtual Classroom',
        officialUrl: 'https://www.nebosh.org.uk/qualifications/certificate-in-fire-safety',
      },
    ],
  },
  {
    id: 'besa-academy',
    name: 'BESA Academy',
    shortName: 'BESA',
    accreditationBody: 'Building Engineering Services Association',
    logoText: 'BESA',
    description:
      'Technical trade competency accreditation, F-Gas compliance, ventilation hygiene (TR19), and building services maintenance.',
    disciplines: ['F-Gas Compliance', 'Ductwork & TR19 Hygiene', 'Combustion & Gas Safety'],
    officialPortalUrl: 'https://www.thebesa.com/academy',
    statusBadge: 'Trade Association Standard',
    courseHighlights: [
      {
        title: 'TR19 Air: Internal Cleanliness of Ventilation Systems',
        level: 'Competency Certificate',
        duration: '1 Day (6 Hours CPD)',
        format: 'Online Module + Practical',
        officialUrl: 'https://www.thebesa.com/academy',
      },
      {
        title: 'F-Gas Cat 1 Refrigerant Handling Renewal',
        level: 'Statutory Certification',
        duration: '2 Days Practical Assessment',
        format: 'Accredited Test Centre',
        officialUrl: 'https://www.thebesa.com/academy',
      },
    ],
  },
];

/**
 * Log authentic CPD activity for a member and update cached total.
 */
export async function logCpdActivity(params: {
  memberId: string;
  activityType: CpdActivityType;
  title: string;
  description?: string;
  durationMinutes: number;
  sourceRef?: string;
}): Promise<CpdLogEntry> {
  const id = `cpd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const row = {
    id,
    member_id: params.memberId,
    activity_type: params.activityType,
    title: params.title.trim(),
    description: params.description?.trim() || null,
    duration_minutes: params.durationMinutes,
    source_ref: params.sourceRef || null,
    logged_at: now,
  };

  await dbQuery('lobby_member_cpd_logs', {
    method: 'POST',
    body: row,
  });

  // Calculate new total hours and update lobby_members table
  const summary = await getMemberCpdSummary(params.memberId);
  await dbQuery(`lobby_members?id=eq.${encodeURIComponent(params.memberId)}`, {
    method: 'PATCH',
    body: { cpd_hours_logged: summary.totalHours, updated_at: now },
  });

  return {
    id,
    memberId: params.memberId,
    activityType: params.activityType,
    title: row.title,
    description: row.description || undefined,
    durationMinutes: row.duration_minutes,
    sourceRef: row.source_ref || undefined,
    loggedAt: now,
  };
}

/**
 * Retrieve full CPD activity summary for a member.
 */
export async function getMemberCpdSummary(memberId: string): Promise<MemberCpdSummary> {
  const { data } = await dbQuery<any[]>(
    `lobby_member_cpd_logs?member_id=eq.${encodeURIComponent(memberId)}&order=logged_at.desc`
  );

  if (!data || data.length === 0) {
    return {
      memberId,
      totalHours: 0,
      totalMinutes: 0,
      activitiesCount: 0,
      entries: [],
    };
  }

  const entries: CpdLogEntry[] = data.map((r) => ({
    id: r.id,
    memberId: r.member_id,
    activityType: r.activity_type,
    title: r.title,
    description: r.description,
    durationMinutes: Number(r.duration_minutes || 0),
    sourceRef: r.source_ref,
    loggedAt: r.logged_at,
  }));

  const totalMinutes = entries.reduce((sum, e) => sum + e.durationMinutes, 0);
  const totalHours = Number((totalMinutes / 60).toFixed(1));

  return {
    memberId,
    totalHours,
    totalMinutes,
    activitiesCount: entries.length,
    entries,
  };
}
