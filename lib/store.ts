import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  language: 'en' | 'id';
  setLanguage: (lang: 'en' | 'id') => void;
  trialMode: boolean;
  setTrialMode: (active: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      trialMode: false,
      setTrialMode: (active) => set({ trialMode: active }),
    }),
    {
      name: 'streamhib-app-store',
    }
  )
);