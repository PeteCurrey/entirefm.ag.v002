import { NextResponse } from 'next/server';
import { memoryStore } from '@/server/blog/store';
import { BlogCategory } from '@/server/blog/types';

export async function GET() {
  return NextResponse.json(memoryStore.categories);
}

export async function POST(req: Request) {
  const body = await req.json();
  const category: BlogCategory = {
    id: `cat-${Date.now()}`,
    name: body.name,
    slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: body.description || '',
    isActive: true,
    sortOrder: memoryStore.categories.length + 1,
    postCount: 0,
  };
  memoryStore.categories.push(category);
  return NextResponse.json(category, { status: 201 });
}
