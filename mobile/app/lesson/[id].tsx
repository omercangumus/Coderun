// Ders/Quiz ekranı — Flutter lesson_screen.dart'tan

import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchLessonDetail, submitLessonAnswers } from '../../src/api/lessons';
import type { Question, LessonResult } from '../../src/types/lesson';
import { QuizOption } from '../../src/components/QuizOption';
import { GhostieImage } from '../../src/components/GhostieImage';
import type { GhostieState } from '../../src/components/GhostieImage';
import { useHaptic } from '../../src/hooks/useHaptic';

interface AnswerMap {
  [questionId: string]: unknown;
}

function QuestionCard({
  question,
  selectedAnswer,
  onAnswer,
  answered,
  isCorrect,
}: {
  question: Question;
  selectedAnswer: unknown;
  onAnswer: (answer: unknown) => void;
  answered: boolean;
  isCorrect?: boolean;
}) {
  const options = question.options as Record<string, string> | null;

  return (
    <View style={styles.questionCard}>
      {question.code_block && (
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{question.code_block}</Text>
        </View>
      )}
      <Text style={styles.questionText}>{question.question_text}</Text>

      {/* Multiple choice / true-false */}
      {options && (
        <View style={styles.optionsList}>
          {Object.entries(options).map(([key, value]) => (
            <QuizOption
              key={key}
              label={`${key.toUpperCase()}. ${value}`}
              isSelected={selectedAnswer === key}
              isCorrect={answered && isCorrect && selectedAnswer === key}
              isWrong={answered && !isCorrect && selectedAnswer === key}
              onPress={() => onAnswer(key)}
              disabled={answered}
            />
          ))}
        </View>
      )}

      {question.hint && (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>💡 {question.hint}</Text>
        </View>
      )}
    </View>
  );
}

function ResultScreen({
  result,
  onBack,
}: {
  result: LessonResult;
  onBack: () => void;
}) {
  const passed = result.passed;

  return (
    <View style={styles.resultContainer}>
      <GhostieImage state={passed ? 'happy' : 'sad'} size={100} />
      <Text style={styles.resultTitle}>
        {passed ? 'Tebrikler! 🎉' : 'Tekrar Dene'}
      </Text>
      <Text style={styles.resultSubtitle}>
        {result.correct_count}/{result.total_questions} doğru cevap
      </Text>

      <View style={styles.resultStats}>
        <View style={styles.resultStat}>
          <Text style={styles.resultStatValue}>{result.score}</Text>
          <Text style={styles.resultStatLabel}>Puan</Text>
        </View>
        <View style={styles.resultStat}>
          <Text style={styles.resultStatValue}>+{result.xp_earned}</Text>
          <Text style={styles.resultStatLabel}>XP</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>
          {passed ? 'Öğrenmeye Devam Et' : 'Geri Dön'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { successNotification, errorNotification } = useHaptic();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [ghostieState, setGhostieState] = useState<GhostieState>('idle');
  const [result, setResult] = useState<LessonResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['lessonDetail', id],
    queryFn: () => fetchLessonDetail(id),
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: (ans: AnswerMap) =>
      submitLessonAnswers(id, {
        answers: Object.entries(ans).map(([question_id, answer]) => ({
          question_id,
          answer,
        })),
      }),
    onSuccess: (res) => {
      setResult(res);
      if (res.passed) {
        successNotification();
        setGhostieState('happy');
      } else {
        errorNotification();
        setGhostieState('sad');
      }
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Ders yüklenemedi.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const questions = data.questions;
  const currentQuestion: Question | undefined = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (currentIndex + 1) / totalQuestions : 0;
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  if (result) {
    return (
      <SafeAreaView style={styles.safe}>
        <ResultScreen result={result} onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  const handleAnswer = (answer: unknown) => {
    if (!currentQuestion) return;
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setGhostieState('thinking');
    } else {
      // Submit
      setSubmitting(true);
      submitMutation.mutate(answers, {
        onSettled: () => setSubmitting(false),
      });
    }
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const canProceed = currentAnswer !== undefined;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.lessonHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1}/{totalQuestions}
          </Text>
        </View>
        <GhostieImage state={ghostieState} size={36} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={currentAnswer}
            onAnswer={handleAnswer}
            answered={false}
          />
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed || submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Tamamla' : 'Devam Et →'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F1A' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 20,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A2E',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { color: '#9CA3AF', fontSize: 14, fontWeight: '700' },
  progressContainer: { flex: 1, gap: 4 },
  progressBar: {
    height: 6,
    backgroundColor: '#2D2D44',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 3,
  },
  progressText: { color: '#9CA3AF', fontSize: 11, textAlign: 'right' },
  scroll: { flex: 1 },
  content: { padding: 20 },
  questionCard: { gap: 16 },
  codeBlock: {
    backgroundColor: '#0A0A14',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  codeText: {
    color: '#A78BFA',
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  optionsList: { gap: 2 },
  hintBox: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
  },
  hintText: { color: '#A78BFA', fontSize: 13, lineHeight: 18 },
  footer: { padding: 20, paddingBottom: 24 },
  nextButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: { opacity: 0.4 },
  nextButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  errorText: { color: '#EF4444', fontSize: 16, textAlign: 'center' },
  backButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 16,
  },
  backButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 20,
  },
  resultTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '800' },
  resultSubtitle: { color: '#9CA3AF', fontSize: 16 },
  resultStats: { flexDirection: 'row', gap: 40 },
  resultStat: { alignItems: 'center', gap: 4 },
  resultStatValue: { color: '#7C3AED', fontSize: 28, fontWeight: '800' },
  resultStatLabel: { color: '#9CA3AF', fontSize: 13 },
});
