'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, X, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLessonDetail } from '@/lib/hooks/use-modules';
import { useLessonState } from '@/lib/hooks/use-lesson';
import { QuestionRouter } from '@/components/lesson/question-router';
import { ReinforcementQuestion } from '@/components/lesson/reinforcement-question';
import { QuestionProgress } from '@/components/lesson/question-progress';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { GhostieState } from '@/lib/ghostie-assets';
import type { QuestionResponse } from '@/lib/types/module.types';

type LessonPhase = 'answering' | 'reinforcement' | 'feedback';

export default function LessonPage({
  params,
}: {
  params: { moduleSlug: string; lessonId: string };
}) {
  const { moduleSlug, lessonId } = params;
  const router = useRouter();
  const { data: lesson, isLoading } = useLessonDetail(lessonId);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [phase, setPhase] = useState<LessonPhase>('answering');
  const [reinforcementQuestion, setReinforcementQuestion] = useState<QuestionResponse | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [reinforcementDone, setReinforcementDone] = useState(false);

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
  const answeredIndices = lesson?.questions
    .map((q, i) => (answers[q.id] ? i : -1))
    .filter((i) => i >= 0) ?? [];

  // Ghostie state mapping
  const ghostieState: GhostieState = (() => {
    if (phase === 'reinforcement') return 'reinforcement';
    if (lastAnswerCorrect === true) return 'correct';
    if (lastAnswerCorrect === false) return 'wrong';
    return 'idle';
  })();

  const ghostieMessage = (() => {
    if (phase === 'reinforcement') return 'Endişelenme! Bu kavramı birlikte pekiştirelim. 💪';
    if (lastAnswerCorrect === true) return 'Harika! Doğru cevap! 🎉';
    if (lastAnswerCorrect === false) return 'Üzülme, bir dahaki sefere! Açıklamayı oku. 📖';
    return currentQuestion?.hint
      ? `İpucu: ${currentQuestion.hint}`
      : 'Soruyu dikkatlice oku ve en iyi cevabı seç!';
  })();

  const handleSubmit = async () => {
    if (!lesson) return;
    const result = await submitLesson(lesson.questions);
    if (result) {
      // Check for reinforcement
      if (result.reinforcementQuestion && !reinforcementDone) {
        setReinforcementQuestion(result.reinforcementQuestion);
        setLastAnswerCorrect(false);
        setPhase('reinforcement');
        return;
      }
      setLastAnswerCorrect(result.wrongCount === 0);
      sessionStorage.setItem('lesson_result', JSON.stringify(result));
      router.push(`/learn/${moduleSlug}/lesson/${lessonId}/result`);
    }
  };

  const handleReinforcementAnswer = (answer: string) => {
    setReinforcementDone(true);
    setReinforcementQuestion(null);
    setPhase('answering');
    // Continue to next question or submit
    if (isLastQuestion) {
      handleSubmit();
    } else {
      nextQuestion(total);
    }
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

  if (!lesson || !currentQuestion) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <button
          onClick={() => setShowExitDialog(true)}
          className="text-slate-400 hover:text-white transition-colors"
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
        <span className="text-sm text-slate-400 flex-shrink-0">
          {currentQuestionIndex + 1}/{total}
        </span>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">

        {/* LEFT COLUMN — Ders bilgisi ve kavram */}
        <aside className="col-span-3 flex flex-col gap-4 overflow-y-auto">
          <Card className="p-4">
            <h2 className="text-sm font-bold text-on-surface mb-1">{lesson.title}</h2>
            <p className="text-xs text-on-surface-variant">
              Soru {currentQuestionIndex + 1} / {total}
            </p>
          </Card>

          {/* Soru tipi badge */}
          <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">
              {questionTypeLabel(currentQuestion.questionType)}
            </p>
          </div>

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
          {currentQuestion.hint && phase === 'answering' && lastAnswerCorrect === null && (
            <Card className="p-4 border-primary/20">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-on-surface-variant">{currentQuestion.hint}</p>
              </div>
            </Card>
          )}
        </aside>

        {/* CENTER COLUMN — Soru içeriği */}
        <main className="col-span-6 flex flex-col gap-4 overflow-y-auto">
          <Card className="flex-1 p-6">
            {phase === 'reinforcement' && reinforcementQuestion ? (
              <ReinforcementQuestion
                questionText={reinforcementQuestion.questionText}
                questionType={reinforcementQuestion.questionType}
                options={reinforcementQuestion.options}
                codeBlock={reinforcementQuestion.codeBlock}
                wordBank={reinforcementQuestion.wordBank}
                onAnswer={handleReinforcementAnswer}
                hint={reinforcementQuestion.hint ?? undefined}
              />
            ) : (
              <QuestionRouter
                question={currentQuestion}
                currentAnswer={currentAnswer}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswer={(answer) => answerQuestion(currentQuestion.id, answer)}
              />
            )}
          </Card>

          {/* Alt butonlar */}
          {phase === 'answering' && (
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
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={!currentAnswer}
                  size="lg"
                >
                  Tamamla
                </Button>
              ) : (
                <Button
                  onClick={() => nextQuestion(total)}
                  disabled={!currentAnswer}
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
        <aside className="col-span-3 flex flex-col gap-4 overflow-y-auto">
          <Card className="p-4 bg-gradient-to-b from-primary/5 to-surface-container-lowest">
            <p className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">
              Ghostie AI Mentor
            </p>
            <div className="flex flex-col items-center gap-3">
              <GhostieReaction
                state={ghostieState}
                size={100}
                preferAnimation={true}
              />
              <p className="text-xs text-on-surface-variant text-center leading-relaxed">
                {ghostieMessage}
              </p>
            </div>
          </Card>

          {/* Reinforcement tamamlandı mesajı */}
          {reinforcementDone && (
            <Card className="p-4 border-secondary/30 bg-secondary-container/10">
              <p className="text-xs text-secondary font-semibold">
                ✓ Pekiştirme tamamlandı! Devam edebilirsin.
              </p>
            </Card>
          )}
        </aside>
      </div>

      {/* Çıkış dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Dersten çıkmak istiyor musun?</h3>
            <p className="text-slate-400 text-sm mb-6">İlerlemeniz kaydedilmeyecek.</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowExitDialog(false)} className="flex-1">
                İptal
              </Button>
              <Link href={`/learn/${moduleSlug}`} className="flex-1">
                <Button variant="ghost" className="w-full text-red-400 hover:text-red-300">
                  Çık
                </Button>
              </Link>
            </div>
          </Card>
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
