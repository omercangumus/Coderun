// Rozet kartı — Flutter badge_card.dart'tan

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Badge } from '../types/gamification';

const BADGE_EMOJI: Record<string, string> = {
  first_lesson: '🎯',
  streak_7: '🔥',
  streak_30: '🏆',
  module_complete: '📚',
  perfect_score: '⭐',
  speed_learner: '⚡',
  default: '🎖️',
};

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const emoji = BADGE_EMOJI[badge.badge_type] ?? BADGE_EMOJI['default'];

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title} numberOfLines={1}>
        {badge.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {badge.description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
    padding: 16,
    alignItems: 'center',
    width: 140,
    gap: 6,
  },
  emoji: {
    fontSize: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    color: '#9CA3AF',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
