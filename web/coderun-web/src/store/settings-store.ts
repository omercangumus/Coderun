import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'light' | 'dark' | 'coderun-comfort';

interface SettingsState {
  hapticsEnabled: boolean;
  toggleHaptics: () => void;
  setHaptics: (enabled: boolean) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hapticsEnabled: true,
      toggleHaptics: () => set((s) => ({ hapticsEnabled: !s.hapticsEnabled })),
      setHaptics: (enabled) => set({ hapticsEnabled: enabled }),
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'coderun-settings',
    }
  )
);
