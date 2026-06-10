// Öğren — Modül kartları + genişletilebilir ders yol haritası
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getModules, getLessons } from '../../src/api/lessons';
import type { Module, Lesson } from '../../src/types/lesson';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TYPE_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  multiple_choice: 'help-circle-outline',
  true_false: 'checkmark-circle-outline',
  fill_in_blank: 'create-outline',
  code_editor: 'code-slash',
  reorder: 'swap-vertical-outline',
  multi_select: 'checkbox-outline',
  spot_the_bug: 'bug-outline',
  code_completion: 'construct-outline',
  true_false_reason: 'chatbubble-outline',
  default: 'book-outline',
};

function LessonRow({ lesson, onPress }: { lesson: Lesson; onPress: () => void }) {
  const completed = lesson.is_completed;
  const locked = lesson.is_locked;
  const active = !completed && !locked;

  return (
    <TouchableOpacity
      style={[styles.lessonRow, active && styles.lessonRowActive]}
      onPress={!locked ? onPress : undefined}
      disabled={locked}
      activeOpacity={0.7}
    >
      <View style={[
        styles.lessonDot,
        completed && styles.dotCompleted,
        active && styles.dotActive,
        locked && styles.dotLocked,
      ]}>
        {completed ? (
          <Ionicons name="checkmark" size={13} color="#fff" />
        ) : locked ? (
          <Ionicons name="lock-closed" size={11} color="#374151" />
        ) : (
          <View style={styles.dotActiveInner} />
        )}
      </View>

      <View style={styles.lessonRowInfo}>
        <Text
          style={[styles.lessonTitle, locked && styles.lessonTitleLocked]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {lesson.title}
        </Text>
        <Text style={[styles.lessonType, locked && { opacity: 0.4 }]}>
          {lesson.lesson_type?.replace(/_/g, ' ') ?? 'ders'}
        </Text>
      </View>

      <View style={styles.lessonRowRight}>
        {!locked && (
          <View style={[styles.xpPill, completed && styles.xpPillDone]}>
            <Text style={[styles.xpPillText, completed && styles.xpPillTextDone]}>
              +{lesson.xp_reward}
            </Text>
          </View>
        )}
        {active && (
          <Ionicons name="chevron-forward" size={14} color="#7C3AED" style={{ marginLeft: 4 }} />
        )}
      </View>
    </TouchableOpacity>
  );
}

function ModuleCard({
  module,
  onLessonPress,
  defaultOpen,
}: {
  module: Module;
  onLessonPress: (id: string) => void;
  defaultOpen?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultOpen ?? false);

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons', module.slug],
    queryFn: () => getLessons(module.slug),
  });

  const completed = lessons?.filter((l) => l.is_completed).length ?? 0;
  const total = lessons?.length ?? 0;
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const allDone = total > 0 && completed === total;
  const hasActive = lessons?.some((l) => !l.is_completed && !l.is_locked);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <View style={[styles.moduleCard, hasActive && !expanded && styles.moduleCardActive]}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.8} style={styles.moduleHeader}>
        <LinearGradient
          colors={allDone ? ['#052E16', '#064E3B'] : hasActive ? ['#1C1040', '#130E38'] : ['#111124', '#0F0F1A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.moduleHeaderGradient}
        >
          <View style={[styles.moduleIconWrap, allDone && styles.moduleIconWrapDone]}>
            <Ionicons
              name={allDone ? 'checkmark-circle' : 'code-slash'}
              size={20}
              color={allDone ? '#22C55E' : '#A78BFA'}
            />
          </View>

          <View style={styles.moduleInfo}>
            <Text style={styles.moduleLabel}>MODÜL</Text>
            <Text style={styles.moduleTitle} numberOfLines={1} ellipsizeMode="tail">
              {module.title}
            </Text>
          </View>

          <View style={styles.moduleRightCol}>
            <View style={styles.modulePill}>
              <Text style={styles.modulePillText}>
                {isLoading ? '...' : `${completed}/${total}`}
              </Text>
            </View>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#6B7280"
            />
          </View>
        </LinearGradient>

        {/* İlerleme çubuğu */}
        {total > 0 && (
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${pct}%` as any }, allDone && styles.progressBarDone]} />
          </View>
        )}
      </TouchableOpacity>

      {/* Ders listesi — genişlemiş */}
      {expanded && (
        <View style={styles.lessonListWrap}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#7C3AED" style={{ paddingVertical: 20 }} />
          ) : !lessons?.length ? (
            <Text style={styles.emptyText}>Bu modülde henüz ders yok.</Text>
          ) : (
            lessons.map((lesson, idx) => (
              <View key={lesson.id}>
                <LessonRow lesson={lesson} onPress={() => onLessonPress(lesson.id)} />
                {idx < lessons.length - 1 && <View style={styles.lessonDivider} />}
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
}

export default function LearnScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: modules, isLoading, error, refetch } = useQuery({
    queryKey: ['modules'],
    queryFn: getModules,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    }, [refetch, queryClient]),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A12" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Öğren</Text>
          <Text style={styles.headerSub}>Modüle bas, yol haritasını aç</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="map-outline" size={20} color="#A78BFA" />
        </View>
      </View>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Modüller yüklenemedi.</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !error && modules && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {modules.map((module, idx) => (
            <ModuleCard
              key={module.id}
              module={module}
              onLessonPress={(id) => router.push(`/lesson/${id}`)}
              defaultOpen={idx === 0}
            />
          ))}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A12' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1E1E30',
    backgroundColor: '#0F0F1A',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: 0.3 },
  headerSub: { color: '#6B7280', fontSize: 12, marginTop: 2, fontWeight: '500' },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  errorText: { color: '#EF4444', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  retryBtn: { backgroundColor: '#7C3AED', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },

  // Module card
  moduleCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#1E1E35',
    backgroundColor: '#0F0F1A',
  },
  moduleCardActive: {
    borderColor: 'rgba(124,58,237,0.35)',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  moduleHeader: {},
  moduleHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  moduleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(124,58,237,0.25)',
    flexShrink: 0,
  },
  moduleIconWrapDone: {
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderColor: 'rgba(34,197,94,0.25)',
  },
  moduleInfo: { flex: 1, gap: 2 },
  moduleLabel: { color: '#6B7280', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  moduleTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  moduleRightCol: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  modulePill: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
  },
  modulePillText: { color: '#A78BFA', fontSize: 12, fontWeight: '800' },

  // Progress bar
  progressBarBg: {
    height: 3,
    backgroundColor: '#1E1E35',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
  },
  progressBarDone: { backgroundColor: '#22C55E' },

  // Lesson list
  lessonListWrap: {
    backgroundColor: '#0A0A10',
    borderTopWidth: 1,
    borderTopColor: '#1E1E30',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
  },
  lessonRowActive: {
    backgroundColor: 'rgba(124,58,237,0.04)',
  },
  lessonDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dotCompleted: { backgroundColor: '#16A34A' },
  dotActive: {
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  dotLocked: { backgroundColor: '#111124', borderWidth: 1.5, borderColor: '#1E1E30' },
  dotActiveInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7C3AED' },

  lessonRowInfo: { flex: 1 },
  lessonTitle: { color: '#E5E7EB', fontSize: 14, fontWeight: '700' },
  lessonTitleLocked: { color: '#374151' },
  lessonType: { color: '#6B7280', fontSize: 11, marginTop: 2, fontWeight: '500', textTransform: 'capitalize' },

  lessonRowRight: { flexDirection: 'row', alignItems: 'center' },
  xpPill: {
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
  },
  xpPillDone: { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.2)' },
  xpPillText: { color: '#A78BFA', fontSize: 11, fontWeight: '800' },
  xpPillTextDone: { color: '#22C55E' },

  lessonDivider: { height: 1, backgroundColor: '#111124', marginHorizontal: 16 },
  emptyText: { color: '#4B5563', fontSize: 13, textAlign: 'center', paddingVertical: 20 },
});
