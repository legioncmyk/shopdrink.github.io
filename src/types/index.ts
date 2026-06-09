export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stockStatus: 'available' | 'limited' | 'out_of_stock';
  category: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  notes: string;
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: 'dana' | 'qris';
  paymentProof: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | 'menunggu_pembayaran'
  | 'menunggu_verifikasi'
  | 'sedang_diproses'
  | 'siap_diambil'
  | 'sedang_diantar'
  | 'selesai'
  | 'ditolak';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  menunggu_pembayaran: 'Menunggu Pembayaran',
  menunggu_verifikasi: 'Menunggu Verifikasi',
  sedang_diproses: 'Sedang Diproses',
  siap_diambil: 'Siap Diambil',
  sedang_diantar: 'Selesai',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  menunggu_pembayaran: 'bg-yellow-100 text-yellow-800',
  menunggu_verifikasi: 'bg-blue-100 text-blue-800',
  sedang_diproses: 'bg-purple-100 text-purple-800',
  siap_diambil: 'bg-green-100 text-green-800',
  sedang_diantar: 'bg-sky-100 text-sky-800',
  selesai: 'bg-emerald-100 text-emerald-800',
  ditolak: 'bg-red-100 text-red-800',
};

export interface Banner {
  id: string;
  image: string;
  title: string;
  linkText: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  active: boolean;
  createdAt: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
}

export type AppView =
  | 'home'
  | 'catalog'
  | 'tracking'
  | 'admin-login'
  | 'admin-dashboard';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'payments'
  | 'products'
  | 'promos'
  | 'banners'
  | 'settings';
