// Profil ekranı
import React from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getUserStats } from '../../src/api/gamification';
import { useAuthStore } from '../../src/store/authStore';
import { XPBar } from '../../src/components/XPBar';
import { SkeletonCard } from '../../src/components/LoadingSkeleton';

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

function ActivityWeek({ streak }: { streak: number }) {
  const today = new Date().getDay();
  // 0=Pazar, pazar'ı sona al
  const dayIndex = today === 0 ? 6 : today - 1;

  return (
    <View style={styles.activityRow}>
      {WEEKDAYS.map((day, i) => {
        const isPast = i <= dayIndex;
        const isToday = i === dayIndex;
        const isActive = isPast && streak > (dayIndex - i);
        return (
          <View key={day} style={styles.activityDay}>
            <View style={[
              styles.activityDot,
              isActive && styles.activityDotActive,
              isToday && isActive && styles.activityDotToday,
            ]}>
              {isActive && <View style={styles.activityDotInner} />}
            </View>
            <Text style={[styles.activityLabel, isToday && styles.activityLabelToday]}>
              {day}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

interface StatItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
  value: string | number;
  label: string;
}

function StatItem({ icon, iconColor, iconBg, value, label }: StatItemProps) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

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
        { text: 'Çıkış Yap', style: 'destructive', onPress: logout },
      ],
    );
  };

  const level = stats?.level_progress?.current_level ?? 1;
  const initials = user?.username?.[0]?.toUpperCase() ?? '?';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A12" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO SECTION ── */}
        <LinearGradient
          colors={['#1C1040', '#0F0A28', '#0A0A12']}
          style={styles.heroSection}
        >
          {/* Avatar */}
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={['#7C3AED', '#4C1D95']}
              style={styles.avatarGradient}
            >
              <Ionicons name="person" size={40} color="rgba(255,255,255,0.2)" style={{ position: 'absolute' }} />
              <Text style={styles.avatarInitial}>{initials}</Text>
            </LinearGradient>
          </View>

          {/* Level badge */}
          <View style={styles.levelBadge}>
            <Ionicons name="star" size={10} color="#F59E0B" />
            <Text style={styles.levelBadgeText}>Seviye {level}</Text>
          </View>

          <Text style={styles.heroUsername}>{user?.username}</Text>
          <Text style={styles.heroEmail}>{user?.email}</Text>

          {/* Streak row */}
          {stats && (
            <View style={styles.heroStreakRow}>
              <View style={styles.heroStreakItem}>
                <Text style={styles.heroStreakValue}>{stats.streak}🔥</Text>
                <Text style={styles.heroStreakLabel}>Günlük Seri</Text>
              </View>
              <View style={styles.heroStreakDivider} />
              <View style={styles.heroStreakItem}>
                <Text style={styles.heroStreakValue}>{stats.total_xp} ⚡</Text>
                <Text style={styles.heroStreakLabel}>Toplam XP</Text>
              </View>
            </View>
          )}
        </LinearGradient>

        {/* ── XP BARRI ── */}
        {isLoading ? (
          <SkeletonCard height={72} />
        ) : stats ? (
          <View style={styles.xpCard}>
            <View style={styles.xpCardHeader}>
              <Text style={styles.xpCardTitle}>Seviye İlerlemesi</Text>
              <Text style={styles.xpCardSub}>
                {stats.level_progress.current_xp} / {stats.level_progress.xp_needed_for_next} XP
              </Text>
            </View>
            <XPBar
              currentXp={stats.level_progress.current_xp}
              xpNeeded={stats.level_progress.xp_needed_for_next}
              level={stats.level_progress.current_level}
              progressPercentage={stats.level_progress.progress_percentage}
            />
          </View>
        ) : null}

        {/* ── HAFTALIK AKTİVİTE ── */}
        {stats && (
          <View style={styles.activityCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={16} color="#A78BFA" />
              <Text style={styles.sectionTitle}>Bu Haftaki Aktivite</Text>
            </View>
            <ActivityWeek streak={stats.streak} />
          </View>
        )}

        {/* ── İSTATİSTİK KARTLARI ── */}
        {stats && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="bar-chart-outline" size={16} color="#A78BFA" />
              <Text style={styles.sectionTitle}>İstatistikler</Text>
            </View>
            <View style={styles.statsGrid}>
              <StatItem
                icon="book"
                iconColor="#818CF8"
                iconBg="rgba(129,140,248,0.12)"
                value={stats.total_lessons_completed}
                label="Tamamlanan Ders"
              />
              <StatItem
                icon="flame"
                iconColor="#F97316"
                iconBg="rgba(249,115,22,0.12)"
                value={stats.streak}
                label="Gün Serisi"
              />
              <StatItem
                icon="layers"
                iconColor="#22D3EE"
                iconBg="rgba(34,211,238,0.12)"
                value={stats.total_modules_completed}
                label="Tamamlanan Modül"
              />
              <StatItem
                icon="ribbon"
                iconColor="#F59E0B"
                iconBg="rgba(245,158,11,0.12)"
                value={stats.badges?.length ?? 0}
                label="Rozet"
              />
            </View>
          </>
        )}

        {/* ── SERİ BİLGİSİ ── */}
        {stats && (
          <View style={styles.streakCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flame" size={16} color="#F97316" />
              <Text style={styles.sectionTitle}>Seri Detayı</Text>
            </View>
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>{stats.streak_info.current_streak}</Text>
                <Text style={styles.streakLabel}>Günlük Seri</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>{stats.streak_info.next_milestone}</Text>
                <Text style={styles.streakLabel}>Hedef</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>{stats.streak_info.days_to_next_milestone}</Text>
                <Text style={styles.streakLabel}>Kalan Gün</Text>
              </View>
            </View>
            {stats.streak_info.days_to_next_milestone <= 3 && (
              <View style={styles.streakAlert}>
                <Ionicons name="flash" size={13} color="#F59E0B" />
                <Text style={styles.streakAlertText}>
                  Hedefe {stats.streak_info.days_to_next_milestone} gün kaldı!
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── ROZETLER ── */}
        {stats && stats.badges.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="ribbon" size={16} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Rozetler ({stats.badges.length})</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
            >
              {stats.badges.map((b) => (
                <View key={b.id} style={styles.badgePill}>
                  <Ionicons name="medal" size={20} color="#F59E0B" />
                  <Text style={styles.badgeName} numberOfLines={1}>{b.title}</Text>
                </View>
              ))}

            </ScrollView>
          </>
        )}

        {/* ── ÇIKIŞ ── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A12' },
  scroll: { flex: 1 },
  content: { gap: 14, paddingBottom: 16 },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 20,
    gap: 6,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarGradient: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarInitial: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', zIndex: 1 },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  levelBadgeText: { color: '#F59E0B', fontSize: 11, fontWeight: '800' },
  heroUsername: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginTop: 2 },
  heroEmail: { color: '#6B7280', fontSize: 13 },
  heroStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroStreakItem: { alignItems: 'center', gap: 3 },
  heroStreakValue: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  heroStreakLabel: { color: '#9CA3AF', fontSize: 11, fontWeight: '600' },
  heroStreakDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.1)' },

  // XP card
  xpCard: {
    backgroundColor: '#111124',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#1E1E35',
    gap: 12,
  },
  xpCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpCardTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  xpCardSub: { color: '#6B7280', fontSize: 12, fontWeight: '600' },

  // Activity
  activityCard: {
    backgroundColor: '#111124',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#1E1E35',
    gap: 14,
  },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  activityDay: { alignItems: 'center', gap: 6 },
  activityDot: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#1A1A2E',
    borderWidth: 1.5,
    borderColor: '#1E1E35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityDotActive: { backgroundColor: 'rgba(124,58,237,0.2)', borderColor: '#7C3AED' },
  activityDotToday: {
    backgroundColor: '#7C3AED',
    borderColor: '#A78BFA',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  activityDotInner: { width: 10, height: 10, borderRadius: 4, backgroundColor: '#A78BFA' },
  activityLabel: { color: '#4B5563', fontSize: 10, fontWeight: '600' },
  activityLabelToday: { color: '#A78BFA', fontWeight: '800' },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
  },
  sectionTitle: { color: '#E5E7EB', fontSize: 15, fontWeight: '800' },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#111124',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1E1E35',
    gap: 8,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  statLabel: { color: '#6B7280', fontSize: 11, fontWeight: '600', textAlign: 'center' },

  // Streak card
  streakCard: {
    backgroundColor: '#111124',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(249,115,22,0.2)',
    gap: 14,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  streakItem: { alignItems: 'center', gap: 5 },
  streakValue: { color: '#F97316', fontSize: 24, fontWeight: '900' },
  streakLabel: { color: '#9CA3AF', fontSize: 11, fontWeight: '600' },
  streakDivider: { width: 1, height: 44, backgroundColor: '#1E1E35' },
  streakAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  streakAlertText: { color: '#F59E0B', fontSize: 12, fontWeight: '700' },

  // Badges
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(245,158,11,0.25)',
    maxWidth: 160,
  },
  badgeName: { color: '#F59E0B', fontSize: 12, fontWeight: '700' },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: 14,
    paddingVertical: 15,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  logoutText: { color: '#EF4444', fontSize: 15, fontWeight: '700' },
});
