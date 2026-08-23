/**
 * AUTHORITATIVE CONTACT CONFIGURATION
 * =====================================
 * Sourced from /config/verified-contact.json.
 * Only verified or confirmed contact details are exported.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const contactRegistry = require('../../config/verified-contact.json') as {
  contacts: Array<{
    id: string;
    type: string;
    value: string;
    hrefValue: string;
    status: string;
    evidence: string;
    approvedForProduction: boolean;
    note?: string;
  }>;
};

function getContact(id: string) {
  return contactRegistry.contacts.find(c => c.id === id && c.approvedForProduction) ?? null;
}

const mainPhoneRecord = getContact('PHONE_MAIN');
const enquiryEmailRecord = getContact('EMAIL_ENQUIRY');
const helpdeskEmailRecord = getContact('EMAIL_HELPDESK');
const careersEmailRecord = getContact('EMAIL_CAREERS');

export const CONTACT_CONFIG = {
  // Primary Inboxes (strings for direct template/component rendering)
  enquiryEmail: enquiryEmailRecord?.value ?? 'enquiries@entirefm.com',
  helpdeskEmail: helpdeskEmailRecord?.value ?? 'helpdesk@entirefm.com',
  careersEmail: careersEmailRecord?.value ?? 'careers@entirefm.com',

  // Phone numbers with display and href
  mainPhone: {
    display: mainPhoneRecord?.value ?? '020 4586 5422',
    href: mainPhoneRecord?.hrefValue ?? 'tel:02045865422',
    status: mainPhoneRecord?.status ?? 'VERIFIED',
    isVerified: mainPhoneRecord?.status === 'VERIFIED' || mainPhoneRecord?.status === 'CONFIRMED_IN_USE',
  },

  emergencyDesk: {
    display: '24/7 Digital Helpdesk Portal',
    href: '/contact-us',
    status: 'CONFIRMED_IN_USE',
    isVerified: true,
  },

  // Headquarters — factual, non-claim
  address: {
    line1: 'EntireFM (Alkota Group Limited)',
    city: 'United Kingdom',
  },

  // Canonical Host — always the production domain
  canonicalHost: 'https://www.entirefm.com',
} as const;

// Convenience accessors for components
export const MAIN_PHONE_DISPLAY = CONTACT_CONFIG.mainPhone.display;
export const MAIN_PHONE_HREF = CONTACT_CONFIG.mainPhone.href;
export const ENQUIRY_EMAIL = CONTACT_CONFIG.enquiryEmail;
