// Liderlik tablosu — geliştirilmiş UI, podyum, sıra değişimi
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
import { getLeaderboard } from '../../src/api/gamification';
import type { LeaderboardEntry } from '../../src/types/gamification';
import { SkeletonCard } from '../../src/components/LoadingSkeleton';
import { useAuthStore } from '../../src/store/authStore';

// Podium için Top 3
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
  const colors = [
    ['#FFD700', '#B8860B'],
    ['#C0C0C0', '#808080'],
    ['#CD7F32', '#8B4513'],
  ] as [string, string][];

  return (
    <View style={[styles.podiumCol, rank === 1 && { marginTop: -20 }]}>
      {/* Crown / medal */}
      <Text style={styles.podiumMedal}>{medals[rank - 1]}</Text>
      {/* Avatar */}
      <LinearGradient
        colors={isCurrentUser ? ['#7C3AED', '#4C1D95'] : ['#2D2D4B', '#1E1E38']}
        style={[styles.podiumAvatar, rank === 1 && styles.podiumAvatarFirst]}
      >
        <Text style={styles.podiumAvatarText}>
          {entry.username[0]?.toUpperCase() ?? '?'}
        </Text>
      </LinearGradient>
      <Text style={styles.podiumName} numberOfLines={1}>
        {entry.username}{isCurrentUser ? ' ✦' : ''}
      </Text>
      <Text style={styles.podiumXP}>{entry.weekly_xp} XP</Text>
      {/* Block */}
      <LinearGradient
        colors={colors[rank - 1]}
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
      <Text style={styles.rankBannerText}>
        {diff} sıra yükseldin! #{rank}. sıradasın
      </Text>
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
      {/* Rank */}
      <View style={styles.rankCell}>
        {isMedal ? (
          <Text style={styles.rankMedal}>{medals[entry.rank - 1]}</Text>
        ) : (
          <Text style={[styles.rankNum, isCurrentUser && styles.rankNumCurrent]}>
            {entry.rank}
          </Text>
        )}
      </View>

      {/* Avatar */}
      <LinearGradient
        colors={isCurrentUser ? ['#7C3AED', '#5B21B6'] : ['#2D2D4B', '#1E1E38']}
        style={styles.rowAvatar}
      >
        <Text style={styles.rowAvatarText}>
          {entry.username[0]?.toUpperCase() ?? '?'}
        </Text>
      </LinearGradient>

      {/* Info */}
      <View style={styles.rowInfo}>
        <Text style={[styles.rowUsername, isCurrentUser && styles.rowUsernameCurrent]} numberOfLines={1}>
          {entry.username}
          {isCurrentUser && <Text style={styles.youTag}> (Sen)</Text>}
        </Text>
        <Text style={styles.rowMeta}>
          Lv {entry.level} • {entry.streak}🔥 seri
        </Text>
      </View>

      {/* XP */}
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

  const top3 = data?.entries.slice(0, 3) ?? [];
  const userEntry = data?.entries.find((e) => e.username === user?.username);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A12" />

      {/* Header */}
      <LinearGradient
        colors={['#0F0F1A', '#0A0A12']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🏆 Haftalık Sıralama</Text>
        <Text style={styles.headerSub}>Bu haftanın en iyi geliştiricileri</Text>
        {data && (
          <Text style={styles.headerWeek}>
            {data.week_start} — {data.week_end}
          </Text>
        )}
      </LinearGradient>

      {/* Rank change banner */}
      {data?.user_rank && userEntry && (
        <RankChangeBanner rank={data.user_rank} prevRank={null} />
      )}

      {/* My rank card */}
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
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#7C3AED"
          />
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

        {/* Podyum - Top 3 */}
        {top3.length === 3 && (
          <View style={styles.podium}>
            <PodiumBlock
              entry={top3[1]}
              rank={2}
              isCurrentUser={top3[1].username === user?.username}
              height={80}
            />
            <PodiumBlock
              entry={top3[0]}
              rank={1}
              isCurrentUser={top3[0].username === user?.username}
              height={110}
            />
            <PodiumBlock
              entry={top3[2]}
              rank={3}
              isCurrentUser={top3[2].username === user?.username}
              height={60}
            />
          </View>
        )}

        {/* Tüm sıralama listesi */}
        {data && data.entries.length > 0 && (
          <View style={styles.listCard}>
            {data.entries.map((entry, idx) => (
              <View key={entry.user_id}>
                <LeaderboardRow
                  entry={entry}
                  isCurrentUser={entry.username === user?.username}
                />
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
    gap: 3,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  headerSub: { color: '#9CA3AF', fontSize: 13, fontWeight: '500' },
  headerWeek: { color: '#6B7280', fontSize: 11, fontWeight: '600', marginTop: 2 },

  // Rank change banner
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
  rankBannerEmoji: { fontSize: 20 },
  rankBannerText: { color: '#22C55E', fontSize: 14, fontWeight: '700' },

  // My rank card
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
  myRankLeft: { gap: 2 },
  myRankLabel: { color: '#A78BFA', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  myRankValue: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  myRankRight: { alignItems: 'flex-end' },
  myRankXP: { color: '#7C3AED', fontSize: 20, fontWeight: '900' },
  myRankMeta: { color: '#6B7280', fontSize: 11, fontWeight: '600' },

  scroll: { flex: 1 },
  content: { padding: 16, gap: 14 },

  // Podium
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingTop: 20,
    paddingBottom: 8,
  },
  podiumCol: { flex: 1, alignItems: 'center', gap: 6 },
  podiumMedal: { fontSize: 28 },
  podiumAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumAvatarFirst: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  podiumAvatarText: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
  podiumName: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', textAlign: 'center', maxWidth: 80 },
  podiumXP: { color: '#A78BFA', fontSize: 11, fontWeight: '700' },
  podiumBlock: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  podiumRankNum: { color: 'rgba(0,0,0,0.4)', fontSize: 22, fontWeight: '900' },

  // List
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
    gap: 12,
  },
  rowCurrentUser: { backgroundColor: 'rgba(124,58,237,0.08)' },
  rowDivider: { height: 1, backgroundColor: '#1E1E35', marginHorizontal: 14 },

  rankCell: { width: 36, alignItems: 'center' },
  rankMedal: { fontSize: 20 },
  rankNum: { color: '#9CA3AF', fontSize: 16, fontWeight: '800' },
  rankNumCurrent: { color: '#A78BFA' },

  rowAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },

  rowInfo: { flex: 1 },
  rowUsername: { color: '#E5E7EB', fontSize: 14, fontWeight: '700' },
  rowUsernameCurrent: { color: '#FFFFFF' },
  youTag: { color: '#A78BFA', fontWeight: '700', fontSize: 12 },
  rowMeta: { color: '#9CA3AF', fontSize: 11, marginTop: 2, fontWeight: '500' },

  xpBadge: {
    alignItems: 'flex-end',
    backgroundColor: '#1E1E38',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#2D2D4B',
  },
  xpBadgeCurrent: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderColor: 'rgba(124,58,237,0.4)',
  },
  xpValue: { color: '#A78BFA', fontSize: 15, fontWeight: '900' },
  xpValueCurrent: { color: '#7C3AED' },
  xpLabel: { color: '#6B7280', fontSize: 10, fontWeight: '600' },

  errorText: { color: '#EF4444', fontSize: 14, textAlign: 'center', fontWeight: '600' },
});
