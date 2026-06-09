import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    // Check if products already exist
    const existingProducts = await db.product.count();
    if (existingProducts > 0) {
      return NextResponse.json({ message: 'Seed data already exists' });
    }

    // Seed products
    const products = [
      { name: 'Matcha Latte Premium', description: 'Matcha premium Jepang dengan susu segar dan es, creamy dan rich flavor', price: 25000, image: '/images/products/matcha-latte.png', stockStatus: 'available', category: 'Kopi & Teh', featured: true },
      { name: 'Caramel Frappuccino', description: 'Espresso dengan caramel sauce, whipped cream dan dark caramel drizzle', price: 28000, image: '/images/products/caramel-frappe.png', stockStatus: 'available', category: 'Kopi & Teh', featured: true },
      { name: 'Strawberry Smoothie', description: 'Smoothie segar stroberi dengan chia seeds dan yogurt premium', price: 22000, image: '/images/products/strawberry-smoothie.png', stockStatus: 'available', category: 'Smoothie', featured: true },
      { name: 'Thai Tea Premium', description: 'Thai tea asli Thailand dengan susu kental dan es, aroma khas teh Thailand', price: 20000, image: '/images/products/thai-tea.png', stockStatus: 'available', category: 'Kopi & Teh', featured: true },
      { name: 'Cold Brew Original', description: 'Cold brew 12 jam dari biji kopi pilihan, smooth dan less acidic', price: 23000, image: '/images/products/cold-brew.png', stockStatus: 'available', category: 'Kopi & Teh', featured: false },
      { name: 'Taro Milk Tea', description: 'Taro premium dengan boba mutiara, creamy dan lembut', price: 22000, image: '/images/products/taro-milk-tea.png', stockStatus: 'available', category: 'Milk Tea', featured: true },
      { name: 'Mango Passion Fruit', description: 'Jus mangga segar dengan passion fruit dan mint leaves, tropical vibes', price: 24000, image: '/images/products/mango-passion.png', stockStatus: 'limited', category: 'Jus Segar', featured: false },
      { name: 'Choco Milkshake', description: 'Milkshake cokelat premium dengan whipped cream dan choco sprinkles', price: 26000, image: '/images/products/choco-shake.png', stockStatus: 'available', category: 'Milkshake', featured: false },
    ];

    for (const p of products) {
      await db.product.create({ data: p });
    }

    // Seed banners
    const banners = [
      { image: '/images/banners/banner1.png', title: 'Promo Spesial Bulan Ini!', linkText: 'Pesan Sekarang', sortOrder: 1 },
      { image: '/images/banners/banner2.png', title: 'Menu Baru Telah Hadir!', linkText: 'Lihat Menu', sortOrder: 2 },
      { image: '/images/banners/banner3.png', title: 'Gratis Ongkir untuk Pesanan Pertama', linkText: 'Order Now', sortOrder: 3 },
      { image: '/images/banners/banner4.png', title: 'Happy Hour Diskon 30%!', linkText: 'Pesan Sekarang', sortOrder: 4 },
      { image: '/images/banners/banner5.png', title: 'Buy 2 Get 1 Free!', linkText: 'Pesan Sekarang', sortOrder: 5 },
    ];

    for (const b of banners) {
      await db.banner.create({ data: { ...b, active: true } });
    }

    // Seed promos
    const promos = [
      { title: 'Diskon 20% Menu Baru', description: 'Nikmati diskon 20% untuk semua menu baru bulan ini!', image: '/images/banners/banner2.png', discount: '20%', active: true },
      { title: 'Happy Hour 3PM-5PM', description: 'Diskon 30% untuk semua minuman di jam 3 sore sampai 5 sore setiap hari kerja', image: '/images/banners/banner4.png', discount: '30%', active: true },
      { title: 'Free Delivery Weekend', description: 'Gratis ongkir untuk semua pesanan di hari Sabtu dan Minggu', image: '/images/banners/banner5.png', discount: 'Free Ongkir', active: true },
    ];

    for (const p of promos) {
      await db.promo.create({ data: p });
    }

    // Seed settings
    const settings = [
      { key: 'business_name', value: 'MinumanPro' },
      { key: 'business_tagline', value: 'Premium Drinks for Premium Moments' },
      { key: 'dana_number', value: '085169307731' },
      { key: 'dana_name', value: 'ZALLHOSTINGER' },
      { key: 'qris_image', value: '/images/qris.jpeg' },
      { key: 'whatsapp', value: '085169307731' },
      { key: 'address', value: 'Jl. Minuman Premium No. 88, Jakarta Selatan' },
      { key: 'hours_weekday', value: '08:00 - 22:00' },
      { key: 'hours_weekend', value: '09:00 - 23:00' },
      { key: 'logo', value: '' },
    ];

    for (const s of settings) {
      await db.setting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: s,
      });
    }

    return NextResponse.json({ message: 'Seed data created successfully', products: products.length, banners: banners.length, promos: promos.length, settings: settings.length });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}
