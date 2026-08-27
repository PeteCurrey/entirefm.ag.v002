export interface LobbyEvent {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  dateString: string; // e.g. '17 September 2026'
  timeString: string; // e.g. '09:30 – 16:30 BST'
  locationType: 'in-person' | 'online' | 'hybrid';
  venue: string; // e.g. 'ExCeL London' or 'Live Webinar'
  city?: string;
  summary: string;
  whyItMatters: string;
  topic: string;
  externalUrl?: string;
  linkedRoomSlug?: string;
}

export const LOBBY_EVENTS: LobbyEvent[] = [
  {
    id: 'evt-01',
    slug: 'facilities-show-2026-excel-london',
    title: 'The Facilities Show 2026',
    organizer: 'Informa Markets / IWFM Partnered',
    dateString: '16–18 September 2026',
    timeString: '09:00 – 17:00 BST',
    locationType: 'in-person',
    venue: 'ExCeL London',
    city: 'London',
    summary: 'The UK’s flagship annual exhibition for facilities managers, smart estate technologies, and ESG compliance.',
    whyItMatters:
      'Crucial opportunity to inspect live PropTech hardware, verify CAFM integrations, and network with 12,000+ UK estate leaders.',
    topic: 'General FM & Technology',
    externalUrl: 'https://www.facilitiesshow.com',
    linkedRoomSlug: 'fm-general',
  },
  {
    id: 'evt-02',
    slug: 'bsr-mandatory-occurrence-reporting-briefing-webinar',
    title: 'BSR Technical Briefing: Mandatory Occurrence Reporting',
    organizer: 'Building Safety Regulator (HSE)',
    dateString: '24 September 2026',
    timeString: '14:00 – 15:30 BST',
    locationType: 'online',
    venue: 'Live Digital Roundtable',
    summary: 'Official regulator workshop explaining statutory logging thresholds and 48-hour notification workflows under the Building Safety Act.',
    whyItMatters: 'Essential for Accountable Persons, Principal Accountable Persons, and Hard FM contractors operating HRBs.',
    topic: 'Building Safety',
    externalUrl: 'https://www.hse.gov.uk/building-safety',
    linkedRoomSlug: 'building-safety',
  },
  {
    id: 'evt-03',
    slug: 'cibse-hvac-heat-pump-retrofit-symposium-manchester',
    title: 'CIBSE Regional Symposium: Commercial Heat Pump & Decarbonisation',
    organizer: 'CIBSE North West Region',
    dateString: '08 October 2026',
    timeString: '10:00 – 16:00 BST',
    locationType: 'in-person',
    venue: 'Manchester Central Convention Complex',
    city: 'Manchester',
    summary: 'Technical deep-dive on replacing gas fired boiler batteries with high-temperature air-source and water-source heat pumps in commercial office buildings.',
    whyItMatters: 'Practical engineering calculations on electrical substation capacity, defrost cycles, and acoustic plant enclosure design.',
    topic: 'Engineering & M&E',
    externalUrl: 'https://www.cibse.org',
    linkedRoomSlug: 'engineering-me',
  },
];

export function getLobbyEvents(filters?: { locationType?: string; topic?: string }): LobbyEvent[] {
  let list = [...LOBBY_EVENTS];
  if (filters?.locationType && filters.locationType !== 'all') {
    list = list.filter((e) => e.locationType === filters.locationType);
  }
  if (filters?.topic && filters.topic !== 'all') {
    list = list.filter((e) => e.topic.toLowerCase().includes(filters.topic!.toLowerCase()));
  }
  return list;
}
