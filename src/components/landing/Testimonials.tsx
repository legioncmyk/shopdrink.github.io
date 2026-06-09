'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Amelia',
    rating: 5,
    text: 'Matcha Latte-nya enak banget! Porsinya pas, manisnya juga pas. Pasti order lagi deh!',
    initial: 'S',
    color: 'bg-blue-500',
  },
  {
    name: 'Budi Santoso',
    rating: 5,
    text: 'Thai Tea-nya juara! Sama seperti yang di Thailand. Harga juga terjangkau untuk kualitas sepremium ini.',
    initial: 'B',
    color: 'bg-orange-500',
  },
  {
    name: 'Diana Putri',
    rating: 4,
    text: 'Taro Milk Tea-nya creamy banget dan boba-nya kenyal. Suka banget! Cuma pengiriman bisa lebih cepat.',
    initial: 'D',
    color: 'bg-purple-500',
  },
  {
    name: 'Reza Firmansyah',
    rating: 5,
    text: 'Cold Brew Original-nya smooth sekali, ga pahit. Cocok buat teman ngoding. Highly recommended!',
    initial: 'R',
    color: 'bg-emerald-500',
  },
  {
    name: 'Mega Lestari',
    rating: 5,
    text: 'Caramel Frappuccino-nya the best! Whipped cream-nya banyak, caramel sauce-nya merata. Love it!',
    initial: 'M',
    color: 'bg-pink-500',
  },
  {
    name: 'Ahmad Rizky',
    rating: 4,
    text: 'Smoothie-nya segar, bahan-bahannya terasa premium. Tempat nongkrong yang nyaman juga.',
    initial: 'A',
    color: 'bg-teal-500',
  },
];

export default function Testimonials() {
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
          Kata <span className="text-[#2563EB]">Pelanggan</span>
        </h2>
        <p className="text-gray-500 text-sm sm:text-base">Apa kata mereka tentang MinumanPro</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.initial}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{t.name}</h4>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`w-3.5 h-3.5 ${j < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
