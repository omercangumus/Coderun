'use client';

import { use, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLessonDetail } from '@/lib/hooks/use-modules';
import { useLessonState } from '@/lib/hooks/use-lesson';
import { MultipleChoiceQuestion } from '@/components/lesson/multiple-choice-question';
import { CodeCompletionQuestion } from '@/components/lesson/code-completion-question';
import { MiniProjectQuestion } from '@/components/lesson/mini-project-question';
import { QuestionProgress } from '@/components/lesson/question-progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonId: string }>;
}) {
  const { moduleSlug, lessonId } = use(params);
  const router = useRouter();
  const { data: lesson, isLoading } = useLessonDetail(lessonId);
  const [showExitDialog, setShowExitDialog] = useState(false);

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
    .filter(i => i >= 0) ?? [];

  const handleSubmit = async () => {
    if (!lesson) return;
    const result = await submitLesson(lesson.questions);
    if (result) {
      sessionStorage.setItem('lesson_result', JSON.stringify(result));
      router.push(`/learn/${moduleSlug}/lesson/${lessonId}/result`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-12" />
      </div>
    );
  }

  if (!lesson || !currentQuestion) return null;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Üst bar */}
      <div className="flex items-center gap-3">
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

      {/* Soru kartı */}
      <Card className="min-h-[300px]">
        {currentQuestion.questionType === 'multiple_choice' && (
          <MultipleChoiceQuestion
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onSelect={(answer) => answerQuestion(currentQuestion.id, answer)}
          />
        )}
        {currentQuestion.questionType === 'code_completion' && (
          <CodeCompletionQuestion
            question={currentQuestion}
            currentAnswer={currentAnswer}
            onChange={(answer) => answerQuestion(currentQuestion.id, answer)}
          />
        )}
        {currentQuestion.questionType === 'code_editor' && (
          <MiniProjectQuestion
            question={currentQuestion}
            currentAnswer={currentAnswer}
            onChange={(answer) => answerQuestion(currentQuestion.id, answer)}
          />
        )}
      </Card>

      {/* Alt butonlar */}
      <div className="flex gap-3">
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
