import { Metadata } from 'next';
import { getWebsiteAnalytics } from '@/server/analytics';
import { AnalyticsDashboardClient } from '@/components/admin/analytics/AnalyticsDashboardClient';

export const metadata: Metadata = {
  title: 'Website Analytics & Commercial Intelligence | EntireFM Admin',
  description: 'Verified executive website analytics, traffic acquisition, Google Search Console rankings, and commercial enquiry conversion intelligence.',
};

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const analyticsData = await getWebsiteAnalytics('30d');

  return (
    <main className="min-h-screen bg-[#FBFBFA]">
      <AnalyticsDashboardClient initialData={analyticsData} />
    </main>
  );
}
