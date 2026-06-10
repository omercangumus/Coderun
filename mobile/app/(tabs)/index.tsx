// Ana sayfa — iPhone 11 safe area, geliştirilmiş UI
import React, { useMemo, useCallback } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserStats } from '../../src/api/gamification';
import { getModules, getLessons } from '../../src/api/lessons';
import { useAuthStore } from '../../src/store/authStore';
import { GhostieImage } from '../../src/components/GhostieImage';
import { SkeletonCard } from '../../src/components/LoadingSkeleton';

function StatPill({ icon, value, color, borderColor }: {
  icon: string; value: string | number; color: string; borderColor: string;
}) {
  return (
    <View style={[styles.pill, { borderColor }]}>
      <Text style={styles.pillIcon}>{icon}</Text>
      <Text style={[styles.pillValue, { color }]}>{value}</Text>
    </View>
  );
}

function DailyStreakBar({ streak }: { streak: number }) {
  const days = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <View style={styles.streakBar}>
      {days.map((d, i) => {
        const isPast = i < todayIdx;
        const isToday = i === todayIdx;
        const active = isPast && streak > (todayIdx - i);
        return (
          <View key={d} style={styles.streakDay}>
            <View style={[
              styles.streakCircle,
              active && styles.streakCircleActive,
              isToday && styles.streakCircleToday,
            ]}>
              <Text style={[styles.streakDayEmoji, !active && !isToday && styles.streakDayInactive]}>
                {active ? '🔥' : isToday ? '⭐' : '○'}
              </Text>
            </View>
            <Text style={[styles.streakDayLabel, (active || isToday) && styles.streakDayLabelActive]}>
              {d}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['userStats'],
    queryFn: getUserStats,
    enabled: !!user,
  });

  const { data: modules, isLoading: modulesLoading, refetch: refetchModules } = useQuery({
    queryKey: ['modules'],
    queryFn: getModules,
    enabled: !!user,
  });

  const firstModule = modules?.[0];

  const { data: lessons, refetch: refetchLessons } = useQuery({
    queryKey: ['lessons', firstModule?.slug],
    queryFn: () => getLessons(firstModule!.slug),
    enabled: !!firstModule,
  });

  const nextLesson = useMemo(() => {
    if (!lessons || lessons.length === 0) return null;
    return lessons.find((l) => !l.is_completed && !l.is_locked) ?? lessons[0];
  }, [lessons]);

  const completedCount = lessons?.filter((l) => l.is_completed).length ?? 0;
  const totalCount = lessons?.length ?? 0;
  const moduleProgress = totalCount > 0 ? completedCount / totalCount : 0;

  useFocusEffect(
    useCallback(() => {
      refetchStats();
      refetchModules();
      if (firstModule) refetchLessons();
    }, [refetchStats, refetchModules, refetchLessons, firstModule])
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';

  const onRefresh = async () => {
    await Promise.all([refetchStats(), refetchModules(), refetchLessons()]);
  };

  const levelPct = stats?.level_progress.progress_percentage ?? 0;
  const level = stats?.level_progress.current_level ?? 1;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A12" />

      {/* App Bar */}
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <Text style={styles.appBarLogo}>{'</>'}</Text>
          <View>
            <Text style={styles.appBarTitle}>Coderun</Text>
            <Text style={styles.appBarSub}>Seviye {level} Geliştirici</Text>
          </View>
        </View>
        {stats && (
          <View style={styles.pillsRow}>
            <StatPill icon="⚡" value={stats.total_xp} color="#A78BFA" borderColor="rgba(124,58,237,0.35)" />
            <StatPill icon="🔥" value={stats.streak} color="#FB923C" borderColor="rgba(251,146,60,0.35)" />
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={statsLoading || modulesLoading}
            onRefresh={onRefresh}
            tintColor="#7C3AED"
          />
        }
      >
        {/* Welcome */}
        <LinearGradient
          colors={['#14103A', '#0F0B28']}
          style={styles.welcomeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeLeft}>
              <Text style={styles.greetingText}>{greeting},</Text>
              <Text style={styles.usernameText}>
                {user?.username ?? 'Geliştirici'}! 👋
              </Text>
              <Text style={styles.welcomeSub}>
                Bugün yeni bir şey öğrenmeye hazır mısın?
              </Text>
            </View>
            <View style={styles.avatarWrapper}>
              <LinearGradient
                colors={['#7C3AED', '#4C1D95']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {(user?.username ?? 'K')[0].toUpperCase()}
                </Text>
              </LinearGradient>
              {stats && stats.streak > 0 && (
                <View style={styles.streakBadgeSmall}>
                  <Text style={styles.streakBadgeText}>🔥{stats.streak}</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>

        {/* XP + Level Card */}
        {statsLoading ? (
          <SkeletonCard height={130} />
        ) : stats ? (
          <LinearGradient
            colors={['#1A1A2E', '#111126']}
            style={styles.xpCard}
          >
            <View style={styles.xpHeader}>
              <Text style={styles.xpLevelLabel}>SEVİYE {level}</Text>
              <Text style={styles.xpPercent}>{Math.round(levelPct)}%</Text>
            </View>
            {/* Level bar */}
            <View style={styles.levelBarBg}>
              <LinearGradient
                colors={['#A78BFA', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.levelBarFill, { width: `${levelPct}%` }]}
              />
            </View>
            <View style={styles.xpStatsRow}>
              <View style={styles.xpStat}>
                <Text style={styles.xpStatVal}>{stats.total_xp}</Text>
                <Text style={styles.xpStatLbl}>Toplam XP</Text>
              </View>
              <View style={styles.xpDivider} />
              <View style={styles.xpStat}>
                <Text style={styles.xpStatVal}>{stats.streak}🔥</Text>
                <Text style={styles.xpStatLbl}>Gün Serisi</Text>
              </View>
              <View style={styles.xpDivider} />
              <View style={styles.xpStat}>
                <Text style={styles.xpStatVal}>{stats.total_lessons_completed}</Text>
                <Text style={styles.xpStatLbl}>Tamamlanan</Text>
              </View>
            </View>
          </LinearGradient>
        ) : null}

        {/* Haftalık Seri */}
        {stats && stats.streak > 0 && (
          <View style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <Text style={styles.streakTitle}>Haftalık Seri</Text>
              <Text style={styles.streakCount}>{stats.streak} gün 🔥</Text>
            </View>
            <DailyStreakBar streak={stats.streak} />
          </View>
        )}

        {/* Devam Et */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eğitime Devam Et</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/learn')}>
            <Text style={styles.sectionLink}>Tümünü Gör →</Text>
          </TouchableOpacity>
        </View>

        {modulesLoading ? (
          <SkeletonCard height={120} />
        ) : (firstModule && nextLesson) ? (
          <TouchableOpacity onPress={() => router.push(`/lesson/${nextLesson.id}`)} activeOpacity={0.9}>
            <LinearGradient
              colors={['#5B21B6', '#7C3AED', '#4C1D95']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueCard}
            >
              <View style={styles.continueTop}>
                <Text style={styles.continueModuleTag}>{firstModule.title}</Text>
                {totalCount > 0 && (
                  <Text style={styles.continueProgress}>
                    {completedCount}/{totalCount} ders
                  </Text>
                )}
              </View>
              <Text style={styles.continueTitle} numberOfLines={2}>
                {nextLesson.title}
              </Text>

              {/* Module progress bar */}
              {totalCount > 0 && (
                <View style={styles.continueBarBg}>
                  <View style={[styles.continueBarFill, { width: `${moduleProgress * 100}%` }]} />
                </View>
              )}

              <View style={styles.continueBottom}>
                <View style={styles.continueCta}>
                  <Text style={styles.continueCtaText}>Hemen Başla →</Text>
                </View>
                <Text style={styles.continueXP}>⚡ {nextLesson.xp_reward} XP</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Henüz ders yok.</Text>
          </View>
        )}

        {/* Hızlı Navigasyon */}
        <View style={styles.quickNav}>
          <TouchableOpacity
            style={styles.quickNavBtn}
            onPress={() => router.push('/(tabs)/leaderboard')}
          >
            <Text style={styles.quickNavEmoji}>🏆</Text>
            <Text style={styles.quickNavLabel}>Sıralama</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickNavBtn}
            onPress={() => router.push('/(tabs)/mentor')}
          >
            <Text style={styles.quickNavEmoji}>👻</Text>
            <Text style={styles.quickNavLabel}>AI Mentor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickNavBtn}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.quickNavEmoji}>👤</Text>
            <Text style={styles.quickNavLabel}>Profil</Text>
          </TouchableOpacity>
        </View>

        {/* Ghostie kartı */}
        <TouchableOpacity
          style={styles.ghostieCard}
          onPress={() => router.push('/(tabs)/mentor')}
          activeOpacity={0.85}
        >
          <GhostieImage state="happy" size={56} />
          <View style={styles.ghostieBubble}>
            <Text style={styles.ghostieName}>Ghostie AI Mentor</Text>
            <Text style={styles.ghostieMsg}>
              Takıldığın konuyu sor, seni yönlendireyim! Python, DevOps, Cloud — hepsini bilirim 🧠
            </Text>
            <View style={styles.ghostieCta}>
              <Text style={styles.ghostieCtaText}>Soru Sor →</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A12' },

  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1E1E30',
    backgroundColor: '#0F0F1A',
  },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  appBarLogo: {
    color: '#A78BFA',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  appBarTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  appBarSub: { color: '#6B7280', fontSize: 11, fontWeight: '600', marginTop: 1 },
  pillsRow: { flexDirection: 'row', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  pillIcon: { fontSize: 13 },
  pillValue: { fontSize: 13, fontWeight: '800' },

  scroll: { flex: 1 },
  content: { padding: 16, gap: 14, paddingBottom: 40 },

  // Welcome
  welcomeCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.15)',
  },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeLeft: { flex: 1, gap: 3 },
  greetingText: { color: '#9CA3AF', fontSize: 14, fontWeight: '600' },
  usernameText: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  welcomeSub: { color: '#6B7280', fontSize: 12, lineHeight: 17, marginTop: 2 },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#A78BFA',
  },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  streakBadgeSmall: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#0F0F1A',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#FB923C',
  },
  streakBadgeText: { fontSize: 10, fontWeight: '800', color: '#FB923C' },

  // XP Card
  xpCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
    gap: 12,
  },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpLevelLabel: { color: '#A78BFA', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  xpPercent: { color: '#6B7280', fontSize: 12, fontWeight: '700' },
  levelBarBg: {
    height: 10,
    backgroundColor: '#1E1E38',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2D2D4B',
  },
  levelBarFill: { height: '100%', borderRadius: 5 },
  xpStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1E1E35',
  },
  xpStat: { alignItems: 'center', gap: 3 },
  xpStatVal: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  xpStatLbl: { color: '#9CA3AF', fontSize: 11, fontWeight: '600' },
  xpDivider: { width: 1, height: 32, backgroundColor: '#2D2D4B' },

  // Streak card
  streakCard: {
    backgroundColor: '#111124',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(251,146,60,0.2)',
    gap: 12,
  },
  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  streakCount: { color: '#FB923C', fontSize: 14, fontWeight: '800' },
  streakBar: { flexDirection: 'row', justifyContent: 'space-between' },
  streakDay: { alignItems: 'center', gap: 5 },
  streakCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E1E38',
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCircleActive: {
    backgroundColor: 'rgba(251,146,60,0.15)',
    borderColor: '#FB923C',
  },
  streakCircleToday: {
    backgroundColor: 'rgba(167,139,250,0.15)',
    borderColor: '#A78BFA',
  },
  streakDayEmoji: { fontSize: 14 },
  streakDayInactive: { color: '#4B5563' },
  streakDayLabel: { color: '#6B7280', fontSize: 10, fontWeight: '600' },
  streakDayLabelActive: { color: '#D1D5DB' },

  // Section
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  sectionLink: { color: '#A78BFA', fontSize: 13, fontWeight: '700' },

  // Continue card
  continueCard: {
    borderRadius: 22,
    padding: 20,
    gap: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  continueTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  continueModuleTag: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  continueProgress: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '700' },
  continueTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '900', lineHeight: 25 },
  continueBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  continueBarFill: { height: '100%', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 2 },
  continueBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  continueCta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  continueCtaText: { color: '#7C3AED', fontSize: 13, fontWeight: '900' },
  continueXP: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700' },

  emptyCard: {
    backgroundColor: '#111124',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1E1E35',
  },
  emptyText: { color: '#6B7280', fontSize: 14, fontWeight: '600' },

  // Quick nav
  quickNav: {
    flexDirection: 'row',
    gap: 10,
  },
  quickNavBtn: {
    flex: 1,
    backgroundColor: '#111124',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#1E1E35',
  },
  quickNavEmoji: { fontSize: 22 },
  quickNavLabel: { color: '#D1D5DB', fontSize: 12, fontWeight: '700' },

  // Ghostie card
  ghostieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#111124',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(124,58,237,0.2)',
  },
  ghostieBubble: { flex: 1, gap: 6 },
  ghostieName: { color: '#A78BFA', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  ghostieMsg: { color: '#D1D5DB', fontSize: 13, lineHeight: 19, fontWeight: '500' },
  ghostieCta: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.3)',
  },
  ghostieCtaText: { color: '#A78BFA', fontSize: 12, fontWeight: '700' },
});
