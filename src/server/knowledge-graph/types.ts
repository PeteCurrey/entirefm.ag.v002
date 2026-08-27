export type EntityType =
  | 'article'
  | 'compliance'
  | 'discussion'
  | 'room'
  | 'tool'
  | 'resource'
  | 'academy'
  | 'event'
  | 'standard'
  | 'authority'
  | 'member';

export type RelationshipType =
  | 'PUT_INTO_PRACTICE_WITH'
  | 'CONTINUE_THE_CONVERSATION'
  | 'LEARN_MORE'
  | 'REFERENCES'
  | 'APPLIES_TO'
  | 'EDITORIAL_CANDIDATE_FROM'
  | 'SUPERSEDES';

export interface EntityRelationship {
  id: string;
  sourceType: EntityType;
  sourceId: string;
  relationshipType: RelationshipType;
  targetType: EntityType;
  targetId: string;
  targetTitle: string;
  targetUrl: string;
  targetSnippet?: string;
  targetBadge?: string;
  weight: number;
}

export interface AuthorityEntity {
  id: string;
  slug: string;
  name: string;
  acronym: string;
  role: 'Statutory Regulator' | 'Professional Institution' | 'Standards Body' | 'Trade Association';
  website: string;
  description: string;
  icon: string;
}

export interface StandardReference {
  id: string;
  code: string; // e.g. 'BS 7671:2018+A2:2022'
  title: string;
  authorityId: string;
  authorityName: string;
  status: 'Current' | 'Under Revision' | 'Superseded';
  summary: string;
  officialUrl?: string;
}

export interface EditorialCandidate {
  id: string;
  discussionSlug: string;
  discussionTitle: string;
  candidateType: 'Ask EntireFM' | "Engineer's Note" | 'Compliance Watch' | 'Resource Guide';
  status: 'candidate' | 'reviewing' | 'promoted' | 'declined';
  authorMemberName: string;
  nominatedBy: string;
  nominatedAt: string;
  editorNotes?: string;
}
