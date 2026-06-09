'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, MapPin, Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';

export default function OperatingHours() {
  const { settings, loading } = useSettings(30000);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-blue-50">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Informasi <span className="text-[#2563EB]">Toko</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">Kunjungi kami atau hubungi untuk pemesanan</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          ) : (
            <>
              {/* Weekday Hours */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5 sm:p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Jam Buka (Senin - Jumat)</h4>
                    <p className="text-gray-600 text-sm">{settings.hours_weekday || '08:00 - 22:00'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Weekend Hours */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5 sm:p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Jam Buka (Weekend)</h4>
                    <p className="text-gray-600 text-sm">{settings.hours_weekend || '09:00 - 23:00'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5 sm:p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Alamat</h4>
                    <p className="text-gray-600 text-sm">{settings.address || 'Jl. Minuman Premium No. 88, Jakarta Selatan'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5 sm:p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">WhatsApp</h4>
                    <p className="text-gray-600 text-sm">{settings.whatsapp || '085169307731'}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
