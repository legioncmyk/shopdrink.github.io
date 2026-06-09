import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === 'zallhostinger' && password === 'zallhostinger29') {
      const token = randomUUID();
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ success: false, error: 'Username atau password salah' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
