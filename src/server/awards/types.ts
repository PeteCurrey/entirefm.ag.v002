import type { ImageProvenance } from '@/lib/lobby/image-resolver';

export type AwardStatus =
  | 'entries-open'
  | 'closing-soon'
  | 'shortlisted'
  | 'upcoming'
  | 'winners-announced'
  | 'completed';

export interface IndustryAward {
  id: string;
  slug: string;
  name: string;
  organiser: string; // e.g. "IWFM", "PFM Awards", "CIBSE", "National Building & Construction Awards"
  description: string;
  categories: string[];
  entryOpenDate: string; // ISO
  entryDeadline: string; // ISO
  shortlistDate?: string;
  eventDate: string;
  location: string;
  officialUrl: string;
  provenance: ImageProvenance;
  status: AwardStatus;
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorshipDisclosure?: string;
  whyItMatters?: string;
}

export interface AwardsQueryOptions {
  status?: AwardStatus | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}
