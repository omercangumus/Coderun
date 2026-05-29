'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { moduleApi } from '@/lib/api/module-api';
import { usePlacementState } from '@/lib/hooks/use-placement';
import { MultipleChoiceQuestion } from '@/components/lesson/multiple-choice-question';
import { QuestionProgress } from '@/components/lesson/question-progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CoderunCard } from '@/components/stitch/CoderunCard';
import { GhostieMotivationCard } from '@/components/stitch/GhostieCard';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';

type Step = 'intro' | 'test' | 'result';

export default function PlacementPage({
  params,
}: {
  params: { moduleSlug: string };
}) {
  const { moduleSlug } = params;
  const [step, setStep] = useState<Step>('intro');

  const { data: placementData, isLoading } = useQuery({
    queryKey: ['placement', moduleSlug],
    queryFn: () => moduleApi.getPlacementQuestions(moduleSlug),
    enabled: step === 'test',
  });

  const {
    currentIndex,
    answers,
    isSubmitting,
    result,
    answerQuestion,
    skipQuestion,
    next,
    submitTest,
  } = usePlacementState(moduleSlug);

  const questions = placementData?.questions ?? [];
  const total = questions.length;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === total - 1;
  const answeredIndices = questions
    .map((q, i) => (answers[q.id] !== undefined && answers[q.id] !== '' ? i : -1))
    .filter(i => i >= 0);

  const handleSubmit = async () => {
    const res = await submitTest(questions.map(q => q.id));
    if (res) setStep('result');
  };

  if (step === 'intro') {
    return (
      <div className="max-w-lg mx-auto flex flex-col gap-6 py-4">
        <GhostieMotivationCard
          title="Seviye Testi"
          message="Mevcut bilgi seviyeni ölçerek doğru dersten başlamanı sağlar. 15 soruluk kısa bir test yapacaksın."
          mood="helping"
        />
        <CoderunCard className="text-center">
          <FlaskConical className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="font-heading text-h3 font-bold text-on-surface">Seviye Testi</h1>
          <p className="font-sans text-body-sm text-on-surface-variant mt-2">
            Test sonucuna göre uygun dersten başlayabilir veya tüm dersleri sıfırdan tamamlayabilirsin.
          </p>
        </CoderunCard>
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={() => setStep('test')}>
            Seviye Testi Yap
          </Button>
          <Link href={`/learn/${moduleSlug}`}>
            <Button variant="outline" size="lg" className="w-full">
              Baştan Başla
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'test') {
    if (isLoading || !currentQuestion) {
      return (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64" />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <Link
            href={`/learn/${moduleSlug}`}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Geri dön"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <QuestionProgress total={total} current={currentIndex} answered={answeredIndices} />
          </div>
          <span className="font-sans text-sm text-on-surface-variant flex-shrink-0">
            {currentIndex + 1}/{total}
          </span>
        </div>

        <CoderunCard className="min-h-[280px]">
          <MultipleChoiceQuestion
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onSelect={(answer) => answerQuestion(currentQuestion.id, answer)}
          />
        </CoderunCard>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => skipQuestion(currentQuestion.id, total)}
            className="text-on-surface-variant"
          >
            Atla
          </Button>
          <div className="flex-1" />
          {isLastQuestion ? (
            <Button onClick={handleSubmit} isLoading={isSubmitting} size="lg">
              Testi Tamamla
            </Button>
          ) : (
            <Button
              onClick={() => next(total)}
              disabled={!answers[currentQuestion.id]}
            >
              İleri
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'result' && result) {
    return (
      <div className="max-w-lg mx-auto flex flex-col gap-6 py-4">
        <div className="flex flex-col items-center gap-4">
          <GhostieReaction
            state={result.percentage >= 70 ? 'celebrating' : 'idle'}
            size={100}
            message={result.message}
          />
          <div className="text-center">
            <p className="font-heading text-6xl font-black text-primary">
              %{Math.round(result.percentage)}
            </p>
            <p className="font-sans text-body-sm text-on-surface-variant mt-2">
              {result.correctCount}/{result.totalCount} doğru
            </p>
          </div>
        </div>
        <CoderunCard variant="highlight" className="text-center">
          <p className="font-heading text-base font-bold text-primary">
            {result.skippedLessons > 0
              ? `${result.skippedLessons} ders atlanıyor`
              : 'Baştan başlıyorsun'}
          </p>
          <p className="font-sans text-body-sm text-on-surface-variant mt-1">
            {result.startingLessonOrder}. dersten başlıyorsun
          </p>
        </CoderunCard>
        <Link href={`/learn/${moduleSlug}`} className="w-full">
          <Button size="lg" className="w-full">Öğrenmeye Başla</Button>
        </Link>
      </div>
    );
  }

  return null;
}
