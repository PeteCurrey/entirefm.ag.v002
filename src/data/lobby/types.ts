/**
 * THE LOBBY DATA TYPES
 * ====================
 * Type definitions for The Lobby editorial franchises, interactive modules,
 * professional challenges, and curated tools.
 */

export interface LeadBriefing {
  franchise: string;
  title: string;
  standfirst: string;
  publishedAt: string;
  readingTime: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  keyTakeaways: string[];
  fullBriefingUrl?: string;
  tags: string[];
}

export interface ComplianceWatchItem {
  id: string;
  statute: string;
  regulationTitle: string;
  urgency: 'HIGH' | 'MEDIUM' | 'MONITORING';
  effectiveDate: string;
  whatChanged: string;
  whoItAffects: string;
  whatYouNeedToDo: string;
  whenItMatters: string;
  governingBody: string;
  sourceDocUrl?: string;
}

export interface BriefingStripItem {
  id: string;
  category: string;
  headline: string;
  summary: string;
  sector: string;
  impactLevel: 'Direct Duty' | 'Operational' | 'Market Shift';
  timestamp: string;
}

export interface EngineersNoteItem {
  id: string;
  title: string;
  discipline: string;
  subtitle: string;
  leadParagraph: string;
  technicalObservation: string;
  fieldRule: string;
  author: {
    name: string;
    title: string;
    credentials: string;
  };
  diagramNote?: string;
}

export interface UsefulThingItem {
  id: string;
  title: string;
  category: string;
  format: 'Spreadsheet (.xlsx)' | 'Interactive Matrix' | 'Specification Template' | 'Checklist (.pdf)';
  description: string;
  whyItMatters: string;
  actionUrl: string;
  actionLabel: string;
  isExistingResource: boolean;
}

export interface FromTheFieldItem {
  id: string;
  imageKey: string;
  imageSrc: string;
  imageAlt: string;
  locationContext: string;
  environmentType: string;
  challengeTitle: string;
  observation: string;
  lessonLearned: string;
  remedialAction: string;
}

export interface AskEntireFMItem {
  id: string;
  question: string;
  askerContext: string;
  estateProfile: string;
  keyAnswerPoints: string[];
  fullAnswerSummary: string;
  responder: {
    name: string;
    role: string;
  };
}

export interface WorthAttendingItem {
  id: string;
  title: string;
  organizer: string;
  eventType: 'Webinar' | 'Conference' | 'Briefing' | 'Technical Round';
  date: string;
  location: string;
  editorialReason: string;
  registrationUrl: string;
}

export interface LobbyQuestionItem {
  id: string;
  weekNumber: number;
  topic: string;
  difficulty: 'Foundation' | 'Practitioner' | 'Lead Engineer';
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  governingStandard: string;
}

export interface LobbyPulseItem {
  id: string;
  question: string;
  context: string;
  totalVotesBaseline: number;
  options: {
    id: string;
    label: string;
    percentage: number;
  }[];
}

export interface CuratedResourceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  ctaText: string;
  statsBadge?: string;
  tag: string;
}

export interface LobbyContent {
  leadBriefing: LeadBriefing;
  complianceWatch: ComplianceWatchItem;
  briefingStrip: BriefingStripItem[];
  engineersNote: EngineersNoteItem;
  usefulThing: UsefulThingItem;
  fromTheField: FromTheFieldItem;
  askEntireFM: AskEntireFMItem;
  toolkit: CuratedResourceItem[];
  lobbyQuestion: LobbyQuestionItem;
  lobbyPulse: LobbyPulseItem;
  worthAttending: WorthAttendingItem;
}
