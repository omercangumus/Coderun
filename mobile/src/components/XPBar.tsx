// XP ilerleme çubuğu — Flutter xp_progress_bar.dart'tan

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface XPBarProps {
  currentXp: number;
  xpNeeded: number;
  level: number;
  progressPercentage: number;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXp,
  xpNeeded,
  level,
  progressPercentage,
}) => {
  const clampedProgress = Math.min(Math.max(progressPercentage / 100, 0), 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv {level}</Text>
        </View>
        <Text style={styles.xpText}>
          {currentXp} / {xpNeeded} XP
        </Text>
      </View>
      <View style={styles.barBackground}>
        <View
          style={[styles.barFill, { width: `${clampedProgress * 100}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.4)',
  },
  levelText: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '700',
  },
  xpText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#2D2D44',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 4,
  },
});
