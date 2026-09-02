import { NextResponse } from 'next/server';
import { getAllRooms } from '@/server/rooms/room-store';

export async function GET() {
  const rooms = await getAllRooms();
  return NextResponse.json({ rooms });
}
