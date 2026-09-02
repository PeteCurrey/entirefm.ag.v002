import type { Metadata } from 'next';
import { TemplateTrainingDirectory } from '@/templates/training/TemplateTrainingDirectory';

export const metadata: Metadata = {
  title: 'UK Facilities Management Training & CPD Directory | The Lobby',
  description: 'Curated directory of regulated UK FM qualifications, IWFM Academy pathways, NEBOSH safety certifications, and CIBSE engineering CPD.',
};

export default function LobbyTrainingPage() {
  return <TemplateTrainingDirectory />;
}
