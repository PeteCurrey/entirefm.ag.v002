'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * SCROLL TO TOP CONTROLLER
 * ========================
 * Guarantees that all route transitions unconditionally land at the top of the page.
 * Prevents browser history scroll retention from leaving the viewport stuck at the
 * bottom or footer of the destination page.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Disable automatic browser scroll restoration so navigating to new routes always starts at (0,0)
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If an in-page hash anchor is present (e.g. #enquiry), honor the specific target
    if (window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const el = document.getElementById(hashId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Force instant scroll to the top of the page
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Microtask timeout to catch any late layout hydration
    const timer = setTimeout(() => {
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }, 15);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
