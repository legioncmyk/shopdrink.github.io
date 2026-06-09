'use client';

import { useEffect, useState } from 'react';
import type { Promo } from '@/types';

export default function PromoBanner() {
  const [promos, setPromos] = useState<Promo[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/promos');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setPromos(data);
        }
      } catch {
        // silently fail
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (promos.length === 0) return null;

  // Duplicate for infinite scroll
  const duplicated = [...promos, ...promos];

  return (
    <section className="w-full bg-gradient-to-r from-[#F97316] to-orange-500 overflow-hidden py-2.5">
      <div className="flex animate-marquee whitespace-nowrap">
        {duplicated.map((promo, i) => (
          <div key={`${promo.id}-${i}`} className="inline-flex items-center gap-3 mx-8">
            <span className="inline-flex items-center px-2.5 py-0.5 bg-white text-[#F97316] font-bold text-xs rounded-full">
              {promo.discount}
            </span>
            <span className="text-white font-medium text-sm">{promo.title}</span>
            <span className="text-white/60 mx-1">•</span>
          </div>
        ))}
      </div>
    </section>
  );
}
