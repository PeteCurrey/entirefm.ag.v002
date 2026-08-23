'use client';

import { useEffect } from 'react';

/**
 * SCROLL REVEAL
 * =============
 * Watches for any element carrying [data-reveal] and marks it revealed once
 * it enters the viewport. The transition itself lives in globals.css.
 *
 * Deliberately a single observer at the root rather than a wrapper component
 * per element: the server components that make up the page stay server
 * components, and markup keeps working with JavaScript disabled — the CSS
 * `.no-js` guard leaves everything visible in that case.
 *
 * Elements are revealed once and then unobserved. Nothing re-animates on
 * scroll-back, which reads as fussy rather than premium.
 */
export function RevealProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const reveal = (el: Element) => el.setAttribute('data-revealed', 'true');

    if (reduced) {
      document.querySelectorAll('[data-reveal]').forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      // Fire slightly before the element reaches the fold so the movement has
      // finished by the time it is properly in view.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 }
    );

    const observeAll = () =>
      document
        .querySelectorAll('[data-reveal]:not([data-revealed])')
        .forEach((el) => observer.observe(el));

    observeAll();

    // Catch anything added after hydration (mega-menu panels, route changes).
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return <>{children}</>;
}
