'use client';

import React from 'react';
export {
  type CookiePreferences,
  DEFAULT_PREFERENCES,
} from './CookieConsentBanner';

import { CookiePreferences } from './CookieConsentBanner';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (prefs: CookiePreferences) => void;
}

/**
 * CookiePreferencesModal
 * Provided for backwards compatibility; opens the rebuilt bottom-left preferences card.
 */
export function CookiePreferencesModal({
  isOpen,
  onClose,
}: CookiePreferencesModalProps) {
  React.useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('efm-open-cookie-settings'));
      onClose();
    }
  }, [isOpen, onClose]);

  return null;
}

