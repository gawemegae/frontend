import { NextResponse } from 'next/server';

export async function GET() {
  // Mock live sessions data
  const sessions = [
    {
      id: '1',
      name: 'Live Stream 1',
      video_file: 'sample-video-1.mp4',
      platform: 'youtube',
      status: 'streaming',
      started_at: new Date().toISOString(),
      viewers: 142,
      stream_key: 'live-stream-key-1234567890abcdef'
    },
    {
      id: '2',
      name: 'Live Stream 2',
      video_file: 'sample-video-2.mp4',
      platform: 'facebook',
      status: 'streaming',
      started_at: new Date().toISOString(),
      viewers: 89,
      stream_key: 'live-stream-key-fedcba0987654321'
    }
  ];

  return NextResponse.json(sessions);
}