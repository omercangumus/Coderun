// Liderlik tablosu
import React, { useRef, useEffect } from 'react';
import {
  Animated,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getLeaderboard } from '../../src/api/gamification';
import type { LeaderboardEntry } from '../../src/types/gamification';
import { SkeletonCard } from '../../src/components/LoadingSkeleton';
import { useAuthStore } from '../../src/store/authStore';

function UserAvatar({
  username,
  size = 40,
  isCurrentUser = false,
  isBig = false,
}: {
  username: string;
  size?: number;
  isCurrentUser?: boolean;
  isBig?: boolean;
}) {
  const letter = username?.[0]?.toUpperCase() ?? '?';
  const radius = size / 2;

  return (
    <LinearGradient
      colors={isCurrentUser ? ['#7C3AED', '#4C1D95'] : ['#1E1E38', '#111124']}
      style={[styles.avatarBase, { width: size, height: size, borderRadius: radius }]}
    >
      <Ionicons
        name="person"
        size={size * 0.42}
        color={isCurrentUser ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}
        style={{ position: 'absolute' }}
      />
      <Text style={[styles.avatarLetter, { fontSize: size * 0.35 }, isBig && { fontWeight: '900' }]}>
        {letter}
      </Text>
    </LinearGradient>
  );
}

function PodiumBlock({
  entry,
  rank,
  isCurrentUser,
  height,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
  height: number;
}) {
  const medals = ['🥇', '🥈', '🥉'];
  const blockColors = [
    ['#92400E', '#78350F'],
    ['#374151', '#1F2937'],
    ['#713F12', '#5C3317'],
  ] as [string, string][];

  return (
    <View style={[styles.podiumCol, rank === 1 && { marginTop: -18 }]}>
      <Text style={styles.podiumMedal}>{medals[rank - 1]}</Text>
      <UserAvatar username={entry.username} size={rank === 1 ? 52 : 42} isCurrentUser={isCurrentUser} isBig />
      <Text style={styles.podiumName} numberOfLines={1} ellipsizeMode="tail">
        {entry.username}{isCurrentUser ? ' ✦' : ''}
      </Text>
      <Text style={styles.podiumXP}>{entry.weekly_xp} XP</Text>
      <LinearGradient
        colors={blockColors[rank - 1]}
        style={[styles.podiumBlock, { height }]}
      >
        <Text style={styles.podiumRankNum}>{rank}</Text>
      </LinearGradient>
    </View>
  );
}

function RankChangeBanner({ rank, prevRank }: { rank: number; prevRank: number | null }) {
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (prevRank !== null && prevRank > rank) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [rank, prevRank]);

  if (prevRank === null || prevRank <= rank) return null;
  const diff = prevRank - rank;

  return (
    <Animated.View style={[styles.rankBanner, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
      <Text style={styles.rankBannerEmoji}>🚀</Text>
      <Text style={styles.rankBannerText}>{diff} sıra yükseldin! #{rank}. sıradasın</Text>
    </Animated.View>
  );
}

function LeaderboardRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}) {
  const isMedal = entry.rank <= 3;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <View style={[styles.row, isCurrentUser && styles.rowCurrentUser]}>
      <View style={styles.rankCell}>
        {isMedal ? (
          <Text style={styles.rankMedal}>{medals[entry.rank - 1]}</Text>
        ) : (
          <Text style={[styles.rankNum, isCurrentUser && styles.rankNumCurrent]}>
            {entry.rank}
          </Text>
        )}
      </View>

      <UserAvatar username={entry.username} size={38} isCurrentUser={isCurrentUser} />

      <View style={styles.rowInfo}>
        <View style={styles.rowNameRow}>
          <Text style={[styles.rowUsername, isCurrentUser && styles.rowUsernameCurrent]} numberOfLines={1} ellipsizeMode="tail">
            {entry.username}
          </Text>
          {isCurrentUser && (
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>Sen</Text>
            </View>
          )}
        </View>
        <Text style={styles.rowMeta} numberOfLines={1}>
          Lv {entry.level} • {entry.streak} gün seri
        </Text>
      </View>

      <View style={[styles.xpBadge, isCurrentUser && styles.xpBadgeCurrent]}>
        <Text style={[styles.xpValue, isCurrentUser && styles.xpValueCurrent]}>
          {entry.weekly_xp}
        </Text>
        <Text style={styles.xpLabel}>XP</Text>
      </View>
    </View>
  );
}

