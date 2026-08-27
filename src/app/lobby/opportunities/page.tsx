import { Metadata } from 'next';
import { TemplateOpportunities } from '@/templates/opportunities/TemplateOpportunities';

export const metadata: Metadata = {
  title: 'FM Procurement & Contract Awards | The Lobby · EntireFM',
  description: 'Live UK public sector facilities management tenders, framework opportunities, and Who Won What contract award intelligence.',
};

export default function OpportunitiesPage() {
  return <TemplateOpportunities />;
}
