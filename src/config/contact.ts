/**
 * AUTHORITATIVE CONTACT CONFIGURATION
 * =====================================
 * Single source of truth for verified contact details across the website.
 * No hardcoded phone numbers or unverified emails may exist in components.
 */

export const CONTACT_CONFIG = {
  // Verified Primary Inboxes
  enquiryEmail: 'enquiries@entirefm.com',
  helpdeskEmail: 'helpdesk@entirefm.com',
  careersEmail: 'careers@entirefm.com',
  
  // Phone numbers - Clean production presentation
  // When specific direct lines are pending client signoff, UI displays verified online triage.
  mainPhone: {
    display: '0800 093 1128',
    href: 'tel:08000931128',
    isVerified: true,
  },
  emergencyDesk: {
    display: '24/7 Digital Helpdesk Portal',
    href: '/contact-us',
    isVerified: true,
  },
  
  // Headquarters
  address: {
    line1: 'Entire Facilities Management Ltd',
    line2: 'Operational Centre',
    city: 'Lincoln',
    country: 'United Kingdom',
  },

  // Canonical Host
  canonicalHost: 'https://www.entirefm.com',
} as const;
