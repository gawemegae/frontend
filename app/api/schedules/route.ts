import { NextResponse } from 'next/server';

export async function GET() {
  // Mock schedules data
  const schedules = [
    {
      id: '1',
      name: 'Daily Morning Stream',
      video_file: 'sample-video-1.mp4',
      platform: 'youtube',
      type: 'daily',
      start_time: '09:00',
      status: 'active',
      stream_key: 'mock_schedule_key_1'
    },
    {
      id: '2',
      name: 'Weekend Special',
      video_file: 'sample-video-2.mp4',
      platform: 'facebook',
      type: 'onetime',
      start_time: new Date(Date.now() + 86400000).toISOString(),
      status: 'scheduled',
      stream_key: 'mock_schedule_key_2'
    }
  ];

  return NextResponse.json(schedules);
}