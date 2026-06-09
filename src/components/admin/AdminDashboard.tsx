'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/store/use-app-store';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  LayoutDashboard, ShoppingBag, Package, Percent, Image, Settings,
  LogOut, Menu, Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  Upload, Loader2, TrendingUp, DollarSign, Eye, X, RefreshCw, Search,
  CheckCircle2, XCircle, ZoomIn, Download,
} from 'lucide-react';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types';
import type { Order, OrderStatus, Product, Banner as BannerType, Promo, AdminTab } from '@/types';

const formatRupiah = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

const statusOptions: OrderStatus[] = [
  'menunggu_pembayaran',
  'menunggu_verifikasi',
  'sedang_diproses',
  'siap_diambil',
  'sedang_diantar',
  'selesai',
  'ditolak',
];

const categories = ['Kopi & Teh', 'Smoothie', 'Milk Tea', 'Jus Segar', 'Milkshake'];
const stockOptions = ['available', 'limited', 'out_of_stock'];

export default function AdminDashboard() {
  const adminTab = useAppStore((s) => s.adminTab);
  const setAdminTab = useAppStore((s) => s.setAdminTab);
  const logout = useAppStore((s) => s.logout);
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as AdminTab, label: 'Pesanan', icon: ShoppingBag },
    { id: 'products' as AdminTab, label: 'Produk', icon: Package },
    { id: 'promos' as AdminTab, label: 'Promo', icon: Percent },
    { id: 'banners' as AdminTab, label: 'Banner', icon: Image },
    { id: 'settings' as AdminTab, label: 'Pengaturan', icon: Settings },
  ];

  const handleTabChange = (tab: AdminTab) => {
    setAdminTab(tab);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-screen">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#2563EB]">🧋 MinumanPro</h2>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>
        <ScrollArea className="flex-1 py-3 px-3">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  adminTab === item.id
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-[#2563EB]">🧋 MinumanPro</h2>
                <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
              </div>
              <nav className="p-3 space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      adminTab === item.id
                        ? 'bg-[#2563EB] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
                <Separator className="my-2" />
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </SheetContent>
          </Sheet>
          <h2 className="font-bold text-gray-900">Admin Panel</h2>
        </div>
        <Badge variant="secondary" className="text-xs">{sidebarItems.find(i => i.id === adminTab)?.label}</Badge>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
          <motion.div
            key={adminTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {adminTab === 'dashboard' && <DashboardTab />}
            {adminTab === 'orders' && <OrdersTab />}
            {adminTab === 'products' && <ProductsTab />}
            {adminTab === 'promos' && <PromosTab />}
            {adminTab === 'banners' && <BannersTab />}
            {adminTab === 'settings' && <SettingsTab />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/* ===================== DASHBOARD TAB ===================== */
function DashboardTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/statistics');
      if (res.ok) setStats(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading || !stats) {
    return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-64" /><Skeleton className="h-48" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pendapatan Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatRupiah(stats.todayRevenue)}</p>
                  <p className="text-xs text-gray-400 mt-1">{stats.todayOrders} pesanan</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#2563EB]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pendapatan Bulan Ini</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatRupiah(stats.monthRevenue)}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Pesanan</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Penjualan 7 Hari Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [formatRupiah(value), 'Pendapatan']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)' }}
                />
                <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Best Selling */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Produk Terlaris</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.bestSelling.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Belum ada data penjualan</p>
          ) : (
            <div className="space-y-3">
              {stats.bestSelling.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.qty} terjual</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2563EB]">{formatRupiah(item.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ===================== ORDERS TAB ===================== */
function OrdersTab() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [searchOrder, setSearchOrder] = useState('');
  const [proofCacheBuster, setProofCacheBuster] = useState(0);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        setOrders(await res.json());
        setProofCacheBuster((c) => c + 1);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const proofUrl = (url: string) => `${url}${url.includes('?') ? '&' : '?'}v=${proofCacheBuster}`;

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast({ title: 'Status Diperbarui', description: `Status pesanan diubah` });
        fetchOrders();
      } else {
        toast({ title: 'Error', description: 'Gagal update status', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Gagal update status', variant: 'destructive' });
    }
  };

  const verifyPayment = async (order: Order) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status: 'sedang_diproses' }),
      });
      if (res.ok) {
        toast({ title: 'Pembayaran Diverifikasi', description: `Order ${order.orderNumber} sedang diproses` });
        fetchOrders();
      } else {
        toast({ title: 'Error', description: 'Gagal verifikasi', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Gagal verifikasi', variant: 'destructive' });
    }
  };

  const rejectPayment = async (order: Order) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status: 'ditolak' }),
      });
      if (res.ok) {
        toast({ title: 'Pembayaran Ditolak', description: `Order ${order.orderNumber} ditolak` });
        fetchOrders();
      } else {
        toast({ title: 'Error', description: 'Gagal menolak', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Gagal menolak', variant: 'destructive' });
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(searchOrder.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchOrder.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Pesanan</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari pesanan..."
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              className="pl-9 h-9 w-48"
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : filteredOrders.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada pesanan</p>
          </CardContent>
        </Card>
      ) : (
        // Mobile: Card view
        <div className="space-y-3 lg:hidden">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-[#2563EB] font-bold">{order.orderNumber}</p>
                    <p className="font-semibold text-sm text-gray-900 mt-0.5">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.phone}</p>
                  </div>
                  <Badge className={`text-xs ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600">
                  {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm">{formatRupiah(order.totalPrice)}</p>
                  {order.paymentProof ? (
                    <button onClick={() => setProofImage(order.paymentProof)} className="inline-flex items-center gap-1 text-xs text-[#2563EB] font-medium hover:underline">
                      <Eye className="w-3.5 h-3.5" /> Lihat Bukti
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">Belum ada bukti</span>
                  )}
                </div>
                {order.paymentProof && (
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <div className="relative">
                      <img src={proofUrl(order.paymentProof)} alt="bukti" className="w-full h-32 object-contain cursor-pointer" onClick={() => setProofImage(order.paymentProof)} onError={(e) => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).alt = 'Gambar tidak dapat dimuat'; }} />
                    </div>
                    <div className="flex items-center justify-center gap-3 py-2 px-3">
                      <button onClick={() => setProofImage(order.paymentProof)} className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#2563EB] transition-colors">
                        <ZoomIn className="w-3.5 h-3.5" /> Perbesar
                      </button>
                      <a href={proofUrl(order.paymentProof)} download={`bukti-${order.orderNumber}.png`} className="flex items-center gap-1 text-xs text-gray-600 hover:text-green-600 transition-colors">
                        <Download className="w-3.5 h-3.5" /> Simpan
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">{ORDER_STATUS_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {order.status === 'menunggu_verifikasi' && (
                    <>
                      <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white text-xs" onClick={() => verifyPayment(order)}>
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verifikasi
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-red-600 hover:bg-red-50 text-xs" onClick={() => rejectPayment(order)}>
                        <XCircle className="w-3 h-3 mr-1" /> Tolak
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )} 

      {/* Desktop: Table view */}
      {filteredOrders.length > 0 && (
        <Card className="border-0 shadow-sm overflow-hidden hidden lg:block">
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">No Order</TableHead>
                  <TableHead className="text-xs">Nama</TableHead>
                  <TableHead className="text-xs">HP</TableHead>
                  <TableHead className="text-xs">Produk</TableHead>
                  <TableHead className="text-xs">Total</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Bukti</TableHead>
                  <TableHead className="text-xs">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-xs font-mono">{order.orderNumber}</TableCell>
                    <TableCell className="text-xs font-medium">{order.customerName}</TableCell>
                    <TableCell className="text-xs text-gray-500">{order.phone}</TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate">{order.items.map((i) => `${i.productName}(${i.quantity})`).join(', ')}</TableCell>
                    <TableCell className="text-xs font-semibold">{formatRupiah(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.paymentProof ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={proofUrl(order.paymentProof)}
                            alt="bukti"
                            className="w-14 h-14 rounded-lg object-cover border cursor-pointer hover:ring-2 hover:ring-[#2563EB] transition-all"
                            onClick={() => setProofImage(order.paymentProof)}
                            onError={(e) => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).alt = '?'; }}
                          />
                          <div className="flex flex-col gap-0.5">
                            <button onClick={() => setProofImage(order.paymentProof)} className="text-gray-400 hover:text-[#2563EB] transition-colors" title="Perbesar">
                              <ZoomIn className="w-4 h-4" />
                            </button>
                            <a href={proofUrl(order.paymentProof)} download={`bukti-${order.orderNumber}.png`} className="text-gray-400 hover:text-green-600 transition-colors" title="Simpan Gambar">
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Belum ada</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {order.status === 'menunggu_verifikasi' && (
                          <>
                            <Button size="sm" className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => verifyPayment(order)}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 px-2 text-red-600 hover:bg-red-50" onClick={() => rejectPayment(order)}>
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                        <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                          <SelectTrigger className="h-7 text-xs w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">{ORDER_STATUS_LABELS[s]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      )}

      {/* Proof Image Zoom Dialog */}
      {proofImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 flex flex-col items-center justify-center p-4"
          onClick={() => setProofImage(null)}
        >
          <div
            className="relative max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setProofImage(null)}
              className="absolute -top-3 -right-3 z-10 bg-white text-gray-700 w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={proofUrl(proofImage)}
              alt="Bukti Pembayaran"
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="flex items-center justify-center gap-4 mt-3">
              <a
                href={proofUrl(proofImage)}
                download={`bukti-pembayaran.png`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 bg-white text-gray-800 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Simpan Gambar
              </a>
            </div>
            <p className="text-center text-white/70 text-xs mt-3">Tap di luar gambar untuk menutup</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== PRODUCTS TAB ===================== */
function ProductsTab() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', image: '', stockStatus: 'available', category: 'Kopi & Teh', featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imgCacheBuster, setImgCacheBuster] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        setProducts(await res.json());
        setImgCacheBuster((c) => c + 1);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 10000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: '', description: '', price: '', image: '', stockStatus: 'available', category: 'Kopi & Teh', featured: false });
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name, description: p.description, price: String(p.price),
      image: p.image, stockStatus: p.stockStatus, category: p.category, featured: p.featured,
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        setForm({ ...form, image: data.url });
        toast({ title: 'Upload Berhasil', description: 'Gambar berhasil diupload' });
      } else {
        toast({ title: 'Upload Gagal', description: 'Gagal mengupload gambar', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Upload gagal', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast({ title: 'Error', description: 'Nama dan harga wajib diisi', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const data = { ...form, price: parseFloat(form.price) };
      if (editProduct) {
        const res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editProduct.id, ...data }),
        });
        if (res.ok) {
          toast({ title: 'Berhasil', description: 'Produk diperbarui' });
        } else {
          const errData = await res.json().catch(() => ({}));
          toast({ title: 'Error', description: errData.error || 'Gagal memperbarui produk', variant: 'destructive' });
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          toast({ title: 'Berhasil', description: 'Produk ditambahkan' });
        } else {
          const errData = await res.json().catch(() => ({}));
          toast({ title: 'Error', description: errData.error || 'Gagal menambahkan produk', variant: 'destructive' });
        }
      }
      setDialogOpen(false);
      fetchProducts();
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/products?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Berhasil', description: 'Produk dihapus' });
        fetchProducts();
      } else {
        toast({ title: 'Error', description: 'Gagal menghapus produk', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' });
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
        <Button className="bg-[#2563EB] hover:bg-[#1E40AF] text-white" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Tambah Produk
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <img src={`${p.image}${p.image.includes('?') ? '&' : '?'}cb=${imgCacheBuster}`} alt={p.name} className="w-16 h-16 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.category}</p>
                    <p className="text-sm font-bold text-[#2563EB]">{formatRupiah(p.price)}</p>
                    <Badge className={`text-xs mt-1 ${
                      p.stockStatus === 'available' ? 'bg-green-100 text-green-700' :
                      p.stockStatus === 'limited' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {p.stockStatus === 'available' ? 'Tersedia' : p.stockStatus === 'limited' ? 'Terbatas' : 'Habis'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 h-8" onClick={() => openEdit(p)}>
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-red-600 hover:bg-red-50" onClick={() => setDeleteId(p.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProduct ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Produk *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" placeholder="Nama produk" />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Harga (Rp) *</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Kategori</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Stok</Label>
                <Select value={form.stockStatus} onValueChange={(v) => setForm({ ...form, stockStatus: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {stockOptions.map((s) => <SelectItem key={s} value={s}>{s === 'available' ? 'Tersedia' : s === 'limited' ? 'Terbatas' : 'Habis'}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                <Label className="text-sm">Featured</Label>
              </div>
            </div>
            <div>
              <Label>Gambar</Label>
              <div className="mt-1 flex items-center gap-3">
                {form.image && <img src={form.image} alt="preview" className="w-16 h-16 rounded-lg object-cover" />}
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#2563EB] text-sm text-gray-500">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-2" placeholder="URL gambar" />
            </div>
            <Button className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
            <AlertDialogDescription>Produk yang dihapus tidak dapat dikembalikan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ===================== PROMOS TAB ===================== */
function PromosTab() {
  const { toast } = useToast();
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPromo, setEditPromo] = useState<Promo | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', discount: '', image: '', active: true });
  const [saving, setSaving] = useState(false);

  // Admin mode: fetch ALL promos including inactive
  const fetchPromos = useCallback(async () => {
    try {
      const res = await fetch('/api/promos?admin=true');
      if (res.ok) setPromos(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
    const interval = setInterval(fetchPromos, 10000);
    return () => clearInterval(interval);
  }, [fetchPromos]);

  const openAdd = () => {
    setEditPromo(null);
    setForm({ title: '', description: '', discount: '', image: '', active: true });
    setDialogOpen(true);
  };

  const openEdit = (p: Promo) => {
    setEditPromo(p);
    setForm({ title: p.title, description: p.description, discount: p.discount, image: p.image, active: p.active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast({ title: 'Error', description: 'Judul wajib diisi', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      if (editPromo) {
        const res = await fetch('/api/promos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editPromo.id, ...form }),
        });
        if (res.ok) {
          toast({ title: 'Berhasil', description: 'Promo diperbarui' });
        } else {
          const errData = await res.json().catch(() => ({}));
          toast({ title: 'Error', description: errData.error || 'Gagal memperbarui promo', variant: 'destructive' });
        }
      } else {
        const res = await fetch('/api/promos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          toast({ title: 'Berhasil', description: 'Promo ditambahkan' });
        } else {
          const errData = await res.json().catch(() => ({}));
          toast({ title: 'Error', description: errData.error || 'Gagal menambahkan promo', variant: 'destructive' });
        }
      }
      setDialogOpen(false);
      fetchPromos();
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/promos?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Berhasil', description: 'Promo dihapus' });
        fetchPromos();
      } else {
        toast({ title: 'Error', description: 'Gagal menghapus promo', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' });
    }
    setDeleteId(null);
  };

  const toggleActive = async (promo: Promo) => {
    try {
      const res = await fetch('/api/promos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promo.id, active: !promo.active }),
      });
      if (res.ok) {
        toast({ title: promo.active ? 'Promo Dinonaktifkan' : 'Promo Diaktifkan' });
        fetchPromos();
      } else {
        toast({ title: 'Error', description: 'Gagal mengubah status', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Gagal mengubah status', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Promo</h1>
        <Button className="bg-[#2563EB] hover:bg-[#1E40AF] text-white" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Tambah Promo
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="space-y-3">
          {promos.map((p) => (
            <Card key={p.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <img src={p.image} alt={p.title} className="w-14 h-14 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900">{p.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{p.description}</p>
                  <Badge className="bg-orange-100 text-orange-700 text-xs mt-1">{p.discount}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={p.active} onCheckedChange={() => toggleActive(p)} />
                  <Button variant="outline" size="sm" className="h-8" onClick={() => openEdit(p)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-red-600 hover:bg-red-50" onClick={() => setDeleteId(p.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editPromo ? 'Edit Promo' : 'Tambah Promo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Judul *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={2} />
            </div>
            <div>
              <Label>Diskon</Label>
              <Input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="mt-1" placeholder="20%" />
            </div>
            <div>
              <Label>Gambar URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label className="text-sm">Aktif</Label>
            </div>
            <Button className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Promo?</AlertDialogTitle>
            <AlertDialogDescription>Promo yang dihapus tidak dapat dikembalikan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ===================== BANNERS TAB ===================== */
function BannersTab() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editBanner, setEditBanner] = useState<BannerType | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ image: '', title: '', linkText: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editUploading, setEditUploading] = useState(false);

  // Admin mode: fetch ALL banners including inactive
  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch('/api/banners?admin=true');
      if (res.ok) setBanners(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
    const interval = setInterval(fetchBanners, 10000);
    return () => clearInterval(interval);
  }, [fetchBanners]);

  const openEditBanner = (b: BannerType) => {
    setEditBanner(b);
    setEditForm({ image: b.image, title: b.title, linkText: b.linkText });
    setEditDialogOpen(true);
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        setEditForm({ ...editForm, image: data.url });
        toast({ title: 'Upload Berhasil', description: 'Gambar banner berhasil diupload' });
      } else {
        toast({ title: 'Upload Gagal', description: 'Gagal mengupload gambar', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Upload gagal', variant: 'destructive' });
    } finally {
      setEditUploading(false);
    }
  };

  const handleEditSave = async () => {
    if (!editBanner) return;
    setEditSaving(true);
    try {
      const res = await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editBanner.id, ...editForm }),
      });
      if (res.ok) {
        toast({ title: 'Berhasil', description: 'Banner diperbarui' });
        setEditDialogOpen(false);
        fetchBanners();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast({ title: 'Error', description: errData.error || 'Gagal memperbarui banner', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Gagal memperbarui banner', variant: 'destructive' });
    } finally {
      setEditSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        const title = prompt('Masukkan judul banner:') || 'Banner Baru';
        const linkText = prompt('Masukkan teks tombol:', 'Pesan Sekarang') || 'Pesan Sekarang';
        const createRes = await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: data.url,
            title,
            linkText,
            sortOrder: banners.length + 1,
            active: true,
          }),
        });
        if (createRes.ok) {
          toast({ title: 'Berhasil', description: 'Banner ditambahkan' });
          fetchBanners();
        } else {
          toast({ title: 'Error', description: 'Gagal menambahkan banner', variant: 'destructive' });
        }
      } else {
        toast({ title: 'Error', description: 'Upload gagal', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Upload gagal', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/banners?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Berhasil', description: 'Banner dihapus' });
        fetchBanners();
      } else {
        toast({ title: 'Error', description: 'Gagal menghapus banner', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' });
    }
    setDeleteId(null);
  };

  const moveOrder = async (banner: BannerType, direction: 'up' | 'down') => {
    const idx = banners.findIndex((b) => b.id === banner.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= banners.length) return;
    const swapBanner = banners[swapIdx];
    await fetch('/api/banners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: banner.id, sortOrder: swapBanner.sortOrder }),
    });
    await fetch('/api/banners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: swapBanner.id, sortOrder: banner.sortOrder }),
    });
    fetchBanners();
  };

  const toggleActive = async (banner: BannerType) => {
    try {
      const res = await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: banner.id, active: !banner.active }),
      });
      if (res.ok) {
        toast({ title: banner.active ? 'Banner Dinonaktifkan' : 'Banner Diaktifkan' });
        fetchBanners();
      } else {
        toast({ title: 'Error', description: 'Gagal mengubah status', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Gagal mengubah status', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Banner</h1>
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg cursor-pointer hover:bg-[#1E40AF] text-sm font-medium">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload Banner'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="space-y-3">
          {banners.map((b, i) => (
            <Card key={b.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveOrder(b, 'up')} disabled={i === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveOrder(b, 'down')} disabled={i === banners.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <img src={b.image} alt={b.title} className="w-24 h-16 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{b.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">Urutan: {b.sortOrder}</Badge>
                    {!b.active && <Badge className="text-xs bg-red-100 text-red-700">Nonaktif</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8" onClick={() => openEditBanner(b)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Switch checked={b.active} onCheckedChange={() => toggleActive(b)} />
                  <Button variant="outline" size="sm" className="h-8 text-red-600 hover:bg-red-50" onClick={() => setDeleteId(b.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Banner?</AlertDialogTitle>
            <AlertDialogDescription>Banner yang dihapus tidak dapat dikembalikan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Banner Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Ubah gambar, judul, dan teks tombol banner.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Gambar Saat Ini</Label>
              <div className="mt-1.5">
                {editForm.image && (
                  <img src={editForm.image} alt="Banner preview" className="w-full h-40 rounded-xl object-cover" />
                )}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#2563EB] text-sm text-gray-500">
                  <Upload className="w-4 h-4" />
                  {editUploading ? 'Uploading...' : 'Upload Gambar Baru'}
                  <input type="file" accept="image/*" onChange={handleEditImageUpload} className="hidden" disabled={editUploading} />
                </label>
              </div>
              <Input
                value={editForm.image}
                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                className="mt-2"
                placeholder="URL gambar"
              />
            </div>
            <div>
              <Label>Judul Banner</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="mt-1"
                placeholder="Judul banner"
              />
            </div>
            <div>
              <Label>Teks Tombol</Label>
              <Input
                value={editForm.linkText}
                onChange={(e) => setEditForm({ ...editForm, linkText: e.target.value })}
                className="mt-1"
                placeholder="Pesan Sekarang"
              />
            </div>
            <Button
              className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white"
              onClick={handleEditSave}
              disabled={editSaving}
            >
              {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {editSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ===================== SETTINGS TAB ===================== */
function SettingsTab() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) setSettings(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    const interval = setInterval(fetchSettings, 10000);
    return () => clearInterval(interval);
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleQrisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...settings, qris_image: data.url });
        toast({ title: 'QRIS Diupload', description: 'Gambar QRIS berhasil diupload' });
      } else {
        toast({ title: 'Upload Gagal', description: 'Gagal mengupload gambar QRIS', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Upload gagal', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast({ title: 'Berhasil', description: 'Pengaturan disimpan' });
        fetchSettings();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast({ title: 'Error', description: errData.error || 'Gagal menyimpan pengaturan', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-96" />;
  }

  const fields = [
    { key: 'business_name', label: 'Nama Bisnis' },
    { key: 'business_tagline', label: 'Tagline' },
    { key: 'dana_number', label: 'Nomor DANA' },
    { key: 'dana_name', label: 'Nama DANA' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'address', label: 'Alamat' },
    { key: 'hours_weekday', label: 'Jam Buka (Senin-Jumat)' },
    { key: 'hours_weekend', label: 'Jam Buka (Weekend)' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-5 sm:p-6 space-y-5">
          {fields.map((field) => (
            <div key={field.key}>
              <Label className="text-sm">{field.label}</Label>
              {field.key === 'address' ? (
                <Textarea
                  value={settings[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              ) : (
                <Input
                  value={settings[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="mt-1"
                />
              )}
            </div>
          ))}

          <Separator />

          <div>
            <Label className="text-sm">QRIS Image</Label>
            <div className="mt-1.5 flex items-center gap-3">
              {settings.qris_image && (
                <img src={settings.qris_image} alt="QRIS Preview" className="w-20 h-20 rounded-lg object-cover" />
              )}
              <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#2563EB] text-sm text-gray-500">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload QRIS'}
                <input type="file" accept="image/*" onChange={handleQrisUpload} className="hidden" />
              </label>
            </div>
            <Input
              value={settings.qris_image || ''}
              onChange={(e) => handleChange('qris_image', e.target.value)}
              className="mt-2"
              placeholder="/images/qris.png"
            />
          </div>

          <Button
            className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
