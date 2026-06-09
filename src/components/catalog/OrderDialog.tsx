'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/use-settings';
import { CheckCircle2, Upload, ArrowLeft, ArrowRight, Loader2, ZoomIn, X } from 'lucide-react';
import type { Product } from '@/types';
import { useAppStore } from '@/store/use-app-store';

const formatRupiah = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

interface OrderDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderDialog({ product, open, onOpenChange }: OrderDialogProps) {
  const { toast } = useToast();
  const { settings } = useSettings(30000);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    notes: '',
    paymentMethod: 'dana' as 'dana' | 'qris',
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [qrisImage, setQrisImage] = useState('/images/qris.jpeg');
  const [qrisZoomed, setQrisZoomed] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setSuccess(false);
      setOrderNumber('');
      setPaymentProof(null);
      setPreviewUrl(null);
      setQuantity(1);
      setFormData({ customerName: '', phone: '', notes: '', paymentMethod: 'dana' });
    }
  }, [open]);

  // Fetch QRIS image from settings
  useEffect(() => {
    setQrisImage(settings.qris_image || '/images/qris.jpeg');
  }, [settings.qris_image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!product) return;
    if (!paymentProof) {
      toast({ title: 'Bukti diperlukan', description: 'Silakan upload bukti pembayaran terlebih dahulu', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      // Upload bukti pembayaran dulu
      toast({ title: 'Uploading...', description: 'Mengupload bukti pembayaran' });

      const uploadForm = new FormData();
      uploadForm.append('file', paymentProof);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadForm });

      if (!uploadRes.ok) {
        toast({ title: 'Upload Gagal', description: 'Gagal mengupload bukti pembayaran. Coba lagi.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const uploadData = await uploadRes.json();
      const proofUrl = uploadData.url;

      if (!proofUrl) {
        toast({ title: 'Upload Gagal', description: 'Bukti pembayaran kosong. Coba lagi.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      // Buat order setelah bukti berhasil diupload
      const orderData = {
        customerName: formData.customerName,
        phone: formData.phone,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        paymentProof: proofUrl,
        items: [
          {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity,
          },
        ],
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const order = await res.json();
        setOrderNumber(order.orderNumber);
        setSuccess(true);
        toast({ title: 'Pesanan Berhasil!', description: `Pesanan ${order.orderNumber} telah dibuat. Admin akan segera memverifikasi.` });
      } else {
        toast({ title: 'Gagal', description: 'Gagal membuat pesanan. Silakan coba lagi.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Terjadi kesalahan. Silakan coba lagi.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep1 = formData.customerName.trim() && formData.phone.trim();
  const canProceedStep2 = formData.paymentMethod;
  const canSubmit = step === 3;

  const stepVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -100 : 100, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  if (!product) return null;

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {success ? 'Pesanan Berhasil' : 'Pesan Minuman'}
          </DialogTitle>
          <DialogDescription>
            {success
              ? 'Pesanan Anda sedang diproses'
              : `Order ${product.name}`}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <motion.div
            className="text-center py-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-1">Pesanan Dibuat!</h3>
            <p className="text-gray-500 text-sm mb-2">Nomor Pesanan:</p>
            <p className="text-[#2563EB] font-bold text-lg mb-6">{orderNumber}</p>
            <Button
              className="bg-[#2563EB] hover:bg-[#1E40AF] text-white w-full"
              onClick={() => {
                onOpenChange(false);
                useAppStore.getState().setView('tracking');
              }}
            >
              Lacak Pesanan
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      s <= step ? 'bg-[#2563EB] text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-0.5 rounded-full ${s < step ? 'bg-[#2563EB]' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="space-y-4">
                    {/* Product Summary */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">{product.name}</h4>
                        <p className="text-[#2563EB] font-bold">{formatRupiah(product.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center text-sm font-bold hover:bg-gray-300"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center text-sm font-bold hover:bg-[#1E40AF]"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="customerName">Nama Pembeli *</Label>
                      <Input
                        id="customerName"
                        placeholder="Masukkan nama lengkap"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor HP *</Label>
                      <Input
                        id="phone"
                        placeholder="08xxxxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Catatan (Opsional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Contoh: less sugar, extra ice"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="mt-1.5"
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Pilih Metode Pembayaran</h4>

                    {/* DANA */}
                    <button
                      onClick={() => setFormData({ ...formData, paymentMethod: 'dana' })}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        formData.paymentMethod === 'dana'
                          ? 'border-[#2563EB] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#108EE9] flex items-center justify-center text-white font-bold text-sm">
                          D
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm">DANA</h5>
                          <p className="text-xs text-gray-500">Transfer via DANA</p>
                        </div>
                        <div className={`ml-auto w-5 h-5 rounded-full border-2 ${
                          formData.paymentMethod === 'dana' ? 'border-[#2563EB] bg-[#2563EB]' : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {formData.paymentMethod === 'dana' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                      {formData.paymentMethod === 'dana' && (
                        <div className="mt-3 p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Transfer ke:</p>
                          <p className="font-bold text-gray-900">{settings.dana_number}</p>
                          <p className="text-xs text-gray-500">a.n. {settings.dana_name}</p>
                        </div>
                      )}
                    </button>

                    <Separator />

                    {/* QRIS */}
                    <button
                      onClick={() => setFormData({ ...formData, paymentMethod: 'qris' })}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        formData.paymentMethod === 'qris'
                          ? 'border-[#2563EB] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
                          Q
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm">QRIS</h5>
                          <p className="text-xs text-gray-500">Scan QR Code untuk bayar</p>
                        </div>
                        <div className={`ml-auto w-5 h-5 rounded-full border-2 ${
                          formData.paymentMethod === 'qris' ? 'border-[#2563EB] bg-[#2563EB]' : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {formData.paymentMethod === 'qris' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                      {formData.paymentMethod === 'qris' && (
                        <div className="mt-3 p-3 bg-white rounded-lg text-center">
                          <motion.button
                            type="button"
                            onClick={() => setQrisZoomed(true)}
                            className="relative inline-block cursor-pointer rounded-xl overflow-hidden group"
                            whileTap={{ scale: 0.97 }}
                          >
                            <img src={qrisImage} alt="QRIS" className="w-48 h-48 mx-auto rounded-lg object-contain" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2.5 shadow-lg">
                                <ZoomIn className="w-5 h-5 text-gray-700" />
                              </div>
                            </div>
                          </motion.button>
                          <p className="text-xs text-gray-500 mt-2">Tap gambar untuk perbesar</p>
                        </div>
                      )}
                      {/* QRIS Zoomed Overlay */}
                      <AnimatePresence>
                        {qrisZoomed && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
                            onClick={() => setQrisZoomed(false)}
                          >
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                              className="relative max-w-lg w-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => setQrisZoomed(false)}
                                className="absolute -top-3 -right-3 z-10 bg-white text-gray-700 w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <img
                                src={qrisImage}
                                alt="QRIS - Perbesar"
                                className="w-full rounded-2xl shadow-2xl"
                              />
                              <p className="text-center text-white/70 text-xs mt-3">
                                Tap di luar gambar untuk menutup
                              </p>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Upload Bukti Pembayaran</h4>

                    <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Produk</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Jumlah</span>
                        <span className="font-medium">{quantity}x</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total</span>
                        <span className="font-bold text-[#2563EB]">{formatRupiah(product.price * quantity)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Pembayaran</span>
                        <span className="font-medium capitalize">{formData.paymentMethod}</span>
                      </div>
                    </div>

                    <div>
                      <Label>Foto Bukti Transfer *</Label>
                      <div className="mt-1.5">
                        {previewUrl ? (
                          <div className="relative rounded-xl overflow-hidden border border-gray-200">
                            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                            <button
                              onClick={() => { setPaymentProof(null); setPreviewUrl(null); }}
                              className="absolute top-2 right-2 bg-black/50 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs hover:bg-black/70"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#2563EB] hover:bg-blue-50/50 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Klik untuk upload foto</span>
                            <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5MB)</span>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <Button variant="outline" className="flex-1" onClick={goBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                </Button>
              )}
              {step < 3 ? (
                <Button
                  className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF] text-white"
                  onClick={goNext}
                  disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                >
                  Lanjut <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF] text-white"
                  onClick={handleSubmit}
                  disabled={loading || !paymentProof}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Memproses...' : 'Bayar Sekarang'}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
