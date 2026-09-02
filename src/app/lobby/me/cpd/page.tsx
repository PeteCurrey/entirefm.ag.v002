import type { Metadata } from 'next';
import { TemplateCpdDashboard } from '@/templates/cpd/TemplateCpdDashboard';

export const metadata: Metadata = {
  title: 'My CPD Activity & Hours | The Lobby — EntireFM',
  description: 'Verified professional development activity log and transcript export.',
};

export default function LobbyCpdPage() {
  return <TemplateCpdDashboard />;
}
