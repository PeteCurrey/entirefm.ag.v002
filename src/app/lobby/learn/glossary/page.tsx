import type { Metadata } from 'next';
import { TemplateLobbyLearnGlossary } from '@/templates/lobby/TemplateLobbyLearnGlossary';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Glossary & Terminology | LEARN · EntireFM',
  description: 'Searchable FM terminology library with concise, professionally written definitions for UK facilities management. Legal significance noted where relevant.',
  keywords: ['FM glossary', 'facilities management terms', 'FM definitions', 'CAFM', 'PPM', 'SLA', 'TUPE', 'LOLER', 'EICR', 'facilities management glossary UK'],
  alternates: { canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/glossary` },
  openGraph: {
    title: 'FM Glossary & Terminology | LEARN · EntireFM',
    description: 'Searchable UK FM terminology library with concise definitions and legal significance notes.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/glossary`,
    type: 'website',
  },
};

export default function LearnGlossaryPage() {
  return <TemplateLobbyLearnGlossary />;
}
