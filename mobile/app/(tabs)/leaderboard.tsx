// Liderlik tablosu — Flutter leaderboard_tab.dart'tan

import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../../src/api/gamification';
import type { LeaderboardEntry } from '../../src/types/gamification';
import { SkeletonCard } from '../../src/components/LoadingSkeleton';
import { useAuthStore } from '../../src/store/authStore';

function rankEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

function LeaderboardRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        isCurrentUser && styles.currentUserRow,
      ]}
    >
      <Text style={styles.rankText}>{rankEmoji(entry.rank)}</Text>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {entry.username[0]?.toUpperCase() ?? '?'}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username} numberOfLines={1}>
          {entry.username}
          {isCurrentUser && ' (Sen)'}
        </Text>
        <Text style={styles.userMeta}>
          Lv {entry.level} • {entry.streak}🔥
        </Text>
      </View>
      <View style={styles.xpBadge}>
        <Text style={styles.xpValue}>{entry.weekly_xp}</Text>
        <Text style={styles.xpLabel}>XP</Text>
      </View>
    </View>
  );
}

export default function LeaderboardScreen() {
  const user = useAuthStore((s) => s.user);
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1A" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Haftalık Sıralama</Text>
        <Text style={styles.headerSub}>Bu haftanın en iyi öğrencileri</Text>
      </View>

      {data?.user_rank && (
        <View style={styles.myRankCard}>
          <Text style={styles.myRankLabel}>Benim Sıramım</Text>
          <Text style={styles.myRankValue}>#{data.user_rank}</Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#7C3AED"
          />
        }
      >
        {isLoading && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} height={64} />
            ))}
          </>
        )}

        {error && (
          <Text style={styles.errorText}>Sıralama yüklenemedi.</Text>
        )}

        {data && (
          <View style={styles.card}>
            {data.entries.map((entry, idx) => (
              <View key={entry.user_id}>
                <LeaderboardRow
                  entry={entry}
                  isCurrentUser={entry.username === user?.username}
                />
                {idx < data.entries.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        )}

        {data && (
          <Text style={styles.weekInfo}>
            {data.week_start} — {data.week_end}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F1A' },
  header: {
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A2E',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#9CA3AF', fontSize: 14, marginTop: 2 },
  myRankCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.3)',
  },
  myRankLabel: { color: '#A78BFA', fontSize: 14, fontWeight: '600' },
  myRankValue: { color: '#7C3AED', fontSize: 20, fontWeight: '800' },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  currentUserRow: {
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
  rankText: { fontSize: 20, width: 32, textAlign: 'center' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(124,58,237,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#A78BFA', fontSize: 15, fontWeight: '700' },
  userInfo: { flex: 1 },
  username: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  userMeta: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  xpBadge: { alignItems: 'flex-end' },
  xpValue: { color: '#7C3AED', fontSize: 16, fontWeight: '800' },
  xpLabel: { color: '#9CA3AF', fontSize: 11 },
  divider: { height: 1, backgroundColor: '#2D2D44', marginHorizontal: 14 },
  errorText: { color: '#EF4444', fontSize: 14, textAlign: 'center' },
  weekInfo: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
