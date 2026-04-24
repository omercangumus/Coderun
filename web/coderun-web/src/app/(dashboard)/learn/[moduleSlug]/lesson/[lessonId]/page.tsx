'use client';

import { use, useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useLessonDetail } from '@/lib/hooks/use-modules';
import { moduleApi } from '@/lib/api/module-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import type { AnswerSubmit, LessonResultResponse } from '@/lib/types/module.types';

export default function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonId: string }>;
}) {
  const { moduleSlug, lessonId } = use(params);
  const { data: lesson, isLoading } = useLessonDetail(lessonId);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<LessonResultResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!lesson) return;
    setSubmitting(true);
    try {
      const payload: AnswerSubmit[] = lesson.questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? '',
      }));
      const res = await moduleApi.submitLesson(lessonId, payload);
      setResult(res);
      if (res.isCompleted) {
        toast.success(`Tebrikler! ${res.xpEarned} XP kazandın!`);
      } else {
        toast.error(`Skor: ${res.score}/100. Geçmek için en az 70 puan gerekiyor.`);
      }
    } catch {
      toast.error('Cevaplar gönderilemedi');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href={`/learn/${moduleSlug}`} className="text-slate-400 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
      </div>

      {result ? (
        <Card className="text-center py-8">
          {result.isCompleted
            ? <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            : <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          }
          <p className="text-2xl font-bold text-white mb-2">Skor: {result.score}/100</p>
          <p className="text-slate-400 mb-4">{result.message}</p>
          <div className="flex gap-3 justify-center">
            {!result.isCompleted && (
              <Button variant="outline" onClick={() => { setResult(null); setAnswers({}); }}>
                Tekrar Dene
              </Button>
            )}
            <Link href={`/learn/${moduleSlug}`}>
              <Button>Modüle Dön</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {lesson.questions.map((q, idx) => (
            <Card key={q.id}>
              <p className="text-sm text-slate-400 mb-2">Soru {idx + 1}</p>
              <p className="text-white font-medium mb-4">{q.questionText}</p>
              {q.options && Array.isArray(q.options.choices) && (
                <div className="flex flex-col gap-2">
                  {(q.options.choices as string[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                      className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                        answers[q.id] === opt
                          ? 'border-accent bg-accent/20 text-white'
                          : 'border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          ))}
          <Button
            onClick={handleSubmit}
            isLoading={submitting}
            size="lg"
            className="w-full"
          >
            Cevapları Gönder
          </Button>
        </>
      )}
    </div>
  );
}
