import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/init-db';

export async function GET() {
  try {
    await initDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database initialized and mock data seeded successfully!',
    });
  } catch (error: any) {
    console.error('Database initialization failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred during database initialization.',
      },
      { status: 500 }
    );
  }
}
export async function POST() {
  return GET();
}
