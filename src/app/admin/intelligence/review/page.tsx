import { Metadata } from 'next';
import { AdminIntelligenceReviewClient } from '@/components/admin/AdminIntelligenceReviewClient';

export const metadata: Metadata = {
  title: 'Editorial Review Queue | EntireFM Admin',
  description: 'Editorial review queue for statutory and high-impact compliance intelligence items.',
};

export default function AdminReviewPage() {
  return (
    <main className="min-h-screen bg-[#07090E] text-white pt-24 pb-20">
      <div className="container-wide">
        <div className="border-b border-white/10 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-white">Editorial Intelligence Review Queue</h1>
          <p className="text-xs font-normal text-white/50 mt-1">
            Human-in-the-loop review for high-impact UK statutory instruments and compliance alerts.
          </p>
        </div>
        <AdminIntelligenceReviewClient />
      </div>
    </main>
  );
}
