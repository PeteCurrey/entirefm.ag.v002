import { getLobbyEvents } from './event-store';
import { getClosingSoonAwards } from '../awards/awards-store';

export type HorizonItemType = 'event' | 'award-deadline' | 'compliance-date' | 'consultation';

export interface HorizonItem {
  id: string;
  type: HorizonItemType;
  dateBadge: string; // e.g. '04 SEP'
  fullDate: string;
  title: string;
  category: string;
  organizerOrAuthority: string;
  url: string;
  isExternal?: boolean;
  statusBadge?: string;
}

export function getOnTheHorizonItems(): HorizonItem[] {
  return [
    {
      id: 'hor-01',
      type: 'award-deadline',
      dateBadge: '04 SEP',
      fullDate: 'Friday 4 September 2026 · 17:00 BST',
      title: 'IWFM Impact Awards 2026 Entry Submissions Close',
      category: 'Awards & Recognition',
      organizerOrAuthority: 'IWFM',
      url: '/lobby/awards/iwfm-impact-awards-2026',
      statusBadge: 'Closing Soon',
    },
    {
      id: 'hor-02',
      type: 'event',
      dateBadge: '16 SEP',
      fullDate: '16–18 September 2026 · ExCeL London',
      title: 'The Facilities Show 2026 Exhibition & Smart Estates Summit',
      category: 'Conferences & Exhibitions',
      organizerOrAuthority: 'Informa Markets / IWFM',
      url: '/lobby/events',
      statusBadge: 'Registration Open',
    },
    {
      id: 'hor-03',
      type: 'award-deadline',
      dateBadge: '18 SEP',
      fullDate: 'Friday 18 September 2026 · 17:00 BST',
      title: 'PFM Partnership Awards 2026 Entry Deadline',
      category: 'Awards & Recognition',
      organizerOrAuthority: 'PFM Awards',
      url: '/lobby/awards/pfm-partnership-awards-2026',
      statusBadge: 'Entries Open',
    },
    {
      id: 'hor-04',
      type: 'event',
      dateBadge: '24 SEP',
      fullDate: 'Wednesday 24 September 2026 · 14:00 BST',
      title: 'BSR Technical Briefing: Mandatory Occurrence Reporting in HRBs',
      category: 'Statutory Compliance',
      organizerOrAuthority: 'Building Safety Regulator (HSE)',
      url: '/lobby/events',
      statusBadge: 'CPD Certified',
    },
    {
      id: 'hor-05',
      type: 'compliance-date',
      dateBadge: '30 SEP',
      fullDate: '30 September 2026',
      title: 'Building Safety Act Secondary Legislation Q4 Transition Closes',
      category: 'Legal Mandate',
      organizerOrAuthority: 'UK Government / HSE',
      url: '/lobby/compliance',
      statusBadge: 'Enforcement Date',
    },
    {
      id: 'hor-06',
      type: 'event',
      dateBadge: '08 OCT',
      fullDate: 'Thursday 8 October 2026 · Manchester Central',
      title: 'CIBSE Regional Symposium: Commercial Heat Pump & Decarbonisation',
      category: 'M&E Engineering',
      organizerOrAuthority: 'CIBSE North West',
      url: '/lobby/events',
      statusBadge: 'CPD Certified',
    },
  ];
}
