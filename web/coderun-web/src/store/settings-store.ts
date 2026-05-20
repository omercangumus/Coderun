import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  hapticsEnabled: boolean;
  toggleHaptics: () => void;
  setHaptics: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hapticsEnabled: true,
      toggleHaptics: () => set((s) => ({ hapticsEnabled: !s.hapticsEnabled })),
      setHaptics: (enabled) => set({ hapticsEnabled: enabled }),
    }),
    {
      name: 'coderun-settings',
    }
  )
);
