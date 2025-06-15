import { NextResponse } from 'next/server';

// Tambahkan ini untuk mendukung ekspor statis
export const dynamic = 'force-static';

export async function GET() {
  // Mock data for disk usage
  const diskUsage = {
    used: 45.2,
    total: 100.0,
    free: 54.8,
    percentage: 45.2,
  };

  return NextResponse.json(diskUsage);
}
