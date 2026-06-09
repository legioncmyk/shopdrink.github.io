'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { useSettings } from '@/hooks/use-settings';

const floatingIcons = [
  { emoji: '🧋', x: '10%', y: '20%', delay: 0, size: 'text-3xl' },
  { emoji: '☕', x: '80%', y: '15%', delay: 0.5, size: 'text-4xl' },
  { emoji: '🥤', x: '70%', y: '70%', delay: 1, size: 'text-3xl' },
  { emoji: '🍹', x: '15%', y: '65%', delay: 1.5, size: 'text-4xl' },
  { emoji: '🧊', x: '90%', y: '45%', delay: 2, size: 'text-2xl' },
  { emoji: '🧋', x: '50%', y: '80%', delay: 0.8, size: 'text-2xl' },
  { emoji: '☕', x: '25%', y: '40%', delay: 1.2, size: 'text-2xl' },
];

export default function HeroSection() {
  const setView = useAppStore((s) => s.setView);
  const { settings } = useSettings(30000);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#1E40AF]" />

      {/* Particle / Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((icon, i) => (
          <motion.span
            key={i}
            className={`absolute ${icon.size} select-none opacity-20 md:opacity-30`}
            style={{ left: icon.x, top: icon.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: icon.delay,
              ease: 'easeInOut',
            }}
          >
            {icon.emoji}
          </motion.span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Logo / Brand */}
          <motion.div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-lg">🧋</span>
            <span className="text-white/90 text-sm font-medium">Premium UMKM Drinks</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            <span className="block bg-gradient-to-r from-[#60A5FA] to-white bg-clip-text text-transparent">
              {settings.business_name}
            </span>
          </h1>

          {/* Tagline */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {settings.business_tagline}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <button
              onClick={() => setView('catalog')}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2563EB] font-bold text-lg rounded-full shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:shadow-blue-900/40 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>Pesan Sekarang</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 50L48 45C96 40 192 30 288 33C384 36 480 52 576 55C672 58 768 48 864 42C960 36 1056 34 1152 38C1248 42 1344 52 1392 57L1440 62V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
