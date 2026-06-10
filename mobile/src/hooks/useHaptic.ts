// Haptic feedback hook — Flutter HapticFeedback'ten

import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

export const useHaptic = () => {
  const lightImpact = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const mediumImpact = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const heavyImpact = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const successNotification = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const errorNotification = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  const warningNotification = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, []);

  return {
    lightImpact,
    mediumImpact,
    heavyImpact,
    successNotification,
    errorNotification,
    warningNotification,
  };
};
