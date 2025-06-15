import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for dashboard stats
  const stats = {
    live_sessions: 3,
    scheduled_onetime: 5,
    scheduled_daily: 2,
    inactive_sessions: 8,
    video_count: 24
  };

  return NextResponse.json(stats);
}