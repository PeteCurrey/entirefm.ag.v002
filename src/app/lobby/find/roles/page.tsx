import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Professional Role Guides & Job Specifications | FIND — EntireFM',
  description:
    'Comprehensive UK facilities management role specifications: Facilities Manager, Facilities Director, Contract Manager, Mobilisation Manager, and Engineering Manager.',
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/roles`,
  },
  openGraph: {
    title: 'FM Professional Role Guides & Job Specifications | FIND — EntireFM',
    description:
      'Comprehensive UK facilities management role specifications, responsibilities, and progression routes.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/roles`,
    type: 'website',
  },
};

export default function FindRolesPage() {
  return <TemplateLobbyFind initialTab="ROLES" />;
}
