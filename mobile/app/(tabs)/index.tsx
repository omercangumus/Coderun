// Ana sayfa — Flutter home_tab.dart'tan, XP çubuğu, seri, devam butonu

import React, { useMemo } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
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

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';

  const onRefresh = async () => {
    await Promise.all([refetchStats(), refetchModules(), refetchLessons()]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Coderun</Text>
        {stats && (
          <View style={styles.pillsRow}>
            <LinearGradient
              colors={['rgba(124,58,237,0.15)', 'rgba(124,58,237,0.05)']}
              style={[styles.pill, { borderColor: 'rgba(124,58,237,0.4)' }]}
            >
              <Text style={styles.pillIcon}>⚡</Text>
              <Text style={[styles.pillValue, { color: '#A78BFA' }]}>
                {stats.total_xp}
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={['rgba(251,146,60,0.15)', 'rgba(251,146,60,0.05)']}
              style={[styles.pill, { borderColor: 'rgba(251,146,60,0.4)' }]}
            >
              <Text style={styles.pillIcon}>🔥</Text>
              <Text style={[styles.pillValue, { color: '#FB923C' }]}>
                {stats.streak}
              </Text>
            </LinearGradient>
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
          <View style={styles.welcomeTextSection}>
            <Text style={styles.greetingText}>
              {greeting}, <Text style={styles.usernameText}>{user?.username ?? 'Kullanıcı'}</Text>! 👋
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
          <SkeletonCard height={90} />
        ) : stats ? (
          <LinearGradient
            colors={['#1E1E38', '#111126']}
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
            <Text style={styles.sectionAction}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>

        {modulesLoading ? (
          <SkeletonCard height={100} />
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
                <Text style={styles.continueLabel}>SIRADAKİ DERSİN</Text>
                <Text style={styles.continueTitle} numberOfLines={1}>
                  {firstModule.title}
                </Text>
                <Text style={styles.continueSub} numberOfLines={1}>
                  {nextLesson.title}
                </Text>
                <View style={styles.continueBadge}>
                  <Text style={styles.continueBadgeText}>Hemen Başla →</Text>
                </View>
              </View>
              <View style={styles.continueIconWrapper}>
                <Text style={{ fontSize: 42 }}>🚀</Text>
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
            <GhostieImage state="idle" size={64} />
          </View>
          <View style={styles.ghostieBubble}>
            <View style={styles.bubbleTail} />
            <Text style={styles.ghostieText}>
              "Selam coder! Python kodlarken veya quiz çözerken takılırsan ben buradayım! Mentor sekmesinden bana istediğin soruyu sorabilirsin." 👻
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
    paddingVertical: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1E1E30',
    backgroundColor: '#0F0F1A',
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pillsRow: { flexDirection: 'row', gap: 10 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  pillIcon: { fontSize: 13 },
  pillValue: { fontSize: 13, fontWeight: '800' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 24 },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111124',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1E1E35',
  },
  welcomeTextSection: {
    flex: 1,
    paddingRight: 12,
    gap: 4,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  usernameText: {
    color: '#A78BFA',
  },
  subgreeting: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A78BFA',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  xpCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
    gap: 18,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  xpStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 4,
  },
  xpStat: { alignItems: 'center', gap: 4 },
  xpStatValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  xpStatLabel: { color: '#9CA3AF', fontSize: 11, fontWeight: '700' },
  xpStatDivider: { width: 1.5, height: 32, backgroundColor: '#2D2D4B' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -4,
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  sectionAction: { color: '#A78BFA', fontSize: 13, fontWeight: '700' },
  continueCard: {
    borderRadius: 22,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  continueContent: { flex: 1, gap: 4 },
  continueLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  continueTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    opacity: 0.9,
  },
  continueSub: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 6,
  },
  continueBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  continueBadgeText: { color: '#7C3AED', fontSize: 12, fontWeight: '800' },
  continueIconWrapper: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
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
    gap: 12,
    marginTop: 8,
  },
  ghostieMascotBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111124',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#1E1E35',
  },
  ghostieBubble: {
    flex: 1,
    backgroundColor: '#1E1E38',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: 0,
    left: -10,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopColor: '#2D2D4B',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  ghostieText: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});

