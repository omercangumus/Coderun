'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLessonDetail } from '@/lib/hooks/use-modules';
import { useLessonState } from '@/lib/hooks/use-lesson';
import { useHaptics } from '@/lib/hooks/use-haptics';
import { QuestionRouter } from '@/components/lesson/question-router';
import { ReinforcementQuestion } from '@/components/lesson/reinforcement-question';
import { LearningCard } from '@/components/lesson/learning-card';
import { QuestionProgress } from '@/components/lesson/question-progress';
import { QuizGhostieMentor } from '@/components/lesson/quiz-ghostie-mentor';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { GhostieState } from '@/lib/ghostie-assets';
import type { QuestionResponse } from '@/lib/types/module.types';

type LessonPhase = 'intro' | 'answering' | 'reinforcement' | 'feedback';

/** Eğer ders 5+ sorudan oluşuyorsa, 3. sorudan önce bir kavram kartı göster. */
function shouldShowLearningCard(lessonType: string, index: number, total: number): boolean {
  // Quiz derslerinde ilk soru öncesi ve ortada bir kavram kartı
  if (index === 0 && total >= 3) return true;
  if (index === Math.floor(total / 2) && total >= 6) return true;
  return false;
}

export default function LessonPage({
  params,
}: {
  params: { moduleSlug: string; lessonId: string };
}) {
  const { moduleSlug, lessonId } = params;
  const router = useRouter();
  const { data: lesson, isLoading } = useLessonDetail(lessonId);
  const { vibrateSuccess, vibrateError } = useHaptics();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [phase, setPhase] = useState<LessonPhase>('intro');
  const [reinforcementQuestion, setReinforcementQuestion] = useState<QuestionResponse | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [reinforcementDone, setReinforcementDone] = useState(false);
  const [shownLearningCards, setShownLearningCards] = useState<number[]>([]);
  const [showingLearningCard, setShowingLearningCard] = useState(false);
  // Ref to avoid React state batching race condition on reinforcement completion
  const reinforcementDoneRef = useRef(false);

  const {
    currentQuestionIndex,
    answers,
    isSubmitting,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    submitLesson,
  } = useLessonState(lessonId);

  const total = lesson?.questions.length ?? 0;
  const currentQuestion = lesson?.questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? (answers[currentQuestion.id] ?? '') : '';
  const isLastQuestion = currentQuestionIndex === total - 1;

  const isQuestionAnswered = currentQuestion
    ? currentQuestion.questionType === 'code_editor'
      ? currentAnswer === '__code_editor__'
      : !!currentAnswer
    : false;
  const answeredIndices = lesson?.questions
    .map((q, i) => (answers[q.id] ? i : -1))
    .filter((i) => i >= 0) ?? [];

  // Check if we should show a learning card before the current question
  const needsLearningCard =
    lesson &&
    phase === 'answering' &&
    !showingLearningCard &&
    !shownLearningCards.includes(currentQuestionIndex) &&
    shouldShowLearningCard(lesson.lessonType, currentQuestionIndex, total);

  // Show the learning card automatically via useEffect to avoid rendering side-effects
  useEffect(() => {
    if (needsLearningCard) {
      setShowingLearningCard(true);
      setShownLearningCards((prev) => [...prev, currentQuestionIndex]);
    }
  }, [needsLearningCard, currentQuestionIndex]);

  // Ghostie state mapping
  const ghostieState: GhostieState = (() => {
    if (phase === 'intro') return 'idle';
    if (phase === 'reinforcement') return 'reinforcement';
    if (lastAnswerCorrect === true) return 'correct';
    if (lastAnswerCorrect === false) return 'wrong';
    return 'idle';
  })();

  const showInteractiveMentor =
    lesson &&
    phase === 'answering' &&
    !showingLearningCard &&
    currentQuestion;

  const handleSubmit = async (skipReinforcement = false) => {
    if (!lesson) return;
    const result = await submitLesson(lesson.questions);
    if (result) {
      if (result.reinforcementQuestion && !skipReinforcement && !reinforcementDoneRef.current) {
        setReinforcementQuestion(result.reinforcementQuestion);
        setLastAnswerCorrect(false);
        setPhase('reinforcement');
        vibrateError();
        return;
      }
      const isCorrect = result.wrongCount === 0;
      setLastAnswerCorrect(isCorrect);
      if (isCorrect) vibrateSuccess(); else vibrateError();
      sessionStorage.setItem('lesson_result', JSON.stringify(result));
      router.push(`/learn/${moduleSlug}/lesson/${lessonId}/result`);
    }
  };

  const handleReinforcementAnswer = (_answer: string) => {
    reinforcementDoneRef.current = true;
    setReinforcementDone(true);
    setReinforcementQuestion(null);
    setPhase('answering');
    if (isLastQuestion) {
      handleSubmit(true);
    } else {
      nextQuestion(total);
    }
  };

  const handleNextQuestion = () => {
    const nextIdx = currentQuestionIndex + 1;
    if (
      lesson &&
      shouldShowLearningCard(lesson.lessonType, nextIdx, total) &&
      !shownLearningCards.includes(nextIdx)
    ) {
      setShowingLearningCard(true);
      setShownLearningCards((prev) => [...prev, nextIdx]);
    }
    nextQuestion(total);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-80px)]">
        <div className="col-span-3 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="col-span-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="col-span-3 space-y-4">
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  // ──────────────── INTRO PHASE ────────────────
  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto gap-8 animate-fade-in">
        <GhostieReaction state="idle" size={140} preferAnimation />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-on-surface mb-2">{lesson.title}</h1>
          <p className="text-on-surface-variant">
            {total} soru · {lesson.lessonType === 'quiz' ? 'Quiz' : 'Pratik'}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => setPhase('answering')}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Başla 🚀
          </button>
          <button
            onClick={() => router.back()}
            className="w-full py-3 rounded-2xl border-2 border-outline-variant text-on-surface-variant font-medium hover:bg-surface-container transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const isCodingLab =
    lesson.lessonType === 'code_editor' || currentQuestion.questionType === 'code_editor';

  if (isCodingLab && phase === 'answering' && !showingLearningCard) {
    return (
      <div className="flex h-[calc(100vh-80px)] flex-col">
        <div className="mb-3 flex shrink-0 items-center gap-3">
          <button
            onClick={() => setShowExitDialog(true)}
            className="text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <QuestionProgress total={total} current={currentQuestionIndex} answered={answeredIndices} />
          </div>
          <span className="shrink-0 font-sans text-sm text-on-surface-variant">
            {currentQuestionIndex + 1}/{total}
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <QuestionRouter
            key={currentQuestion.id}
            question={currentQuestion}
            currentAnswer={currentAnswer}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswer={(answer) => answerQuestion(currentQuestion.id, answer)}
            questionIndex={currentQuestionIndex}
            totalQuestions={total}
            onPrevQuestion={() => prevQuestion()}
            onNextQuestion={handleNextQuestion}
            canPrevQuestion={currentQuestionIndex > 0}
            canNextQuestion={!isLastQuestion && isQuestionAnswered}
          />
        </div>

        {isLastQuestion && (
          <div className="mt-3 flex shrink-0 justify-end">
            <Button onClick={() => handleSubmit()} isLoading={isSubmitting} disabled={!isQuestionAnswered} size="lg">
              Dersi Tamamla
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <button
          onClick={() => setShowExitDialog(true)}
          className="text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <QuestionProgress
            total={total}
            current={currentQuestionIndex}
            answered={answeredIndices}
          />
        </div>
        <span className="font-sans text-sm text-on-surface-variant flex-shrink-0">
          {currentQuestionIndex + 1}/{total}
        </span>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">

        {/* LEFT COLUMN */}
        <aside className="col-span-3 flex flex-col gap-4 overflow-y-auto">
          <Card className="p-4">
            <h2 className="text-sm font-bold text-on-surface mb-1">{lesson.title}</h2>
            <p className="text-xs text-on-surface-variant">
              Soru {currentQuestionIndex + 1} / {total}
            </p>
          </Card>

          {/* Soru tipi badge */}
          {!showingLearningCard && (
            <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                {questionTypeLabel(currentQuestion.questionType)}
              </p>
            </div>
          )}

          {/* Explanation (yanlış cevap sonrası) */}
          {lastAnswerCorrect === false && currentQuestion.explanation && (
            <Card className="p-4 border-error/30 bg-error-container/10">
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-error mb-1">Açıklama</p>
                  <p className="text-xs text-on-surface-variant">{currentQuestion.explanation}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Doğru cevap feedback */}
          {lastAnswerCorrect === true && (
            <Card className="p-4 border-secondary/30 bg-secondary-container/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <p className="text-xs font-bold text-secondary">Doğru cevap!</p>
              </div>
            </Card>
          )}

          {/* Hint */}
          {currentQuestion.hint && phase === 'answering' && lastAnswerCorrect === null && !showingLearningCard && (
            <Card className="p-4 border-primary/20">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-on-surface-variant">{currentQuestion.hint}</p>
              </div>
            </Card>
          )}
        </aside>

        {/* CENTER COLUMN */}
        <main className="col-span-6 flex flex-col gap-4 overflow-y-auto">
          <Card className="flex-1 p-6">
            {showingLearningCard ? (
              <LearningCard
                title={getLearningCardTitle(lesson.lessonType, currentQuestionIndex, lesson.title)}
                body={getLearningCardBody(lesson.lessonType, currentQuestionIndex, lesson.title)}
                codeSnippet={getLearningCardCode(lesson.lessonType, currentQuestionIndex)}
                type={currentQuestionIndex === 0 ? 'concept' : 'tip'}
                onContinue={() => setShowingLearningCard(false)}
              />
            ) : phase === 'reinforcement' && reinforcementQuestion ? (
              <ReinforcementQuestion
                question={reinforcementQuestion}
                onAnswer={handleReinforcementAnswer}
              />
            ) : (
              <QuestionRouter
                question={currentQuestion}
                currentAnswer={currentAnswer}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswer={(answer) => answerQuestion(currentQuestion.id, answer)}
                questionIndex={currentQuestionIndex}
                totalQuestions={total}
              />
            )}
          </Card>

          {/* Alt butonlar */}
          {phase === 'answering' && !showingLearningCard && (
            <div className="flex gap-3 flex-shrink-0">
              {currentQuestionIndex > 0 && (
                <Button variant="outline" onClick={() => prevQuestion()} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Geri
                </Button>
              )}
              <div className="flex-1" />
              {isLastQuestion ? (
                <Button
                  onClick={() => handleSubmit()}
                  isLoading={isSubmitting}
                  disabled={!isQuestionAnswered}
                  size="lg"
                >
                  Tamamla
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={!isQuestionAnswered}
                  className="gap-2"
                >
                  İleri
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </main>

        {/* RIGHT COLUMN — Ghostie AI Mentor */}
        <aside className="col-span-3 flex flex-col gap-4 overflow-y-auto min-h-0">
          {showInteractiveMentor ? (
            <QuizGhostieMentor
              key={currentQuestion.id}
              moduleSlug={moduleSlug}
              lessonTitle={lesson.title}
              question={currentQuestion}
              ghostieState={ghostieState}
              onSuggestionFill={
                currentQuestion.questionType === 'code_completion'
                  ? (value) => answerQuestion(currentQuestion.id, value)
                  : undefined
              }
            />
          ) : (
            <Card className="p-4 bg-gradient-to-b from-primary/5 to-surface-container-lowest">
              <p className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">
                Ghostie AI Mentor
              </p>
              <p className="text-xs text-on-surface-variant text-center leading-relaxed">
                {phase === 'reinforcement'
                  ? 'Pekiştirme sorusundasın — odaklan ve dene!'
                  : showingLearningCard
                    ? 'Kavram kartını okuduktan sonra Ghostie ile soru üzerinde konuşabilirsin.'
                    : 'Ghostie mentor bu soruda yanında — sağ panelde sohbet başlayacak.'}
              </p>
            </Card>
          )}

          {reinforcementDone && (
            <Card className="p-4 border-secondary/30 bg-secondary-container/10">
              <p className="text-xs text-secondary font-semibold">
                ✓ Pekiştirme tamamlandı! Devam edebilirsin.
              </p>
            </Card>
          )}
        </aside>
      </div>

      {/* Çıkış diyalog */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-sm w-full bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-primary-lg p-6 animate-bounce-in">
            <h3 className="text-lg font-bold text-on-surface mb-2 font-heading">Dersten çıkmak istiyor musun?</h3>
            <p className="text-on-surface-variant text-sm mb-6 font-sans">İlerlemeniz kaydedilmeyecek.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitDialog(false)}
                className="flex-1 py-2.5 rounded-full border-2 border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-container transition-all font-sans text-sm"
              >
                İptal
              </button>
              <Link href={`/learn/${moduleSlug}`} className="flex-1">
                <button
                  className="w-full py-2.5 rounded-full bg-error text-white font-semibold hover:bg-error/90 transition-all font-sans text-sm"
                >
                  Çık
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function questionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    multiple_choice: 'Çoktan Seçmeli',
    code_completion: 'Kod Tamamlama',
    code_editor: 'Kod Editörü',
    fill_in_blank: 'Boşluk Doldurma',
    reorder: 'Sıralama',
    true_false_reason: 'Doğru / Yanlış',
    spot_the_bug: 'Hata Bul',
    multi_select: 'Çoklu Seçim',
  };
  return labels[type] ?? type;
}

/** Ders tipine ve soru indeksine göre kavram kartı başlığı */
function getLearningCardTitle(lessonType: string, index: number, lessonTitle: string): string {
  if (index === 0) return `${lessonTitle} — Temel Kavramlar`;
  return `Yarı yola geldik! Bir adım geriye bakalım 🧠`;
}

/** Ders tipine ve indeksine göre açıklama metni */
function getLearningCardBody(lessonType: string, index: number, lessonTitle: string): string {
  if (index === 0) {
    return `Bu derste "${lessonTitle}" konusunu işleyeceğiz.\n\n` +
      `Sorulara geçmeden önce temel kavramları hatırlayalım:\n\n` +
      `• Her soruyu dikkatlice oku\n` +
      `• Emin olmadığın sorularda ipucuna bakabilirsin\n` +
      `• Yanlış cevaplar için açıklama gösterilecek\n\n` +
      `Hazır olduğunda "Anladım, Devam Et" butonuna bas!`;
  }
  return `Harika gidiyorsun! 🎉 Şimdiye kadar iyi bir ilerleme kaydettik.\n\n` +
    `Kalan sorularda dikkat etmen gerekenler:\n\n` +
    `• Kod sorularında her satırı dikkatle incele\n` +
    `• Birden fazla doğru seçenek olabilir — hepsini işaretle\n` +
    `• Hatırlamak için Ghostie'nin ipuçlarına bak\n\n` +
    `Devam et, neredeyse bitti!`;
}

/** Ders tipine göre opsiyonel kod snippet */
function getLearningCardCode(lessonType: string, index: number): string | undefined {
  if (index !== 0) return undefined;
  // Sadece Python ile alakalı içerikler için örnek snippet
  return undefined;
}