export default function LeaderboardScreen() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
  });

  const top3 = data?.entries.slice(0, 3) ?? [];
  const userEntry = data?.entries.find((e) => e.username === user?.username);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A12" />

      <LinearGradient colors={['#0F0F1A', '#0A0A12']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Sıralama</Text>
            <Text style={styles.headerSub}>Bu haftanın en iyi geliştiricileri</Text>
          </View>
          <View style={styles.trophyBox}>
            <Ionicons name="trophy" size={22} color="#F59E0B" />
          </View>
        </View>
        {data && (
          <Text style={styles.headerWeek}>{data.week_start} — {data.week_end}</Text>
        )}
      </LinearGradient>

      {data?.user_rank && userEntry && (
        <RankChangeBanner rank={data.user_rank} prevRank={null} />
      )}

      {data?.user_rank && (
        <LinearGradient
          colors={['rgba(124,58,237,0.15)', 'rgba(124,58,237,0.05)']}
          style={styles.myRankCard}
        >
          <View style={styles.myRankLeft}>
            <Text style={styles.myRankLabel}>Benim Sıram</Text>
            <Text style={styles.myRankValue}>#{data.user_rank}</Text>
          </View>
          {userEntry && (
            <View style={styles.myRankRight}>
              <Text style={styles.myRankXP}>{userEntry.weekly_xp} XP</Text>
              <Text style={styles.myRankMeta}>bu hafta</Text>
            </View>
          )}
        </LinearGradient>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#7C3AED" />
        }
      >
        {isLoading && (
          <View style={{ gap: 10 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} height={64} />
            ))}
          </View>
        )}

        {error && (
          <Text style={styles.errorText}>Sıralama yüklenemedi. Aşağı çekerek yenile.</Text>
        )}

        {top3.length === 3 && (
          <View style={styles.podium}>
            <PodiumBlock entry={top3[1]} rank={2} isCurrentUser={top3[1].username === user?.username} height={80} />
            <PodiumBlock entry={top3[0]} rank={1} isCurrentUser={top3[0].username === user?.username} height={110} />
            <PodiumBlock entry={top3[2]} rank={3} isCurrentUser={top3[2].username === user?.username} height={60} />
          </View>
        )}

        {data && data.entries.length > 0 && (
          <View style={styles.listCard}>
            {data.entries.map((entry, idx) => (
              <View key={entry.user_id}>
                <LeaderboardRow entry={entry} isCurrentUser={entry.username === user?.username} />
                {idx < data.entries.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A12' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1E1E30',
    gap: 6,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  headerSub: { color: '#9CA3AF', fontSize: 13, fontWeight: '500', marginTop: 2 },
  headerWeek: { color: '#4B5563', fontSize: 11, fontWeight: '600' },
  trophyBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(245,158,11,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },

  rankBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  rankBannerEmoji: { fontSize: 18 },
  rankBannerText: { color: '#22C55E', fontSize: 13, fontWeight: '700', flex: 1 },

  myRankCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(124,58,237,0.3)',
  },
  myRankLeft: { gap: 2, flex: 1, minWidth: 0 },
  myRankLabel: { color: '#A78BFA', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  myRankValue: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  myRankRight: { alignItems: 'flex-end', flexShrink: 0 },
  myRankXP: { color: '#A78BFA', fontSize: 18, fontWeight: '900' },
  myRankMeta: { color: '#6B7280', fontSize: 11, fontWeight: '600' },

  scroll: { flex: 1 },
  content: { padding: 16, gap: 14 },

  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingTop: 20,
    paddingBottom: 8,
  },
  podiumCol: { flex: 1, alignItems: 'center', gap: 4, minWidth: 0 },
  podiumMedal: { fontSize: 24 },
  podiumName: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', textAlign: 'center', width: '90%' },
  podiumXP: { color: '#A78BFA', fontSize: 10, fontWeight: '700' },
  podiumBlock: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  podiumRankNum: { color: 'rgba(255,255,255,0.3)', fontSize: 20, fontWeight: '900' },

  listCard: {
    backgroundColor: '#111124',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1E1E35',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  rowCurrentUser: { backgroundColor: 'rgba(124,58,237,0.08)' },
  rowDivider: { height: 1, backgroundColor: '#1A1A30', marginHorizontal: 14 },

  rankCell: { width: 32, alignItems: 'center', flexShrink: 0 },
  rankMedal: { fontSize: 19 },
  rankNum: { color: '#9CA3AF', fontSize: 15, fontWeight: '800' },
  rankNumCurrent: { color: '#A78BFA' },

  // Avatar
  avatarBase: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
  avatarLetter: { color: '#FFFFFF', fontWeight: '800', zIndex: 1 },

  rowInfo: { flex: 1, minWidth: 0 },
  rowNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowUsername: { color: '#E5E7EB', fontSize: 13, fontWeight: '700', flexShrink: 1 },
  rowUsernameCurrent: { color: '#FFFFFF' },
  youBadge: {
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    flexShrink: 0,
  },
  youBadgeText: { color: '#A78BFA', fontSize: 9, fontWeight: '800' },
  rowMeta: { color: '#6B7280', fontSize: 11, marginTop: 2, fontWeight: '500' },

  xpBadge: {
    alignItems: 'flex-end',
    backgroundColor: '#1A1A30',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#2D2D4B',
    flexShrink: 0,
    minWidth: 48,
  },
  xpBadgeCurrent: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderColor: 'rgba(124,58,237,0.4)',
  },
  xpValue: { color: '#A78BFA', fontSize: 14, fontWeight: '900' },
  xpValueCurrent: { color: '#C4B5FD' },
  xpLabel: { color: '#6B7280', fontSize: 9, fontWeight: '700' },

  errorText: { color: '#EF4444', fontSize: 14, textAlign: 'center', fontWeight: '600' },
});
