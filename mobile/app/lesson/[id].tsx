// Ders/Quiz ekranı — Flutter lesson_screen.dart'tan, zengin UI/UX tasarımıyla yeniden yazıldı.
import React, { useState, useMemo, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchLessonDetail, submitLessonAnswers } from '../../src/api/lessons';
import { submitCode } from '../../src/api/sandbox';
import type { CodeRunResult } from '../../src/api/sandbox';
import type { Question, LessonResult } from '../../src/types/lesson';
import { QuizOption } from '../../src/components/QuizOption';
import { GhostieImage } from '../../src/components/GhostieImage';
import type { GhostieState } from '../../src/components/GhostieImage';
import { useHaptic } from '../../src/hooks/useHaptic';

interface AnswerMap {
  [questionId: string]: unknown;
}

function CodeBlockHeader({ filename = 'main.py' }: { filename?: string }) {
  return (
    <View style={styles.macOsHeader}>
      <View style={styles.macOsDots}>
        <View style={[styles.macOsDot, { backgroundColor: '#FF5F56' }]} />
        <View style={[styles.macOsDot, { backgroundColor: '#FFBD2E' }]} />
        <View style={[styles.macOsDot, { backgroundColor: '#27C93F' }]} />
      </View>
      <Text style={styles.macOsTitle}>{filename}</Text>
      <View style={{ width: 42 }} />
    </View>
  );
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
  const type = question.question_type;

  // 1. MULTIPLE CHOICE & CODE COMPLETION (with choices)
  if (type === 'multiple_choice' || (type === 'code_completion' && question.options?.choices)) {
    const choices = (question.options?.choices ?? []) as string[];
    return (
      <View style={styles.questionCard}>
        {question.code_block && (
          <View style={styles.editorContainer}>
            <CodeBlockHeader filename="snippet.py" />
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>{question.code_block}</Text>
            </View>
          </View>
        )}
        <Text style={styles.questionText}>{question.question_text}</Text>
        <View style={styles.optionsList}>
          {choices.map((choice, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = selectedAnswer === choice;
            return (
              <QuizOption
                key={choice}
                label={`${letter}. ${choice}`}
                isSelected={isSelected}
                isCorrect={answered && isCorrect && isSelected}
                isWrong={answered && !isCorrect && isSelected}
                onPress={() => onAnswer(choice)}
                disabled={answered}
              />
            );
          })}
        </View>
      </View>
    );
  }

  // 2. TRUE / FALSE WITH REASON
  if (type === 'true_false_reason') {
    const reasons = (question.options?.reasons ?? []) as string[];
    const parsed = typeof selectedAnswer === 'string' ? selectedAnswer.split('|') : [];
    const tf = parsed[0] as 'true' | 'false' | undefined;
    const reasonIdx = parsed[1] ? parseInt(parsed[1], 10) : null;

    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question_text}</Text>

        {/* Step 1: True / False */}
        <Text style={styles.sectionLabel}>BU İFADE DOĞRU MU, YANLIŞ MI?</Text>
        <View style={styles.tfGrid}>
          <TouchableOpacity
            style={[
              styles.tfButton,
              tf === 'true' ? styles.tfButtonTrueActive : styles.tfButtonInactive,
              answered && styles.disabledClick,
            ]}
            onPress={() => !answered && onAnswer(`true|${reasonIdx !== null ? reasonIdx : ''}`)}
            disabled={answered}
          >
            <Text style={[styles.tfButtonText, tf === 'true' && styles.tfTextActive]}>✓ Doğru</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tfButton,
              tf === 'false' ? styles.tfButtonFalseActive : styles.tfButtonInactive,
              answered && styles.disabledClick,
            ]}
            onPress={() => !answered && onAnswer(`false|${reasonIdx !== null ? reasonIdx : ''}`)}
            disabled={answered}
          >
            <Text style={[styles.tfButtonText, tf === 'false' && styles.tfTextActive]}>✗ Yanlış</Text>
          </TouchableOpacity>
        </View>

        {/* Step 2: Reasons */}
        {tf && (
          <View style={styles.reasonsSection}>
            <Text style={styles.sectionLabel}>NEDENİNİ SEÇİN:</Text>
            {reasons.map((reason, index) => {
              const isSelected = reasonIdx === index;
              return (
                <QuizOption
                  key={index}
                  label={reason}
                  isSelected={isSelected}
                  isCorrect={answered && isCorrect && isSelected}
                  isWrong={answered && !isCorrect && isSelected}
                  onPress={() => !answered && onAnswer(`${tf}|${index}`)}
                  disabled={answered}
                />
              );
            })}
          </View>
        )}
      </View>
    );
  }

  // 3. SPOT THE BUG
  if (type === 'spot_the_bug') {
    const lines = question.code_block ? question.code_block.split('\n') : [];
    const fixOptions = (question.options?.fix_options ?? []) as string[];

    const parsed = typeof selectedAnswer === 'string' ? selectedAnswer.split('|') : [];
    const selectedLine = parsed[0] ? parseInt(parsed[0], 10) : null;
    const selectedFix = parsed[1] ?? null;

    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question_text}</Text>

        <Text style={styles.sectionLabel}>HATALI SATIRA TIKLAYIN:</Text>
        <View style={styles.editorContainer}>
          <CodeBlockHeader filename="buggy_code.py" />
          <View style={styles.bugCodeBlock}>
            {lines.map((line, index) => {
              const isBugLine = selectedLine === index;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.bugLineRow,
                    isBugLine && styles.bugLineRowActive,
                    answered && styles.disabledClick,
                  ]}
                  onPress={() => !answered && onAnswer(`${index}|${selectedFix ?? ''}`)}
                  disabled={answered}
                >
                  <View style={styles.bugLineNumberContainer}>
                    <Text style={styles.bugLineNumber}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.bugLineText, isBugLine && styles.bugLineTextActive]}>
                    {line || ' '}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Fix options */}
        {selectedLine !== null && (
          <View style={styles.reasonsSection}>
            <Text style={styles.sectionLabel}>
              SATIR {selectedLine + 1} İÇİN DOĞRU DÜZELTMEYİ SEÇİN:
            </Text>
            {fixOptions.map((fix) => {
              const isSelected = selectedFix === fix;
              return (
                <QuizOption
                  key={fix}
                  label={fix}
                  isSelected={isSelected}
                  isCorrect={answered && isCorrect && isSelected}
                  isWrong={answered && !isCorrect && isSelected}
                  onPress={() => !answered && onAnswer(`${selectedLine}|${fix}`)}
                  disabled={answered}
                />
              );
            })}
          </View>
        )}
      </View>
    );
  }

  // 4. FILL IN THE BLANK / CODE COMPLETION (with blanks)
  if (type === 'fill_in_blank' || type === 'code_completion') {
    const codeBlockText = question.code_block || '';
    const wordBankWords = (question.word_bank?.words ?? []) as string[];
    const numBlanks = (codeBlockText.match(/___/g) || []).length;

    const parsedBlanks = typeof selectedAnswer === 'string' && selectedAnswer ? selectedAnswer.split(',') : [];

    const getInitialBlanks = () => {
      if (parsedBlanks.length === numBlanks) return parsedBlanks;
      return Array(numBlanks).fill('');
    };

    const getInitialUsed = () => {
      const set = new Set<number>();
      if (parsedBlanks.length > 0) {
        parsedBlanks.forEach((word) => {
          const idx = wordBankWords.indexOf(word);
          if (idx !== -1) set.add(idx);
        });
      }
      return set;
    };

    const [filledBlanks, setFilledBlanks] = useState<string[]>(getInitialBlanks);
    const [usedWords, setUsedWords] = useState<Set<number>>(getInitialUsed);

    const handleWordSelect = (word: string, index: number) => {
      if (answered) return;
      const targetIdx = filledBlanks.indexOf('');
      if (targetIdx !== -1) {
        const newBlanks = [...filledBlanks];
        newBlanks[targetIdx] = word;
        setFilledBlanks(newBlanks);

        const newUsed = new Set(usedWords);
        newUsed.add(index);
        setUsedWords(newUsed);

        const allFilled = newBlanks.every((b) => b !== '');
        if (allFilled) {
          onAnswer(newBlanks.join(','));
        }
      }
    };

    const handleBlankClear = (blankIdx: number) => {
      if (answered) return;
      const word = filledBlanks[blankIdx];
      if (!word) return;
      const newBlanks = [...filledBlanks];
      newBlanks[blankIdx] = '';
      setFilledBlanks(newBlanks);

      const wordIdx = wordBankWords.findIndex((w, i) => w === word && usedWords.has(i));
      if (wordIdx !== -1) {
        const newUsed = new Set(usedWords);
        newUsed.delete(wordIdx);
        setUsedWords(newUsed);
      }
      onAnswer(undefined);
    };

    // If there is no word bank (fallback to standard text input)
    if (wordBankWords.length === 0) {
      return (
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.question_text}</Text>
          {question.code_block && (
            <View style={styles.editorContainer}>
              <CodeBlockHeader filename="exercise.py" />
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>{question.code_block}</Text>
              </View>
            </View>
          )}
          <Text style={styles.sectionLabel}>CEVABINIZI YAZIN:</Text>
          <TextInput
            style={styles.textInput}
            value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
            onChangeText={onAnswer}
            placeholder="..."
            placeholderTextColor="#6B7280"
            editable={!answered}
          />
        </View>
      );
    }

    const codeLines = codeBlockText.split('\n');
    let globalBlankCounter = 0;

    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question_text}</Text>

        {/* Code block with blanks */}
        <View style={styles.editorContainer}>
          <CodeBlockHeader filename="exercise.py" />
          <View style={styles.blankCodeBlock}>
            {codeLines.map((line, lineIdx) => {
              const parts = line.split('___');
              return (
                <View key={lineIdx} style={styles.blankLineRow}>
                  {parts.map((part, partIdx) => {
                    const currentBlankIdx = globalBlankCounter;
                    const isLastPart = partIdx === parts.length - 1;
                    if (!isLastPart) {
                      globalBlankCounter++;
                    }
                    return (
                      <React.Fragment key={partIdx}>
                        {part ? <Text style={styles.codeTextInline}>{part}</Text> : null}
                        {!isLastPart && (
                          <TouchableOpacity
                            style={[
                              styles.blankSlot,
                              filledBlanks[currentBlankIdx] ? styles.blankSlotFilled : styles.blankSlotEmpty,
                              answered && styles.disabledClick,
                            ]}
                            onPress={() => handleBlankClear(currentBlankIdx)}
                            disabled={answered}
                          >
                            <Text style={styles.blankSlotText}>
                              {filledBlanks[currentBlankIdx] || '___'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>

        {/* Word Bank */}
        <Text style={styles.sectionLabel}>KELİME BANKASI:</Text>
        <View style={styles.wordBankContainer}>
          {wordBankWords.map((word, index) => {
            const isUsed = usedWords.has(index);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.wordBankPill,
                  isUsed ? styles.wordBankPillUsed : styles.wordBankPillAvailable,
                  answered && styles.disabledClick,
                ]}
                onPress={() => handleWordSelect(word, index)}
                disabled={isUsed || answered}
              >
                <Text style={[styles.wordBankText, isUsed && styles.wordBankTextUsed]}>
                  {word}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // 5. REORDER
  if (type === 'reorder') {
    const items = (question.options?.items ?? []) as string[];
    const parsedOrder = typeof selectedAnswer === 'string' && selectedAnswer ? JSON.parse(selectedAnswer) as string[] : null;

    const [order, setOrder] = useState<number[]>(() => {
      if (parsedOrder) {
        return parsedOrder.map((n) => parseInt(n, 10));
      }
      return items.map((_, i) => i).sort(() => Math.random() - 0.5);
    });

    const handleMove = (index: number, direction: 'up' | 'down') => {
      if (answered) return;
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= order.length) return;

      const newOrder = [...order];
      [newOrder[index], newOrder[targetIdx]] = [newOrder[targetIdx], newOrder[index]];
      setOrder(newOrder);
      onAnswer(JSON.stringify(newOrder.map(String)));
    };

    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question_text}</Text>
        <Text style={styles.sectionLabel}>DOĞRU SIRALAMAYI BELİRLEYİN:</Text>

        <View style={styles.reorderList}>
          {order.map((itemIndex, i) => (
            <View key={itemIndex} style={styles.reorderItem}>
              <View style={styles.reorderBadge}>
                <Text style={styles.reorderBadgeText}>{i + 1}</Text>
              </View>
              <Text style={styles.reorderText}>{items[itemIndex]}</Text>

              {!answered && (
                <View style={styles.reorderControls}>
                  <TouchableOpacity
                    style={[styles.reorderArrow, i === 0 && styles.disabledClick]}
                    onPress={() => handleMove(i, 'up')}
                    disabled={i === 0}
                  >
                    <Text style={styles.reorderArrowText}>▲</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.reorderArrow, i === order.length - 1 && styles.disabledClick]}
                    onPress={() => handleMove(i, 'down')}
                    disabled={i === order.length - 1}
                  >
                    <Text style={styles.reorderArrowText}>▼</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  }

  // 6. MULTI SELECT
  if (type === 'multi_select') {
    const choices = (question.options?.choices ?? []) as string[];
    const parsedAnswers = typeof selectedAnswer === 'string' && selectedAnswer ? selectedAnswer.split(',') : [];

    const [selectedSet, setSelectedSet] = useState<Set<number>>(() => {
      const set = new Set<number>();
      parsedAnswers.forEach((val) => {
        const idx = choices.indexOf(val);
        if (idx !== -1) set.add(idx);
      });
      return set;
    });

    const toggleChoice = (idx: number) => {
      if (answered) return;
      const newSet = new Set(selectedSet);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      setSelectedSet(newSet);
      
      if (newSet.size > 0) {
        onAnswer(Array.from(newSet).map((i) => choices[i]).join(','));
      } else {
        onAnswer(undefined);
      }
    };

    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question_text}</Text>
        <Text style={styles.sectionLabel}>BİRDEN FAZLA SEÇENEK İŞARETLEYEBİLİRSİNİZ:</Text>

        <View style={styles.optionsList}>
          {choices.map((choice, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = selectedSet.has(index);
            return (
              <QuizOption
                key={choice}
                label={`${letter}. ${choice}`}
                isSelected={isSelected}
                isCorrect={answered && isCorrect && isSelected}
                isWrong={answered && !isCorrect && isSelected}
                onPress={() => toggleChoice(index)}
                disabled={answered}
              />
            );
          })}
        </View>
      </View>
    );
  }

  // 7. CODE EDITOR (Python Sandbox IDE)
  if (type === 'code_editor') {
    const starter = question.starter_code ?? '# Kodunu buraya yaz\n';
    const [code, setCode] = useState(() => {
      if (typeof selectedAnswer === 'string' && selectedAnswer && selectedAnswer !== '__code_editor__') {
        return selectedAnswer;
      }
      return starter;
    });

    const [sandboxResult, setSandboxResult] = useState<CodeRunResult | null>(null);
    const [running, setRunning] = useState(false);
    const [editorError, setEditorError] = useState<string | null>(null);

    const handleRunCode = async () => {
      setRunning(true);
      setEditorError(null);
      setSandboxResult(null);
      try {
        const res = await submitCode({
          language: question.language ?? 'python',
          code: code,
          test_cases: question.test_cases ?? [],
        });
        setSandboxResult(res);
        if (res.passed) {
          onAnswer('__code_editor__');
        } else {
          onAnswer(code); // save code progress but don't mark as solved
        }
      } catch (err) {
        setEditorError(err instanceof Error ? err.message : 'Kod çalıştırılamadı');
      } finally {
        setRunning(false);
      }
    };

    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question_text}</Text>
        {question.assignment_instructions && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>{question.assignment_instructions}</Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>DÜZENLEME ALANI:</Text>
        <View style={styles.editorContainer}>
          <CodeBlockHeader filename="solution.py" />
          <TextInput
            style={styles.codeEditorInput}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            value={code}
            onChangeText={(t) => {
              setCode(t);
              if (selectedAnswer === '__code_editor__') onAnswer(t); // invalidate correct if code changed
            }}
            editable={!answered}
          />
          <View style={styles.editorStatusBar}>
            <Text style={styles.editorStatusText}>Python 3.10 • UTF-8</Text>
          </View>
        </View>

        {editorError && <Text style={styles.errorResultText}>⚠️ Hata: {editorError}</Text>}

        {sandboxResult && (
          <View style={[styles.sandboxResultBox, sandboxResult.passed ? styles.resultPassed : styles.resultFailed]}>
            <View style={styles.resultBoxHeader}>
              <Text style={[styles.sandboxResultTitle, { color: sandboxResult.passed ? '#22C55E' : '#EF4444' }]}>
                {sandboxResult.passed ? '● Testler Başarıyla Geçti!' : '● Testler Başarısız Oldu'}
              </Text>
            </View>
            {sandboxResult.stdout ? (
              <View style={styles.outputConsole}>
                <Text style={styles.outputTextLabel}>$ python solution.py (stdout)</Text>
                <Text style={styles.outputText}>{sandboxResult.stdout}</Text>
              </View>
            ) : null}
            {sandboxResult.stderr ? (
              <View style={styles.outputConsoleError}>
                <Text style={styles.errorTextLabel}>$ traceback (stderr)</Text>
                <Text style={styles.errorConsoleText}>{sandboxResult.stderr}</Text>
              </View>
            ) : null}
          </View>
        )}

        {!answered && (
          <TouchableOpacity
            style={[styles.runButton, running && styles.runButtonDisabled]}
            onPress={handleRunCode}
            disabled={running}
          >
            {running ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.runButtonText}>⚙ Kodu Çalıştır & Test Et</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Fallback default
  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>{question.question_text}</Text>
      <Text style={styles.errorText}>Desteklenmeyen soru tipi: {type}</Text>
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
      <GhostieImage state={passed ? 'happy' : 'sad'} size={120} />
      <Text style={styles.resultTitle}>
        {passed ? 'Harika İş! 🎉' : 'Tekrar Denemelisin'}
      </Text>
      <Text style={styles.resultSubtitle}>
        {result.correct_count} / {result.total_questions} Doğru Cevap
      </Text>

      <View style={styles.resultStats}>
        <View style={styles.resultStat}>
          <Text style={styles.resultStatValue}>{result.score}</Text>
          <Text style={styles.resultStatLabel}>Puan</Text>
        </View>
        <View style={styles.resultStat}>
          <Text style={styles.resultStatValue}>+{result.xp_earned}</Text>
          <Text style={styles.resultStatLabel}>XP Kazanıldı</Text>
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
  const [ghostieState, setGhostieState] = useState<GhostieState>('thinking');
  const [result, setResult] = useState<LessonResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['lessonDetail', id],
    queryFn: () => fetchLessonDetail(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (error) {
      console.error('[LessonScreen] fetchLessonDetail error:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('[LessonScreen] API error response data:', (error as any).response?.data);
      }
    }
  }, [error]);

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

  useEffect(() => {
    if (data && data.questions) {
      setGhostieState('thinking');
    }
  }, [data, currentIndex]);

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
    setGhostieState('happy');
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
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
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#A78BFA', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {totalQuestions}
          </Text>
        </View>
        <View style={styles.ghostieHeaderBox}>
          <GhostieImage state={ghostieState} size={36} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {currentQuestion && (
          <QuestionCard
            key={currentQuestion.id} // Re-mounts completely on question change to reset local state hooks
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
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={canProceed ? ['#7C3AED', '#5B21B6'] : ['#1E1E30', '#1A1A2E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.nextButtonText}>
                {isLastQuestion ? 'Tamamla' : 'Devam Et →'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A12' },
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
    borderBottomWidth: 1.5,
    borderBottomColor: '#1E1E30',
    backgroundColor: '#0F0F1A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E1E30',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
  },
  closeBtnText: { color: '#E5E7EB', fontSize: 13, fontWeight: '700' },
  progressContainer: { flex: 1, gap: 4 },
  progressBar: {
    height: 10,
    backgroundColor: '#1E1E30',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: { color: '#A78BFA', fontSize: 11, textAlign: 'right', fontWeight: '800' },
  ghostieHeaderBox: {
    padding: 4,
    backgroundColor: '#111124',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1E1E35',
  },
  scroll: { flex: 1 },
  content: { padding: 20 },
  questionCard: { gap: 16 },
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 8,
    marginBottom: 4,
  },
  editorContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
    backgroundColor: '#07070F',
    marginVertical: 6,
  },
  macOsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#2D2D4B',
  },
  macOsDots: {
    flexDirection: 'row',
    gap: 6,
  },
  macOsDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  macOsTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  editorStatusBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#111122',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderTopWidth: 1.5,
    borderTopColor: '#2D2D4B',
  },
  editorStatusText: {
    color: '#6B7280',
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  codeBlock: {
    padding: 16,
    backgroundColor: '#07070F',
  },
  codeText: {
    color: '#A78BFA',
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 4,
  },
  optionsList: { gap: 8, marginTop: 4 },
  
  // True False Reason Styles
  tfGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  tfButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tfButtonInactive: {
    borderColor: '#2D2D4B',
    backgroundColor: '#111124',
  },
  tfButtonTrueActive: {
    borderColor: '#22C55E',
    backgroundColor: 'rgba(34,197,94,0.12)',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  tfButtonFalseActive: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239,68,68,0.12)',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  tfButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  tfTextActive: {
    color: '#FFFFFF',
  },
  reasonsSection: {
    gap: 10,
    marginTop: 10,
  },

  // Spot the Bug Styles
  bugCodeBlock: {
    backgroundColor: '#07070F',
  },
  bugLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bugLineRowActive: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  bugLineNumberContainer: {
    width: 38,
    paddingVertical: 12,
    borderRightWidth: 1.5,
    borderRightColor: '#2D2D4B',
    backgroundColor: '#111122',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bugLineNumber: {
    color: '#6B7280',
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  bugLineText: {
    flex: 1,
    paddingLeft: 12,
    color: '#E5E7EB',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  bugLineTextActive: {
    color: '#EF4444',
    fontWeight: '800',
  },

  // Fill in the Blank Styles
  blankCodeBlock: {
    backgroundColor: '#07070F',
    padding: 16,
    gap: 8,
  },
  blankLineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    lineHeight: 32,
  },
  codeTextInline: {
    color: '#A78BFA',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  blankSlot: {
    minWidth: 74,
    height: 30,
    borderRadius: 8,
    borderWidth: 1.5,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  blankSlotEmpty: {
    borderStyle: 'dashed',
    borderColor: '#7C3AED',
    backgroundColor: 'rgba(124,58,237,0.06)',
  },
  blankSlotFilled: {
    borderStyle: 'solid',
    borderColor: '#A78BFA',
    backgroundColor: 'rgba(124,58,237,0.2)',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  blankSlotText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  wordBankContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  wordBankPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  wordBankPillAvailable: {
    backgroundColor: '#1E1E38',
    borderColor: '#3C3C56',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  wordBankPillUsed: {
    backgroundColor: '#111122',
    borderColor: '#222233',
    opacity: 0.35,
  },
  wordBankText: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '700',
  },
  wordBankTextUsed: {
    color: '#4B5563',
  },
  textInput: {
    backgroundColor: '#111124',
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
    borderRadius: 14,
    color: '#FFFFFF',
    fontSize: 15,
    padding: 16,
    fontWeight: '600',
  },

  // Reorder Styles
  reorderList: {
    gap: 10,
    marginTop: 4,
  },
  reorderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111124',
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  reorderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  reorderText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  reorderControls: {
    flexDirection: 'row',
    gap: 8,
  },
  reorderArrow: {
    width: 34,
    height: 34,
    backgroundColor: '#1E1E38',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2D2D4B',
  },
  reorderArrowText: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '800',
  },

  // Code Editor Styles
  instructionsContainer: {
    backgroundColor: '#111124',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2D2D4B',
  },
  instructionsText: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  codeEditorInput: {
    height: 200,
    backgroundColor: '#07070F',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 16,
    textAlignVertical: 'top',
  },
  runButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  runButtonDisabled: {
    opacity: 0.6,
  },
  runButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  sandboxResultBox: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    gap: 12,
    marginTop: 6,
  },
  resultBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultPassed: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderColor: 'rgba(34,197,94,0.3)',
  },
  resultFailed: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.3)',
  },
  sandboxResultTitle: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  outputConsole: {
    backgroundColor: '#030308',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
  },
  outputConsoleError: {
    backgroundColor: '#030308',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  outputTextLabel: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  outputText: {
    color: '#E5E7EB',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 18,
  },
  errorTextLabel: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  errorConsoleText: {
    color: '#FCA5A5',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 18,
  },
  errorResultText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },

  // Result & Page Structure
  footer: { padding: 20, paddingBottom: 24, backgroundColor: '#0F0F1A', borderTopWidth: 1.5, borderTopColor: '#1E1E30' },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  nextButtonDisabled: { opacity: 0.5 },
  nextButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  errorText: { color: '#EF4444', fontSize: 15, fontFamily: 'monospace', fontWeight: '600' },
  backButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingHorizontal: 26,
    paddingVertical: 15,
    marginTop: 16,
  },
  backButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 24,
  },
  resultTitle: { color: '#FFFFFF', fontSize: 30, fontWeight: '900' },
  resultSubtitle: { color: '#9CA3AF', fontSize: 17, fontWeight: '600' },
  resultStats: { flexDirection: 'row', gap: 48 },
  resultStat: { alignItems: 'center', gap: 6 },
  resultStatValue: { color: '#A78BFA', fontSize: 32, fontWeight: '900' },
  resultStatLabel: { color: '#9CA3AF', fontSize: 14, fontWeight: '600' },
  disabledClick: { opacity: 0.5 },
});
