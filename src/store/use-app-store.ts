import { create } from 'zustand';
import type { AppView, AdminTab } from '@/types';

interface AppState {
  currentView: AppView;
  adminTab: AdminTab;
  isAdminLoggedIn: boolean;
  setView: (view: AppView) => void;
  setAdminTab: (tab: AdminTab) => void;
  setAdminLoggedIn: (logged: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  adminTab: 'dashboard',
  isAdminLoggedIn: false,
  setView: (view) => set({ currentView: view }),
  setAdminTab: (tab) => set({ adminTab: tab }),
  setAdminLoggedIn: (logged) => set({ isAdminLoggedIn: logged }),
  logout: () => set({ isAdminLoggedIn: false, currentView: 'home', adminTab: 'dashboard' }),
}));
