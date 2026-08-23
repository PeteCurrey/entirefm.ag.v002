import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { defaultMetadata } from '@/lib/metadata/generate-metadata';
import { RevealProvider } from '@/components/motion/RevealProvider';
import './globals.css';

/**
 * Plus Jakarta Sans is the official EntireFM typeface, specified in the brand
 * guidelines as "Clean. Contemporary. Confident." The full weight range is
 * loaded because the design uses it: 200 for large display numerals through
 * 800 for headline emphasis.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={jakarta.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-brand-graphite focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <RevealProvider>{children}</RevealProvider>
      </body>
    </html>
  );
}
