// Öğren — Duolingo tarzı dikey yol görünümü
import React, { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
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

const TYPE_EMOJI: Record<string, string> = {
  multiple_choice: '🎯',
  true_false: '✅',
  fill_in_blank: '✏️',
  code_editor: '💻',
  reorder: '🔄',
  multi_select: '☑️',
  spot_the_bug: '🐛',
  code_completion: '🔧',
  true_false_reason: '🤔',
  default: '📖',
};

// Zigzag: sağ → orta → sol → orta → ...
const ZIGZAG = [
  { alignSelf: 'flex-end' as const, mr: 24 },
  { alignSelf: 'center' as const, mr: 0 },
  { alignSelf: 'flex-start' as const, ml: 24 },
  { alignSelf: 'center' as const, mr: 0 },
];

function LessonNode({
  lesson,
  zigIdx,
  showConnector,
  connectorDone,
  onPress,
}: {
  lesson: Lesson;
  zigIdx: number;
  showConnector: boolean;
  connectorDone: boolean;
  onPress: () => void;
}) {
  const completed = lesson.is_completed;
  const locked = lesson.is_locked;
  const active = !completed && !locked;
  const pos = ZIGZAG[zigIdx % 4];
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (locked) return;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 70, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 90, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const nodeBg = completed ? '#15803D' : active ? '#6D28D9' : '#1E1E38';
  const nodeBorder = completed ? '#22C55E' : active ? '#A78BFA' : '#3D3D5B';
  const emoji = TYPE_EMOJI[lesson.lesson_type] ?? TYPE_EMOJI.default;

  const wrapperStyle: any = {
    alignSelf: pos.alignSelf,
    alignItems: 'center',
  };
  if ((pos as any).mr) wrapperStyle.marginRight = (pos as any).mr;
  if ((pos as any).ml) wrapperStyle.marginLeft = (pos as any).ml;

  return (
    <View style={[styles.nodeOuter, wrapperStyle]}>
      {active && <View style={styles.nodeGlow} />}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.node,
            { backgroundColor: nodeBg, borderColor: nodeBorder },
            active && styles.nodeShadowActive,
            completed && styles.nodeShadowDone,
          ]}
          onPress={handlePress}
          disabled={locked}
          activeOpacity={0.85}
        >
          {completed ? (
            <Text style={styles.nodeCheck}>✓</Text>
          ) : locked ? (
            <Text style={styles.nodeEmoji}>🔒</Text>
          ) : (
            <Text style={styles.nodeEmoji}>{emoji}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <View style={[styles.nodeLabel, locked && { opacity: 0.4 }]}>
        <Text style={styles.nodeLabelText} numberOfLines={2}>
          {lesson.title}
        </Text>
        <Text style={styles.nodeXP}>⚡ {lesson.xp_reward} XP</Text>
        {active && <Text style={styles.nodeActiveBadge}>SIRADAKI</Text>}
      </View>

      {showConnector && (
        <View style={[styles.connector, connectorDone ? styles.connectorDone : styles.connectorPending]} />
      )}
    </View>
  );
}

function ModuleSection({
  module,
  startZigIdx,
  onLessonPress,
}: {
  module: Module;
  startZigIdx: number;
  onLessonPress: (id: string) => void;
}) {
  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons', module.slug],
    queryFn: () => getLessons(module.slug),
  });

  const completed = lessons?.filter((l) => l.is_completed).length ?? 0;
  const total = lessons?.length ?? 0;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View style={styles.moduleSection}>
      {/* Module banner */}
      <LinearGradient
        colors={['#1C1040', '#130E38']}
        style={styles.moduleBanner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.moduleBannerRow}>
          <View style={styles.moduleTitleCol}>
            <Text style={styles.moduleSectionLabel}>MODÜL</Text>
            <Text style={styles.moduleTitle}>{module.title}</Text>
          </View>
          <View style={styles.moduleCountBadge}>
            <Text style={styles.moduleCountText}>{completed}/{total}</Text>
            <Text style={styles.moduleCountSub}>ders</Text>
          </View>
        </View>
        {total > 0 && (
          <View style={styles.moduleBarBg}>
            <View style={[styles.moduleBarFill, { width: `${pct}%` }]} />
          </View>
        )}
      </LinearGradient>

      {/* Lesson nodes */}
      {isLoading && (
        <View style={styles.loadingNodes}>
          <ActivityIndicator size="small" color="#7C3AED" />
        </View>
      )}
      {lessons?.map((lesson, idx) => (
        <LessonNode
          key={lesson.id}
          lesson={lesson}
          zigIdx={startZigIdx + idx}
          showConnector={idx < lessons.length - 1}
          connectorDone={lesson.is_completed && (lessons[idx + 1]?.is_completed ?? false)}
          onPress={() => onLessonPress(lesson.id)}
        />
      ))}
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
    }, [refetch, queryClient])
  );

  // Zigzag sayacını modüller arasında süreklileştir
  let zigCounter = 0;
  const moduleZigStarts: number[] = [];
  if (modules) {
    for (const _m of modules) {
      moduleZigStarts.push(zigCounter);
      // Her modüldeki ders sayısını bilmiyoruz burada ama
      // genel zigzag için sabit bir offset kullan
      zigCounter += 10;
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A12" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Öğren</Text>
        <Text style={styles.headerSub}>Kodlama yolculuğuna devam et 🚀</Text>
      </View>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
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
          contentContainerStyle={styles.pathContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Arka plan yolu çizgisi */}
          <View style={styles.pathLine} pointerEvents="none" />

          {modules.map((module, mIdx) => (
            <ModuleSection
              key={module.id}
              module={module}
              startZigIdx={moduleZigStarts[mIdx] ?? 0}
              onLessonPress={(id) => router.push(`/lesson/${id}`)}
            />
          ))}

          {/* Yol sonu */}
          <View style={styles.pathEnd}>
            <View style={styles.pathEndCircle}>
              <Text style={styles.pathEndEmoji}>🏁</Text>
            </View>
            <Text style={styles.pathEndText}>Devam edecek...</Text>
          </View>
          <View style={{ height: 80 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const NODE = 66;
const GLOW = NODE + 22;

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
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: 0.3 },
  headerSub: { color: '#9CA3AF', fontSize: 13, marginTop: 3, fontWeight: '500' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  loadingText: { color: '#6B7280', fontSize: 14 },
  errorText: { color: '#EF4444', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  retryBtn: { backgroundColor: '#7C3AED', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  scroll: { flex: 1 },
  pathContent: { alignItems: 'center', paddingTop: 20, paddingBottom: 40, paddingHorizontal: 16 },
  pathLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#17172A',
    borderRadius: 2,
  },

  // Module section
  moduleSection: { width: '100%', alignItems: 'center', gap: 0 },
  moduleBanner: {
    width: '100%',
    borderRadius: 18,
    padding: 16,
    marginVertical: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.2)',
    gap: 10,
  },
  moduleBannerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  moduleTitleCol: { flex: 1, gap: 2 },
  moduleSectionLabel: {
    color: '#A78BFA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  moduleTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  moduleCountBadge: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.3)',
  },
  moduleCountText: { color: '#A78BFA', fontSize: 16, fontWeight: '900' },
  moduleCountSub: { color: '#6B7280', fontSize: 10, fontWeight: '600' },
  moduleBarBg: {
    height: 5,
    backgroundColor: '#2D2D4B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  moduleBarFill: {
    height: '100%',
    backgroundColor: '#A78BFA',
    borderRadius: 3,
  },
  loadingNodes: { paddingVertical: 20 },

  // Lesson node
  nodeOuter: {
    alignItems: 'center',
    marginVertical: 6,
    width: 140,
    zIndex: 1,
  },
  nodeGlow: {
    position: 'absolute',
    top: -11,
    width: GLOW,
    height: GLOW,
    borderRadius: GLOW / 2,
    backgroundColor: 'rgba(109,40,217,0.2)',
  },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3.5,
  },
  nodeShadowActive: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  nodeShadowDone: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nodeEmoji: { fontSize: 26 },
  nodeCheck: { fontSize: 28, color: '#FFFFFF', fontWeight: '900' },
  nodeLabel: { alignItems: 'center', maxWidth: 130, gap: 3, marginTop: 8 },
  nodeLabelText: { color: '#E5E7EB', fontSize: 12, fontWeight: '700', textAlign: 'center', lineHeight: 16 },
  nodeXP: { color: '#A78BFA', fontSize: 11, fontWeight: '700' },
  nodeActiveBadge: {
    backgroundColor: 'rgba(124,58,237,0.2)',
    color: '#A78BFA',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.4)',
    overflow: 'hidden',
  },
  connector: { width: 4, height: 30, borderRadius: 2, marginTop: 6 },
  connectorDone: { backgroundColor: '#16A34A' },
  connectorPending: { backgroundColor: '#2D2D4B' },

  // Path end
  pathEnd: { alignItems: 'center', gap: 8, marginTop: 16 },
  pathEndCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1E1E38',
    borderWidth: 2,
    borderColor: '#3D3D5B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathEndEmoji: { fontSize: 24 },
  pathEndText: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
});
