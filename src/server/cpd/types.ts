/**
 * ENTIREFM CPD & PROFESSIONAL DEVELOPMENT DATA MODELS
 * =====================================================
 */

export type CpdActivityType =
  | 'ask_research'
  | 'live_room'
  | 'lobby_daily_read'
  | 'community_challenge'
  | 'external_course';

export interface CpdLogEntry {
  id: string;
  memberId: string;
  activityType: CpdActivityType;
  title: string;
  description?: string;
  durationMinutes: number;
  sourceRef?: string;
  loggedAt: string;
}

export interface MemberCpdSummary {
  memberId: string;
  totalHours: number;
  totalMinutes: number;
  activitiesCount: number;
  entries: CpdLogEntry[];
}

export interface ExternalTrainingProvider {
  id: string;
  name: string;
  shortName: string;
  accreditationBody: string;
  logoText: string;
  description: string;
  disciplines: string[];
  courseHighlights: {
    title: string;
    level: string;
    duration: string;
    format: string;
    officialUrl: string;
  }[];
  officialPortalUrl: string;
  statusBadge: string;
}
