// Ana sayfa — iPhone 11 safe area optimized
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
import { XPBar } from '../../src/components/XPBar';
import { SkeletonCard } from '../../src/components/LoadingSkeleton';
import { GhostieImage } from '../../src/components/GhostieImage';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['userStats'],
    queryFn: getUserStats,
    enabled: !!user,
  });

  const {
    data: modules,
    isLoading: modulesLoading,
    refetch: refetchModules,
  } = useQuery({
    queryKey: ['modules'],
    queryFn: getModules,
    enabled: !!user,
  });

  const firstModule = modules?.[0];

  const {
    data: lessons,
    refetch: refetchLessons,
  } = useQuery({
    queryKey: ['lessons', firstModule?.slug],
    queryFn: () => getLessons(firstModule!.slug),
    enabled: !!firstModule,
  });

  const nextLesson = useMemo(() => {
    if (!lessons || lessons.length === 0) return null;
    return lessons.find((l) => !l.is_completed && !l.is_locked) || lessons[0];
  }, [lessons]);

  useFocusEffect(
    useCallback(() => {
      refetchStats();
      refetchModules();
      if (firstModule) {
        refetchLessons();
      }
    }, [refetchStats, refetchModules, refetchLessons, firstModule])
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';

  const onRefresh = async () => {
    await Promise.all([refetchStats(), refetchModules(), refetchLessons()]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A12" />

      {/* App Bar */}
      <View style={styles.appBar}>
        <View>
          <Text style={styles.appBarTitle}>Coderun</Text>
          <Text style={styles.appBarSub}>Kodlamayı öğren, seviye atla</Text>
        </View>
        {stats && (
          <View style={styles.pillsRow}>
            <View style={[styles.pill, { borderColor: 'rgba(124,58,237,0.4)' }]}>
              <Text style={styles.pillIcon}>⚡</Text>
              <Text style={[styles.pillValue, { color: '#A78BFA' }]}>
                {stats.total_xp}
              </Text>
            </View>
            <View style={[styles.pill, { borderColor: 'rgba(251,146,60,0.4)' }]}>
              <Text style={styles.pillIcon}>🔥</Text>
              <Text style={[styles.pillValue, { color: '#FB923C' }]}>
                {stats.streak}
              </Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
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
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.greetingText}>
              {greeting},
            </Text>
            <Text style={styles.usernameText}>
              {user?.username ?? 'Kullanıcı'}! 👋
            </Text>
            <Text style={styles.subgreeting}>Bugün yeni bir kodlama zaferi kazanmaya hazır mısın?</Text>
          </View>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {(user?.username ?? 'K').substring(0, 1).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* XP Card */}
        {statsLoading ? (
          <SkeletonCard height={100} />
        ) : stats ? (
          <LinearGradient
            colors={['#1A1A2E', '#111126']}
            style={styles.xpCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <XPBar
              currentXp={stats.level_progress.current_xp}
              xpNeeded={stats.level_progress.xp_needed_for_next}
              level={stats.level_progress.current_level}
              progressPercentage={stats.level_progress.progress_percentage}
            />
            <View style={styles.xpStats}>
              <View style={styles.xpStat}>
                <Text style={styles.xpStatValue}>{stats.total_xp}</Text>
                <Text style={styles.xpStatLabel}>Toplam XP</Text>
              </View>
              <View style={styles.xpStatDivider} />
              <View style={styles.xpStat}>
                <Text style={styles.xpStatValue}>{stats.streak}</Text>
                <Text style={styles.xpStatLabel}>Gün Serisi</Text>
              </View>
              <View style={styles.xpStatDivider} />
              <View style={styles.xpStat}>
                <Text style={styles.xpStatValue}>
                  {stats.total_lessons_completed}
                </Text>
                <Text style={styles.xpStatLabel}>Tamamlanan Ders</Text>
              </View>
            </View>
          </LinearGradient>
        ) : null}

        {/* Continue Learning */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eğitime Devam Et</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/learn')}>
            <Text style={styles.sectionAction}>Tümünü Gör →</Text>
          </TouchableOpacity>
        </View>

        {modulesLoading ? (
          <SkeletonCard height={110} />
        ) : (firstModule && nextLesson) ? (
          <TouchableOpacity
            onPress={() => router.push(`/lesson/${nextLesson.id}`)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#7C3AED', '#4C1D95']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueCard}
            >
              <View style={styles.continueContent}>
                <Text style={styles.continueLabel}>SIRADAKİ DERS</Text>
                <Text style={styles.continueModule} numberOfLines={1}>
                  {firstModule.title}
                </Text>
                <Text style={styles.continueTitle} numberOfLines={2}>
                  {nextLesson.title}
                </Text>
                <View style={styles.continueBadge}>
                  <Text style={styles.continueBadgeText}>Hemen Başla →</Text>
                </View>
              </View>
              <View style={styles.continueIconWrapper}>
                <Text style={{ fontSize: 38 }}>🚀</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Henüz modül yok.</Text>
          </View>
        )}

        {/* Ghostie motivasyon kartı */}
        <View style={styles.ghostieContainer}>
          <View style={styles.ghostieMascotBox}>
            <GhostieImage state="idle" size={60} />
          </View>
          <View style={styles.ghostieBubble}>
            <Text style={styles.ghostieText}>
              "Merhaba! Python, DevOps veya Cloud konularında takılırsan Mentor sekmesinden bana sorabilirsin." 👻
            </Text>
          </View>
        </View>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E30',
    backgroundColor: '#0F0F1A',
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  appBarSub: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
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
  pillIcon: { fontSize: 12 },
  pillValue: { fontSize: 13, fontWeight: '800' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 32 },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111124',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1E1E35',
  },
  welcomeLeft: {
    flex: 1,
    paddingRight: 12,
    gap: 2,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  usernameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subgreeting: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
    marginTop: 4,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A78BFA',
    flexShrink: 0,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  xpCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
    gap: 16,
  },
  xpStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  xpStat: { alignItems: 'center', gap: 3 },
  xpStatValue: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  xpStatLabel: { color: '#9CA3AF', fontSize: 11, fontWeight: '600' },
  xpStatDivider: { width: 1, height: 30, backgroundColor: '#2D2D4B' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  sectionAction: { color: '#A78BFA', fontSize: 13, fontWeight: '700' },
  continueCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  continueContent: { flex: 1, gap: 4 },
  continueLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  continueModule: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
  },
  continueTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  continueBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  continueBadgeText: { color: '#7C3AED', fontSize: 12, fontWeight: '800' },
  continueIconWrapper: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    flexShrink: 0,
    marginLeft: 12,
  },
  emptyCard: {
    backgroundColor: '#111124',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1E1E35',
  },
  emptyText: { color: '#6B7280', fontSize: 14, fontWeight: '600' },
  ghostieContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  ghostieMascotBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111124',
    borderRadius: 18,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#1E1E35',
    flexShrink: 0,
  },
  ghostieBubble: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
  },
  ghostieText: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
});
