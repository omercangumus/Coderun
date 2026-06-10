// XP ilerleme çubuğu — Flutter xp_progress_bar.dart'tan

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
        {clampedProgress > 0 && (
          <LinearGradient
            colors={['#A78BFA', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.barFill, { width: `${clampedProgress * 100}%` }]}
          />
        )}
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
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(124,58,237,0.4)',
  },
  levelText: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '800',
  },
  xpText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
  },
  barBackground: {
    height: 10,
    backgroundColor: '#1F1F35',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
});

