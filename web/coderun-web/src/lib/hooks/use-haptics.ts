'use client';

import { useCallback } from 'react';
import { useSettingsStore } from '@/store/settings-store';

/**
 * Mobil cihazlarda titreşim (haptic feedback) için hook.
 * navigator.vibrate() kulllanır; masaüstü ve desteklemeyen cihazlarda sessizce geçer.
 */
export function useHaptics() {
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (!hapticsEnabled) return;
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    },
    [hapticsEnabled]
  );

  /** Doğru cevap için kısa bir titreşim */
  const vibrateSuccess = useCallback(() => vibrate([40, 30, 40]), [vibrate]);

  /** Yanlış cevap için uzun titreşim */
  const vibrateError = useCallback(() => vibrate([80, 40, 80, 40, 160]), [vibrate]);

  /** Seçim yapılınca kısa dokunuş hissi */
  const vibrateTap = useCallback(() => vibrate(18), [vibrate]);

  return { vibrate, vibrateSuccess, vibrateError, vibrateTap };
}
