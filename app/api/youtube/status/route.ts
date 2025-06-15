import { NextResponse } from 'next/server';

export async function GET() {
  // Mock YouTube status
  const status = {
    connected: false,
    channel_name: null,
    channel_id: null
  };

  return NextResponse.json(status);
}