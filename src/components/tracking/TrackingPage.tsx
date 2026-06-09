'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/use-app-store';
import { Search, ArrowLeft, RefreshCw, Package } from 'lucide-react';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types';
import type { Order, OrderStatus } from '@/types';

const formatRupiah = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default function TrackingPage() {
  const setView = useAppStore((s) => s.setView);
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!phone.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, [phone]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!phone.trim() || !searched) return;
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [phone, searched, fetchOrders]);

  const handleSearch = () => {
    fetchOrders();
  };

  return (
    <div className="min-h-screen pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <motion.button
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Kembali</span>
      </motion.button>

      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Lacak <span className="text-[#2563EB]">Pesanan</span>
        </h1>
        <p className="text-gray-500 text-sm">Masukkan nomor HP untuk melihat status pesanan</p>
      </motion.div>

      {/* Search */}
      <motion.div
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Masukkan nomor HP..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9 h-11 rounded-xl border-gray-200 focus:border-[#2563EB]"
          />
        </div>
        <Button
          className="bg-[#2563EB] hover:bg-[#1E40AF] text-white rounded-xl px-6"
          onClick={handleSearch}
          disabled={loading || !phone.trim()}
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </motion.div>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : searched && orders.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Tidak Ada Pesanan</h3>
          <p className="text-gray-500 text-sm">
            {phone.trim()
              ? 'Belum ada pesanan dengan nomor HP tersebut'
              : 'Masukkan nomor HP untuk melacak pesanan'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{order.orderNumber}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <Badge className={`${ORDER_STATUS_COLORS[order.status as OrderStatus]} text-xs`}>
                      {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                          <p className="text-xs text-gray-500">{item.quantity}x {formatRupiah(item.price)}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#2563EB]">
                          {formatRupiah(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="font-bold text-[#2563EB]">{formatRupiah(order.totalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
