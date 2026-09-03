export type HorizonItemType = 'event' | 'award-deadline' | 'compliance-date' | 'consultation';

export interface HorizonItem {
  id: string;
  type: HorizonItemType;
  dateBadge: string; // e.g. '04 SEP'
  fullDate: string;
  eventDateIso: string; // ISO date for automatic freshness filtering
  title: string;
  category: string;
  organizerOrAuthority: string;
  url: string;
  isExternal?: boolean;
  statusBadge?: string;
}

const RAW_HORIZON_ITEMS: HorizonItem[] = [
  {
    id: 'hor-01',
    type: 'award-deadline',
    dateBadge: '04 SEP',
    fullDate: 'Friday 4 September 2026 · 17:00 BST',
    eventDateIso: '2026-09-04T16:00:00Z',
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
    eventDateIso: '2026-09-18T17:00:00Z',
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
    eventDateIso: '2026-09-18T16:00:00Z',
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
    eventDateIso: '2026-09-24T14:00:00Z',
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
    eventDateIso: '2026-09-30T23:59:59Z',
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
    eventDateIso: '2026-10-08T16:00:00Z',
    title: 'CIBSE Regional Symposium: Commercial Heat Pump & Decarbonisation',
    category: 'M&E Engineering',
    organizerOrAuthority: 'CIBSE North West',
    url: '/lobby/events',
    statusBadge: 'CPD Certified',
  },
];

/**
 * Returns upcoming horizon events, automatically filtering out past dates.
 */
export function getOnTheHorizonItems(): HorizonItem[] {
  const now = Date.now();
  return RAW_HORIZON_ITEMS.filter((item) => new Date(item.eventDateIso).getTime() >= now);
}
