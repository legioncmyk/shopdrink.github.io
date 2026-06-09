'use client';
import { useState, useEffect, useCallback } from 'react';

interface SiteSettings {
  business_name: string;
  business_tagline: string;
  dana_number: string;
  dana_name: string;
  whatsapp: string;
  address: string;
  hours_weekday: string;
  hours_weekend: string;
  qris_image: string;
  [key: string]: string;
}

export function useSettings(pollInterval = 30000) {
  const [settings, setSettings] = useState<SiteSettings>({
    business_name: 'MinumanPro',
    business_tagline: 'Premium Drinks for Premium Moments',
    dana_number: '085169307731',
    dana_name: 'ZALLHOSTINGER',
    whatsapp: '085169307731',
    address: 'Jl. Minuman Premium No. 88, Jakarta Selatan',
    hours_weekday: '08:00-22:00',
    hours_weekend: '09:00-23:00',
    qris_image: '/images/qris.jpeg',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    const interval = setInterval(fetchSettings, pollInterval);
    return () => clearInterval(interval);
  }, [fetchSettings, pollInterval]);

  return { settings, loading, refetch: fetchSettings };
}
