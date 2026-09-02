import type { Metadata } from 'next';
import { TemplateLobbyLearnScenarios } from '@/templates/lobby/TemplateLobbyLearnScenarios';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Scenarios: What Would You Do? | LEARN · EntireFM',
  description: 'Interactive FM learning scenarios for decision-making practice. Realistic situations covering incident management, contractor control, compliance, and operations.',
  alternates: { canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/scenarios` },
  openGraph: {
    title: 'FM Scenarios: What Would You Do? | LEARN · EntireFM',
    description: 'Realistic FM scenarios for practical decision-making development. Educational exercises for UK facilities management professionals.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/scenarios`,
    type: 'website',
  },
};

export default function LearnScenariosPage() {
  return <TemplateLobbyLearnScenarios />;
}
