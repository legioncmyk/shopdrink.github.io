import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');

    // Admin sees ALL promos (including inactive), public sees only active
    const promos = await db.promo.findMany({
      where: admin === 'true' ? {} : { active: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(promos);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch promos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const promo = await db.promo.create({ data: body });
    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    console.error('Create promo error:', error);
    return NextResponse.json({ error: 'Failed to create promo' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const promo = await db.promo.update({ where: { id }, data });
    return NextResponse.json(promo);
  } catch (error) {
    console.error('Update promo error:', error);
    return NextResponse.json({ error: 'Failed to update promo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await db.promo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete promo error:', error);
    return NextResponse.json({ error: 'Failed to delete promo' }, { status: 500 });
  }
}
