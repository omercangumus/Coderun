// Ana sayfa — Flutter home_tab.dart'tan, XP çubuğu, seri, devam butonu

import React, { useEffect } from 'react';
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
import { getUserStats } from '../../src/api/gamification';
import { getModules } from '../../src/api/lessons';
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

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';

  const onRefresh = async () => {
    await Promise.all([refetchStats(), refetchModules()]);
  };

  const firstModule = modules?.[0];

  return (
    <SafeAreaView style={styles.safe}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Coderun</Text>
        {stats && (
          <View style={styles.pillsRow}>
            <View style={[styles.pill, { borderColor: 'rgba(124,58,237,0.3)' }]}>
              <Text style={styles.pillIcon}>⚡</Text>
              <Text style={[styles.pillValue, { color: '#A78BFA' }]}>
                {stats.total_xp}
              </Text>
            </View>
            <View style={[styles.pill, { borderColor: 'rgba(251,146,60,0.3)' }]}>
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
        <View style={styles.welcome}>
          <Text style={styles.greetingText}>
            {greeting}, {user?.username ?? 'Kullanıcı'}! 👋
          </Text>
          <Text style={styles.subgreeting}>Bugün ne öğrenmek istiyorsun?</Text>
        </View>

        {/* XP Card */}
        {statsLoading ? (
          <SkeletonCard height={90} />
        ) : stats ? (
          <View style={styles.xpCard}>
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
                <Text style={styles.xpStatLabel}>Ders</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Continue Learning */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Devam Et</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/learn')}>
            <Text style={styles.sectionAction}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>

        {modulesLoading ? (
          <SkeletonCard height={100} />
        ) : firstModule ? (
          <TouchableOpacity
            style={styles.continueCard}
            onPress={() => router.push(`/lesson/${firstModule.id}`)}
            activeOpacity={0.85}
          >
            <View style={styles.continueContent}>
              <Text style={styles.continueLabel}>DEVAM ET</Text>
              <Text style={styles.continueTitle} numberOfLines={1}>
                {firstModule.title}
              </Text>
              <View style={styles.continueBadge}>
                <Text style={styles.continueBadgeText}>Devam Et →</Text>
              </View>
            </View>
            <Text style={{ fontSize: 48 }}>📚</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Henüz modül yok.</Text>
          </View>
        )}

        {/* Ghostie motivasyon kartı */}
        <View style={styles.ghostieCard}>
          <GhostieImage state="idle" size={56} />
          <View style={styles.ghostieMessage}>
            <Text style={styles.ghostieText}>
              Takıldığın bir yer mi var? Sana yardım etmekten mutluluk
              duyarım! 👻
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F1A' },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A2E',
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  pillsRow: { flexDirection: 'row', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#1A1A2E',
  },
  pillIcon: { fontSize: 12 },
  pillValue: { fontSize: 13, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 20 },
  welcome: { gap: 4 },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subgreeting: { fontSize: 14, color: '#9CA3AF' },
  xpCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D2D44',
    gap: 16,
  },
  xpStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  xpStat: { alignItems: 'center', gap: 2 },
  xpStatValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  xpStatLabel: { color: '#9CA3AF', fontSize: 11, fontWeight: '500' },
  xpStatDivider: { width: 1, height: 32, backgroundColor: '#2D2D44' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  sectionAction: { color: '#7C3AED', fontSize: 13, fontWeight: '600' },
  continueCard: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  continueContent: { flex: 1, gap: 6 },
  continueLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  continueTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  continueBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  continueBadgeText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  emptyCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  emptyText: { color: '#6B7280', fontSize: 14 },
  ghostieCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D44',
    gap: 16,
  },
  ghostieMessage: { flex: 1 },
  ghostieText: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
});
