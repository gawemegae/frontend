import { NextResponse } from 'next/server';

export async function GET() {
  // Mock video data
  const videos = [
    {
      id: '1',
      filename: 'sample-video-1.mp4',
      title: 'Sample Video 1',
      duration: '00:05:30',
      size: '125.4 MB',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      filename: 'sample-video-2.mp4',
      title: 'Sample Video 2',
      duration: '00:03:45',
      size: '89.2 MB',
      created_at: new Date().toISOString()
    }
  ];

  return NextResponse.json(videos);
}

export async function DELETE() {
  // Mock delete all videos
  return NextResponse.json({ message: 'All videos deleted successfully' });
}