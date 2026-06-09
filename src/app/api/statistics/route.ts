import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await db.order.findMany({ include: { items: true } });

    // Today's revenue
    const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today);
    const todayRevenue = todayOrders
      .filter((o) => o.status !== 'ditolak')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    // This month's revenue
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthOrders = orders.filter((o) => new Date(o.createdAt) >= monthStart);
    const monthRevenue = monthOrders
      .filter((o) => o.status !== 'ditolak')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    // Total orders
    const totalOrders = orders.length;

    // Best selling products
    const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders.forEach((o) => {
      if (o.status === 'ditolak') return;
      o.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: item.productName, qty: 0, revenue: 0 };
        }
        productSales[item.productId].qty += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    const bestSelling = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

    // Sales chart data (last 7 days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d >= date && d < nextDate && o.status !== 'ditolak';
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      const dayName = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });

      chartData.push({ name: dayName, revenue: dayRevenue, orders: dayOrders.length });
    }

    return NextResponse.json({
      todayRevenue,
      monthRevenue,
      totalOrders,
      todayOrders: todayOrders.length,
      bestSelling,
      chartData,
    });
  } catch (error) {
    console.error('Statistics error:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
