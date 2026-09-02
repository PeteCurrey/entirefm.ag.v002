import type { Metadata } from 'next';
import { TemplateLobbyLearnPlaybooks } from '@/templates/lobby/TemplateLobbyLearnPlaybooks';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Playbooks | LEARN · EntireFM',
  description: 'Structured, step-by-step guides for important FM workflows — mobilisation, procurement, contractor management, compliance assurance and more.',
  alternates: { canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/playbooks` },
  openGraph: {
    title: 'FM Playbooks | LEARN · EntireFM',
    description: 'Structured FM playbooks for mobilisation, procurement, contractor management and compliance.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/playbooks`,
    type: 'website',
  },
};

export default function LearnPlaybooksPage() {
  return <TemplateLobbyLearnPlaybooks />;
}
