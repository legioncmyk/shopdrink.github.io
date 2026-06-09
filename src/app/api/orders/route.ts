import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Generate order number: ORD-YYYY-XXXX
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(Math.random() * 9999) + 1;
  return `ORD-${year}-${String(random).padStart(4, '0')}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const orderNumber = searchParams.get('orderNumber');

    if (phone) {
      const orders = await db.order.findMany({
        where: { phone },
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      });
      return NextResponse.json(orders);
    }

    if (orderNumber) {
      const order = await db.order.findFirst({
        where: { orderNumber },
        include: { items: true },
      });
      return NextResponse.json(order);
    }

    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, phone, notes, items, paymentMethod, paymentProof } = body;

    let orderNumber = generateOrderNumber();
    // Ensure uniqueness
    while (await db.order.findFirst({ where: { orderNumber } })) {
      orderNumber = generateOrderNumber();
    }

    const totalPrice = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

    const order = await db.order.create({
      data: {
        orderNumber,
        customerName,
        phone,
        notes: notes || '',
        totalPrice,
        paymentMethod: paymentMethod || 'dana',
        paymentProof: paymentProof || '',
        status: paymentProof ? 'menunggu_verifikasi' : 'menunggu_pembayaran',
        items: {
          create: items.map((item: { productId: string; productName: string; price: number; quantity: number }) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (data.paymentProof) {
      data.status = 'menunggu_verifikasi';
    }

    const order = await db.order.update({
      where: { id },
      data,
      include: { items: true },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
