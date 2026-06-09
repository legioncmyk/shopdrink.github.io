'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types';

const formatRupiah = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

const stockBadge = (status: string) => {
  switch (status) {
    case 'available':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Tersedia</Badge>;
    case 'limited':
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Terbatas</Badge>;
    case 'out_of_stock':
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Habis</Badge>;
    default:
      return null;
  }
};

export default function FeaturedProducts() {
  const setView = useAppStore((s) => s.setView);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data: Product[] = await res.json();
        setProducts(data.filter((p) => p.featured));
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-8 sm:mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Menu <span className="text-[#2563EB]">Favorit</span>
        </h2>
        <p className="text-gray-500 text-sm sm:text-base">Pilihan terbaik yang paling diminati pelanggan</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2">{stockBadge(product.stockStatus)}</div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-[#2563EB] font-bold text-sm sm:text-lg mt-1">{formatRupiah(product.price)}</p>
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-[#2563EB] hover:bg-[#1E40AF] text-white"
                      disabled={product.stockStatus === 'out_of_stock'}
                      onClick={() => {
                        useAppStore.getState().setView('catalog');
                      }}
                    >
                      Pesan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Button
          variant="outline"
          className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"
          onClick={() => setView('catalog')}
        >
          Lihat Semua Menu →
        </Button>
      </div>
    </section>
  );
}
