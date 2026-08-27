import { NextResponse } from 'next/server';
import { getCommunityCategories } from '@/server/community/category-store';

export async function GET() {
  const categories = getCommunityCategories();
  return NextResponse.json({ categories });
}
