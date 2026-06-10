// Profil ekranı — Flutter profile_tab.dart ve badges_screen.dart'tan, rozetler dahil

import React from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getUserStats } from '../../src/api/gamification';
import { useAuthStore } from '../../src/store/authStore';
import { BadgeCard } from '../../src/components/BadgeCard';
import { XPBar } from '../../src/components/XPBar';
import { SkeletonCard } from '../../src/components/LoadingSkeleton';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: getUserStats,
    enabled: !!user,
  });

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabından çıkmak istediğine emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: logout,
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar & Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* XP Progress */}
        {isLoading ? (
          <SkeletonCard height={80} />
        ) : stats ? (
          <View style={styles.xpCard}>
            <XPBar
              currentXp={stats.level_progress.current_xp}
              xpNeeded={stats.level_progress.xp_needed_for_next}
              level={stats.level_progress.current_level}
              progressPercentage={stats.level_progress.progress_percentage}
            />
          </View>
        ) : null}

        {/* Stats Grid */}
        {stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>📖</Text>
              <Text style={styles.statValue}>{stats.total_lessons_completed}</Text>
              <Text style={styles.statLabel}>Ders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Gün Serisi</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⚡</Text>
              <Text style={styles.statValue}>{stats.total_xp}</Text>
              <Text style={styles.statLabel}>Toplam XP</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🎓</Text>
              <Text style={styles.statValue}>{stats.total_modules_completed}</Text>
              <Text style={styles.statLabel}>Modül</Text>
            </View>
          </View>
        )}

        {/* Badges */}
        {stats && stats.badges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Rozetler</Text>
            <FlatList
              data={stats.badges}
              keyExtractor={(b) => b.id}
              renderItem={({ item }) => <BadgeCard badge={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgesList}
              scrollEnabled={false}
            />
          </>
        )}

        {/* Streak Info */}
        {stats && (
          <View style={styles.streakCard}>
            <Text style={styles.streakTitle}>🔥 Seri Bilgisi</Text>
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>
                  {stats.streak_info.current_streak}
                </Text>
                <Text style={styles.streakLabel}>Günlük Seri</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>
                  {stats.streak_info.next_milestone}
                </Text>
                <Text style={styles.streakLabel}>Sonraki Hedef</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>
                  {stats.streak_info.days_to_next_milestone}
                </Text>
                <Text style={styles.streakLabel}>Kalan Gün</Text>
              </View>
            </View>
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
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
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16 },
  profileCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D44',
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(124,58,237,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  avatarText: { color: '#A78BFA', fontSize: 28, fontWeight: '800' },
  username: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  email: { color: '#9CA3AF', fontSize: 14 },
  xpCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D44',
    gap: 4,
  },
  statEmoji: { fontSize: 24 },
  statValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#9CA3AF', fontSize: 12 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  badgesList: { gap: 10, paddingBottom: 4 },
  streakCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(251,146,60,0.3)',
    gap: 16,
  },
  streakTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  streakItem: { alignItems: 'center', gap: 4 },
  streakValue: { color: '#FB923C', fontSize: 22, fontWeight: '800' },
  streakLabel: { color: '#9CA3AF', fontSize: 12 },
  streakDivider: { width: 1, height: 40, backgroundColor: '#2D2D44' },
  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    marginTop: 8,
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
});
