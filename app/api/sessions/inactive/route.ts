import { NextResponse } from 'next/server';

export async function GET() {
  // Mock inactive sessions data
  const sessions = [
    {
      id: '3',
      name: 'Completed Stream 1',
      video_file: 'sample-video-1.mp4',
      platform: 'youtube',
      status: 'completed',
      stream_key: 'mock_inactive_key_1',
      started_at: new Date(Date.now() - 3600000).toISOString(),
      ended_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Failed Stream',
      video_file: 'sample-video-2.mp4',
      platform: 'facebook',
      status: 'failed',
      stream_key: 'mock_inactive_key_2',
      started_at: new Date(Date.now() - 7200000).toISOString(),
      ended_at: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  return NextResponse.json(sessions);
}

export async function DELETE() {
  // Mock delete all inactive sessions
  return NextResponse.json({ message: 'All inactive sessions deleted successfully' });
}