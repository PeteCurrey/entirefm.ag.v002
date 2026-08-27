import React from 'react';
import type { Metadata } from 'next';
import { listPortfolios } from '@/server/estate';
import { PortfoliosPageClient } from './PortfoliosPageClient';

export const metadata: Metadata = {
  title: 'Portfolios | EntireFM Estate CAFM',
  description: 'Regional and divisional property groupings across client accounts.',
};

export const dynamic = 'force-dynamic';

export default async function PortfoliosPage() {
  const portfolios = await listPortfolios();

  return <PortfoliosPageClient initialPortfolios={portfolios} />;
}
