import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { defaultMetadata } from '@/lib/metadata/generate-metadata';
import { RevealProvider } from '@/components/motion/RevealProvider';
import { CookieConsentBanner } from '@/components/legal/CookieConsentBanner';
import { ScrollToTop } from '@/components/navigation/ScrollToTop';
import './globals.css';

/**
 * CANONICAL TYPOGRAPHY — WORK SANS
 * ================================
 * Work Sans is the official canonical typeface across the EntireFM digital
 * ecosystem (public website, CAFM, /admin, /clients, /contractor, /engineer).
 *
 * Weight Hierarchy:
 * - 200 (ExtraLight): Hero display headings, major section titles, large KPI figures
 * - 300 (Light): Secondary headings, card headings, page intros, large supporting copy
 * - 400 (Regular): Body copy, CAFM tables, descriptions, form inputs, tooltips
 * - 500 (Medium): Buttons, tabs, active navigation, table headers, status badges
 * - 600 (SemiBold): Selective emphasis, high-priority operational states
 */
const workSans = {
  variable: '--font-work-sans',
};

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={workSans.variable}>
      <head>
        {/* Google tag (gtag.js) with Google Consent Mode v2 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              // 1. Set privacy-first default consent state (denied until explicit opt-in)
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });

              // 2. Check for existing consent preference in cookie for returning visitors
              try {
                var match = document.cookie.match(/(?:^|; )efm_consent_prefs=([^;]*)/);
                if (match) {
                  var prefs = JSON.parse(decodeURIComponent(match[1]));
                  gtag('consent', 'update', {
                    'analytics_storage': prefs.analytics ? 'granted' : 'denied',
                    'ad_storage': prefs.marketing ? 'granted' : 'denied',
                    'ad_user_data': prefs.marketing ? 'granted' : 'denied',
                    'ad_personalization': prefs.marketing ? 'granted' : 'denied'
                  });
                }
              } catch (e) {}

              gtag('js', new Date());
              gtag('config', 'G-NRM7HJMM4Q');
            `,
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NRM7HJMM4Q" />
      </head>
      <body>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-brand-graphite focus:px-4 focus:py-2.5 focus:text-sm focus:font-light focus:text-white"
        >
          Skip to content
        </a>
        <RevealProvider>
          {children}
          <CookieConsentBanner />
        </RevealProvider>
      </body>
    </html>
  );
}

