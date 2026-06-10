// Öğren ekranı — Flutter learn_tab.dart'tan, modül/ders listesi

import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { getModules, getLessons } from '../../src/api/lessons';
import type { Module, Lesson } from '../../src/types/lesson';
import { SkeletonCard } from '../../src/components/LoadingSkeleton';

function LessonTypeIcon({ type, isCompleted, isLocked }: { type: string; isCompleted: boolean; isLocked: boolean }) {
  const icons: Record<string, string> = {
    multiple_choice: '🎯',
    true_false: '✅',
    fill_in_blank: '✏️',
    code_editor: '💻',
    reorder: '🔄',
    multi_select: '☑️',
    spot_the_bug: '🐛',
    default: '📖',
  };

  const getBadgeStyles = () => {
    if (isCompleted) {
      return {
        bg: 'rgba(34,197,94,0.12)',
        border: 'rgba(34,197,94,0.3)',
      };
    }
    if (isLocked) {
      return {
        bg: 'rgba(75,85,99,0.1)',
        border: 'rgba(75,85,99,0.2)',
      };
    }
    // Active
    return {
      bg: 'rgba(124,58,237,0.12)',
      border: 'rgba(124,58,237,0.3)',
    };
  };

  const stylesColors = getBadgeStyles();

  return (
    <View style={[styles.iconCircle, { backgroundColor: stylesColors.bg, borderColor: stylesColors.border }]}>
      <Text style={styles.lessonIconText}>{icons[type] ?? icons['default']}</Text>
    </View>
  );
}

function LessonRow({
  lesson,
  onPress,
}: {
  lesson: Lesson;
  onPress: () => void;
}) {
  const isCompleted = lesson.is_completed;
  const isLocked = lesson.is_locked;
  const isActive = !isCompleted && !isLocked;

  return (
    <TouchableOpacity
      style={[
        styles.lessonRow,
        isLocked && styles.lessonLocked,
        isCompleted && styles.lessonRowCompleted,
        isActive && styles.lessonRowActive,
      ]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.75}
    >
      <LessonTypeIcon type={lesson.lesson_type} isCompleted={isCompleted} isLocked={isLocked} />
      <View style={styles.lessonInfo}>
        <Text
          style={[
            styles.lessonTitle,
            isLocked && styles.lockedText,
          ]}
          numberOfLines={1}
        >
          {lesson.title}
        </Text>
        <Text style={styles.lessonMeta}>
          💰 {lesson.xp_reward} XP
          {isCompleted && <Text style={{ color: '#22C55E', fontWeight: '700' }}> • Tamamlandı ✓</Text>}
          {isLocked && <Text style={{ color: '#6B7280' }}> • {lesson.locked_reason ?? 'Kilitli'}</Text>}
          {isActive && <Text style={{ color: '#A78BFA', fontWeight: '700' }}> • Sıradaki Ders</Text>}
        </Text>
      </View>
      {isCompleted && (
        <View style={styles.checkmarkBadge}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
      {isLocked && <Text style={styles.lockIcon}>🔒</Text>}
    </TouchableOpacity>
  );
}

function ModuleCard({ module }: { module: Module }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  // Fetch immediately to calculate progress indicator on the card header
  const {
    data: lessons,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lessons', module.slug],
    queryFn: () => getLessons(module.slug),
  });

  const completedCount = lessons?.filter((l) => l.is_completed).length ?? 0;
  const totalCount = lessons?.length ?? 0;
  const progressRatio = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <View style={styles.moduleCard}>
      <TouchableOpacity
        style={styles.moduleHeader}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.85}
      >
        <View style={styles.moduleInfo}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleDesc} numberOfLines={2}>
            {module.description}
          </Text>

          {/* Module Progress bar in card header */}
          {totalCount > 0 && (
            <View style={styles.moduleProgressSection}>
              <View style={styles.miniBarBackground}>
                {progressRatio > 0 && (
                  <LinearGradient
                    colors={['#A78BFA', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.miniBarFill, { width: `${progressRatio * 100}%` }]}
                  />
                )}
              </View>
              <Text style={styles.moduleProgressText}>
                {completedCount}/{totalCount} Ders
              </Text>
            </View>
          )}
        </View>
        <View style={styles.chevronBox}>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.lessonsList}>
          {isLoading && <SkeletonCard height={60} />}
          {error && (
            <Text style={styles.errorText}>Dersler yüklenemedi.</Text>
          )}
          {lessons?.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onPress={() => router.push(`/lesson/${lesson.id}`)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default function LearnScreen() {
  const queryClient = useQueryClient();
  const { data: modules, isLoading, error, refetch } = useQuery({
    queryKey: ['modules'],
    queryFn: getModules,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    }, [refetch, queryClient])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A12" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Öğren</Text>
        <Text style={styles.headerSub}>Modülleri keşfet ve becerilerini geliştir</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <>
            <SkeletonCard height={80} />
            <SkeletonCard height={80} />
            <SkeletonCard height={80} />
          </>
        )}

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>Modüller yüklenemedi.</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
              <Text style={styles.retryText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        )}

        {modules?.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A12' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1E1E30',
    backgroundColor: '#0F0F1A',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: 0.5 },
  headerSub: { color: '#9CA3AF', fontSize: 13, marginTop: 4, fontWeight: '500' },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16 },
  moduleCard: {
    backgroundColor: '#111124',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1E1E35',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  moduleInfo: { flex: 1, marginRight: 12, gap: 6 },
  moduleTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  moduleDesc: { color: '#9CA3AF', fontSize: 13, lineHeight: 18, fontWeight: '500' },
  chevronBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E1E38',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2D2D4B',
  },
  chevron: { color: '#A78BFA', fontSize: 12, fontWeight: '800' },
  lessonsList: {
    borderTopWidth: 1.5,
    borderTopColor: '#1E1E35',
    backgroundColor: '#0F0F1D',
    padding: 14,
    gap: 10,
  },
  moduleProgressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  miniBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#1E1E38',
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  moduleProgressText: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '800',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111124',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
    gap: 12,
  },
  lessonRowCompleted: {
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  lessonRowActive: {
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
    borderColor: 'rgba(124,58,237,0.3)',
  },
  lessonLocked: {
    opacity: 0.5,
    borderColor: '#1E1E30',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  lessonIconText: { fontSize: 18 },
  lessonInfo: { flex: 1, gap: 2 },
  lessonTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  lockedText: { color: '#6B7280' },
  lessonMeta: { color: '#9CA3AF', fontSize: 12, fontWeight: '500' },
  checkmarkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1.5,
    borderColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: { color: '#22C55E', fontSize: 11, fontWeight: '900' },
  lockIcon: { fontSize: 14, marginRight: 4 },
  errorCard: {
    backgroundColor: '#1E1E38',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.3)',
    gap: 12,
  },
  errorText: { color: '#EF4444', fontSize: 14, textAlign: 'center', fontWeight: '600' },
  retryBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

