import type { Author } from './types';

export const LOBBY_AUTHORS: Record<string, Author> = {
  'entirefm-technical': {
    id: 'entirefm-technical',
    name: 'EntireFM Technical Directorate',
    role: 'Building Services Engineering & Operations',
    credentials: 'CEng MCIBSE, MIET, BESA Technical Panel Specialists',
    shortBio:
      'The engineering leadership team at EntireFM, responsible for hard FM delivery, planned maintenance design, mechanical diagnostics, and statutory compliance oversight across UK estates.',
    profileSlug: 'entirefm-technical',
  },
  'entirefm-compliance': {
    id: 'entirefm-compliance',
    name: 'EntireFM Compliance Directorate',
    role: 'Statutory Governance & Regulatory Policy',
    credentials: 'NEBOSH Diploma, TechIOSH, Statutory Duty Analysts',
    shortBio:
      'Translates UK statutory legislation, HSE Approved Codes of Practice, British Standards, and Building Safety Regulator guidance into actionable operational maintenance roadmaps.',
    profileSlug: 'entirefm-compliance',
  },
  'entirefm-operations': {
    id: 'entirefm-operations',
    name: 'EntireFM Mobilisation & Operations Desk',
    role: 'Contract Transition & Estate Governance',
    credentials: 'IWFM Certified Facilities Managers & CAFM Architects',
    shortBio:
      'Manages complex commercial estate takeovers, baseline asset discovery surveys, supplier governance, and CAFM operating architectures across national commercial portfolios.',
    profileSlug: 'entirefm-operations',
  },
  'entirefm-editorial': {
    id: 'entirefm-editorial',
    name: 'The Lobby Editorial Desk',
    role: 'FM Intelligence & Industry Analysis',
    credentials: 'UK Commercial Property & Building Engineering Research',
    shortBio:
      'Curates prioritised intelligence, technical analysis, market data benchmarks, and practical assets for UK facilities professionals.',
    profileSlug: 'entirefm-editorial',
  },
};

export function getAuthorById(id: string): Author {
  return LOBBY_AUTHORS[id] || LOBBY_AUTHORS['entirefm-editorial'];
}
