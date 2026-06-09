'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { useSettings } from '@/hooks/use-settings';
import type { AppView } from '@/types';

// Landing Components
import HeroSection from '@/components/landing/HeroSection';
import BannerSlider from '@/components/landing/BannerSlider';
import PromoBanner from '@/components/landing/PromoBanner';
import FeaturedProducts from '@/components/landing/FeaturedProducts';
import Testimonials from '@/components/landing/Testimonials';
import OperatingHours from '@/components/landing/OperatingHours';

// Catalog Components
import CatalogPage from '@/components/catalog/CatalogPage';

// Tracking Components
import TrackingPage from '@/components/tracking/TrackingPage';

// Admin Components
import AdminLoginPage from '@/components/admin/AdminLoginPage';
import AdminDashboard from '@/components/admin/AdminDashboard';

import { Home as HomeIcon, BookOpen, Search, Coffee } from 'lucide-react';

const hashToView: Record<string, AppView> = {
  '': 'home',
  '#': 'home',
  '#katalog': 'catalog',
  '#lacak': 'tracking',
  '#zallhostinger': 'admin-login',
  '#zallhostinger/dashboard': 'admin-dashboard',
};

const navItems = [
  { view: 'home' as AppView, hash: '#', label: 'Home', icon: HomeIcon },
  { view: 'catalog' as AppView, hash: '#katalog', label: 'Katalog', icon: BookOpen },
  { view: 'tracking' as AppView, hash: '#lacak', label: 'Lacak', icon: Search },
];

export default function HomePage() {
  const currentView = useAppStore((s) => s.currentView);
  const setView = useAppStore((s) => s.setView);
  const isAdminLoggedIn = useAppStore((s) => s.isAdminLoggedIn);
  const seeded = useRef(false);

  // Seed data on mount
  useEffect(() => {
    if (!seeded.current) {
      seeded.current = true;
      fetch('/api/seed', { method: 'POST' }).catch(() => {});
    }
  }, []);

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';
      const view = hashToView[hash];

      if (view === 'admin-dashboard' && !isAdminLoggedIn) {
        setView('admin-login');
        return;
      }

      if (view) {
        setView(view);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setView, isAdminLoggedIn]);

  // Navigate when store view changes (for programmatic navigation)
  useEffect(() => {
    const reverseMap: Record<AppView, string> = {
      'home': '#',
      'catalog': '#katalog',
      'tracking': '#lacak',
      'admin-login': '#zallhostinger',
      'admin-dashboard': '#zallhostinger/dashboard',
    };
    const targetHash = reverseMap[currentView];
    if (targetHash !== window.location.hash) {
      window.location.hash = targetHash;
    }
  }, [currentView]);

  const isAdminView = currentView === 'admin-login' || currentView === 'admin-dashboard';

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroSection />
            <BannerSlider />
            <PromoBanner />
            <FeaturedProducts />
            <Testimonials />
            <OperatingHours />
            <Footer />
          </motion.div>
        )}

        {currentView === 'catalog' && (
          <motion.div
            key="catalog"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CatalogPage />
          </motion.div>
        )}

        {currentView === 'tracking' && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TrackingPage />
          </motion.div>
        )}

        {currentView === 'admin-login' && (
          <motion.div
            key="admin-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminLoginPage />
          </motion.div>
        )}

        {currentView === 'admin-dashboard' && (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminDashboard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation - Customer only */}
      {!isAdminView && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
          <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    window.location.hash = item.hash;
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                    isActive ? 'text-[#2563EB]' : 'text-gray-400'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-all ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

/* ===================== FOOTER ===================== */
function Footer() {
  const { settings } = useSettings(30000);

  return (
    <footer className="bg-gray-900 text-white pb-20 sm:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🧋</span>
              <h3 className="text-xl font-bold">{settings.business_name}</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {settings.business_tagline}. Menyajikan minuman berkualitas untuk pecinta kopi dan teh sejati.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Menu Cepat</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#katalog" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Katalog Menu
                </a>
              </li>
              <li>
                <a href="#lacak" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Lacak Pesanan
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Kontak</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📍 {settings.address}</p>
              <p>📱 {settings.whatsapp}</p>
              <p>🕐 Senin-Jumat: {settings.hours_weekday}</p>
              <p>🕐 Weekend: {settings.hours_weekend}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} {settings.business_name}. All rights reserved. Powered by UMKM Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}
