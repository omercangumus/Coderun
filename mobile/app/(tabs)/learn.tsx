// Öğren ekranı — Flutter learn_tab.dart'tan, modül/ders listesi

import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getModules, getLessons } from '../../src/api/lessons';
import type { Module, Lesson } from '../../src/types/lesson';
import { SkeletonCard } from '../../src/components/LoadingSkeleton';

function LessonTypeIcon({ type }: { type: string }) {
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
  return <Text style={styles.lessonIcon}>{icons[type] ?? icons['default']}</Text>;
}

function LessonRow({
  lesson,
  onPress,
}: {
  lesson: Lesson;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.lessonRow,
        lesson.is_locked && styles.lessonLocked,
        lesson.is_completed && styles.lessonCompleted,
      ]}
      onPress={onPress}
      disabled={lesson.is_locked}
      activeOpacity={0.75}
    >
      <LessonTypeIcon type={lesson.lesson_type} />
      <View style={styles.lessonInfo}>
        <Text
          style={[
            styles.lessonTitle,
            lesson.is_locked && styles.lockedText,
          ]}
          numberOfLines={1}
        >
          {lesson.title}
        </Text>
        <Text style={styles.lessonMeta}>
          {lesson.xp_reward} XP
          {lesson.is_completed && ' • Tamamlandı ✓'}
          {lesson.is_locked && ` • ${lesson.locked_reason ?? 'Kilitli'}`}
        </Text>
      </View>
      {lesson.is_completed && <Text style={styles.checkmark}>✓</Text>}
      {lesson.is_locked && <Text style={styles.lockIcon}>🔒</Text>}
    </TouchableOpacity>
  );
}

function ModuleCard({ module }: { module: Module }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const {
    data: lessons,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lessons', module.slug],
    queryFn: () => getLessons(module.slug),
    enabled: expanded,
  });

  return (
    <View style={styles.moduleCard}>
      <TouchableOpacity
        style={styles.moduleHeader}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.8}
      >
        <View style={styles.moduleInfo}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleDesc} numberOfLines={2}>
            {module.description}
          </Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
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
  const { data: modules, isLoading, error, refetch } = useQuery({
    queryKey: ['modules'],
    queryFn: getModules,
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Öğren</Text>
        <Text style={styles.headerSub}>Modülleri keşfet ve öğren</Text>
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
  safe: { flex: 1, backgroundColor: '#0F0F1A' },
  header: {
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A2E',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#9CA3AF', fontSize: 14, marginTop: 2 },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  moduleCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  moduleInfo: { flex: 1, marginRight: 12 },
  moduleTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  moduleDesc: { color: '#9CA3AF', fontSize: 13, lineHeight: 18 },
  chevron: { color: '#7C3AED', fontSize: 14, fontWeight: '700' },
  lessonsList: {
    borderTopWidth: 1,
    borderTopColor: '#2D2D44',
    padding: 12,
    gap: 8,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F1A',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2D2D44',
    gap: 10,
  },
  lessonLocked: { opacity: 0.5 },
  lessonCompleted: { borderColor: 'rgba(34,197,94,0.3)' },
  lessonIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  lessonInfo: { flex: 1 },
  lessonTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  lockedText: { color: '#6B7280' },
  lessonMeta: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  checkmark: { color: '#22C55E', fontSize: 16, fontWeight: '700' },
  lockIcon: { fontSize: 14 },
  errorCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    gap: 12,
  },
  errorText: { color: '#EF4444', fontSize: 14, textAlign: 'center' },
  retryBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
