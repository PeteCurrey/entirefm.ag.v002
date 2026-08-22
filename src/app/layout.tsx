import type { Metadata } from 'next';
import { defaultMetadata } from '@/lib/metadata/generate-metadata';
import './globals.css';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>
        {children}
      </body>
    </html>
  );
}
