'use client';
import { useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';

export default function SettingsTitle() {
  const { settings } = useSettings(60000);

  useEffect(() => {
    document.title = settings.business_name || 'MinumanPro';
  }, [settings.business_name]);

  return null;
}
