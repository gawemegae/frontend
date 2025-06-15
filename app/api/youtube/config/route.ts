import { NextResponse } from 'next/server';

// Mock YouTube configuration data
const mockConfig = {
  enabled: false,
  schedule_time: '09:00',
  title_template: 'Live Harian - {DD}/{MM}/{YYYY}',
  description_template: 'Streaming otomatis harian',
  video_selection_mode: 'sequential',
  privacy_status: 'public',
};

export async function GET() {
  return NextResponse.json(mockConfig);
}

export async function POST(request: Request) {
  try {
    const config = await request.json();
    // In a real app, you would save this to a database
    console.log('Saving YouTube config:', config);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}