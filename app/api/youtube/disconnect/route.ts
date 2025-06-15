import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // In a real app, you would revoke the YouTube tokens
    console.log('Disconnecting from YouTube');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to disconnect from YouTube' },
      { status: 500 }
    );
  }
}