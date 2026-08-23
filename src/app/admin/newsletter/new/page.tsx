import { Metadata } from 'next';
import CampaignComposerPage from '../[id]/page';

export const metadata: Metadata = { title: 'New Campaign | EntireFM Admin' };

export default function NewCampaignPage() {
  return <CampaignComposerPage />;
}
