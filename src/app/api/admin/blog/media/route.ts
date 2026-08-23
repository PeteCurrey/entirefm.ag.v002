import { NextResponse } from 'next/server';
import { memoryStore } from '@/server/blog/store';

export async function GET() {
  return NextResponse.json(memoryStore.media);
}
