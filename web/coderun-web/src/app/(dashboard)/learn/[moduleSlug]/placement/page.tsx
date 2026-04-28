'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { moduleApi } from '@/lib/api/module-api';
import { usePlacementState } from '@/lib/hooks/use-placement';
import { MultipleChoiceQuestion } from '@/components/lesson/multiple-choice-question';
import { QuestionProgress } from '@/components/lesson/question-progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Step = 'intro' | 'test' | 'result';

export default function PlacementPage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = use(params);
  const router = useRouter();
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
    .map((q, i) => (answers[q.id] !== undefined ? i : -1))
    .filter(i => i >= 0);

  const handleSubmit = async () => {
    const res = await submitTest(questions.map(q => q.id));
    if (res) setStep('result');
  };

  // Adım 1: Giriş
  if (step === 'intro') {
    return (
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto py-8">
        <div className="text-center">
          <FlaskConical className="w-16 h-16 text-accent mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Seviye Testi</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Mevcut bilgi seviyenizi ölçerek doğru dersten başlamanızı sağlar.
            15 soruluk kısa bir test yapacaksınız.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
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

  // Adım 2: Test
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
          <Link href={`/learn/${moduleSlug}`} className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <QuestionProgress total={total} current={currentIndex} answered={answeredIndices} />
          </div>
          <span className="text-sm text-slate-400 flex-shrink-0">
            {currentIndex + 1}/{total}
          </span>
        </div>

        <Card className="min-h-[280px]">
          <MultipleChoiceQuestion
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onSelect={(answer) => answerQuestion(currentQuestion.id, answer)}
          />
        </Card>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => skipQuestion(currentQuestion.id, total)}
            className="text-slate-400"
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

  // Adım 3: Sonuç
  if (step === 'result' && result) {
    return (
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto py-8">
        <div className="text-center">
          <p className="text-6xl font-black text-accent">%{Math.round(result.percentage)}</p>
          <p className="text-slate-400 mt-2">{result.message}</p>
          <p className="text-sm text-slate-500 mt-1">
            {result.correctCount}/{result.totalCount} doğru
          </p>
        </div>
        <Card className="w-full text-center">
          <p className="text-white font-semibold">
            {result.skippedLessons > 0
              ? `${result.skippedLessons} ders atlanıyor`
              : 'Baştan başlıyorsunuz'}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {result.startingLessonOrder}. dersten başlıyorsunuz
          </p>
        </Card>
        <Link href={`/learn/${moduleSlug}`} className="w-full">
          <Button size="lg" className="w-full">Öğrenmeye Başla</Button>
        </Link>
      </div>
    );
  }

  return null;
}
