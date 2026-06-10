'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { QuestionResponse } from '@/lib/types/module.types';
import type { CodeRunResponse, CodeSubmitResponse, TestCaseResult } from '@/lib/types/code-runner.types';
import {
  runPython,
  evaluateTestCases,
  getPyodideStatus,
  onPyodideStatusChange,
  type PyodideStatus,
} from '@/lib/utils/pyodide-runner';
import type { GhostieState } from '@/lib/ghostie-assets';
import {
  CodingLabShell,
  CodingLabProblemContent,
  type ChallengeDifficulty,
} from '@/components/coding-lab/CodingLabShell';
import { FloatingGhostieMentor } from '@/components/coding-lab/FloatingGhostieMentor';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, ChevronUp } from 'lucide-react';

function formatRunDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} sn`;
}

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#1e1e1e] font-mono text-sm text-slate-400">
      Editör yükleniyor...
    </div>
  ),
});

type EditorState = 'idle' | 'running' | 'submitting' | 'pyodide-loading';

interface CodeRunnerAssignmentProps {
  question: QuestionResponse;
  currentAnswer: string;
  onChange: (answer: string) => void;
  questionIndex?: number;
  totalQuestions?: number;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
}

function getGhostieState(
  editorState: EditorState,
  runResult: CodeRunResponse | null,
  submitResult: CodeSubmitResponse | null,
): GhostieState {
  if (editorState === 'pyodide-loading') return 'thinking';
  if (editorState === 'running' || editorState === 'submitting') return 'thinking';
  if (submitResult !== null) return submitResult.passed ? 'very_happy' : 'wrong';
  if (runResult !== null) {
    if (runResult.timedOut) return 'angry';
    if (runResult.stderr && runResult.exitCode !== 0) return 'wrong';
  }
  return 'idle';
}

function getGhostieMessage(
  editorState: EditorState,
  runResult: CodeRunResponse | null,
  submitResult: CodeSubmitResponse | null,
  pyodideStatus: PyodideStatus,
): string {
  if (editorState === 'pyodide-loading' || pyodideStatus === 'loading') {
    return 'Python çalıştırıcı yükleniyor... İlk seferde biraz sürebilir. ⏳';
  }
  if (editorState === 'running') return 'Kodun çalıştırılıyor...';
  if (editorState === 'submitting') return 'Test senaryoları değerlendiriliyor...';
  if (submitResult !== null) return submitResult.feedback;
  if (runResult?.timedOut) return 'Zaman aşımı! Sonsuz döngü var mı?';
  if (runResult?.stderr && runResult.exitCode !== 0) {
    const error = runResult.stderr.toLowerCase();
    if (error.includes('indentationerror')) {
      return 'Girinti hatası (IndentationError)! Python\'da boşluklar çok önemlidir. Satır başındaki fazla boşlukları silmelisin.';
    }
    if (error.includes('syntaxerror')) {
      return 'Yazım hatası (SyntaxError) var. Parantezleri veya tırnak işaretlerini kontrol etmeyi unutma!';
    }
    if (error.includes('nameerror')) {
      return 'Tanımlanmamış bir isim (NameError) kullandın. Değişken ismini doğru yazdığından emin ol.';
    }
    return 'Bir hata oluştu. Kodu ve hata mesajını kontrol et!';
  }
  if (runResult?.exitCode === 0) return 'Kod başarıyla çalıştı!';
  return 'Kodunu yaz, Çalıştır\'a bas.';
}

type ExtendedQuestion = QuestionResponse & { difficulty?: string; title?: string };

function getDifficultyFromQuestion(question: ExtendedQuestion, index: number): ChallengeDifficulty {
  if (question.difficulty === 'easy') return 'Kolay';
  if (question.difficulty === 'medium') return 'Orta';
  if (question.difficulty === 'hard') return 'Zor';
  if (index <= 1) return 'Kolay';
  if (index <= 3) return 'Orta';
  return 'Zor';
}

// ─── Çalıştır çıktısı ──────────────────────────────────────────────────────
function SmartRunOutput({ result }: { result: CodeRunResponse }) {
  return (
    <div className="h-full overflow-auto bg-[#090d16] p-4 font-mono text-xs">
      {result.timedOut && (
        <div className="mb-3 flex items-center gap-2 text-orange-400">
          <span>⏱</span>
          <span>Zaman aşımı</span>
        </div>
      )}

      {result.stdout && (
        <div className="mb-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span className="text-green-500">▶</span>
            <span>ÇIKTI</span>
          </div>
          <pre className="whitespace-pre-wrap text-[#39ff14]">{result.stdout}</pre>
        </div>
      )}

      {result.stderr && (
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span className="text-red-500">⚠</span>
            <span>HATA ÇIKTISI</span>
          </div>
          <pre className="whitespace-pre-wrap text-rose-400">{result.stderr}</pre>
        </div>
      )}

      {!result.stdout && !result.stderr && (
        <span className="italic text-slate-500">(çıktı yok)</span>
      )}

      <div className="mt-3 flex gap-4 border-t border-slate-800/60 pt-2 text-[10px] text-slate-500">
        <span>
          EXIT:{' '}
          <span className={result.exitCode === 0 ? 'font-bold text-green-400' : 'font-bold text-red-400'}>
            {result.exitCode}
          </span>
        </span>
        <span>
          Süre:{' '}
          <span className="font-bold text-blue-400">{formatRunDuration(result.durationMs)}</span>
        </span>
      </div>
    </div>
  );
}

// ─── Tek test satırı ───────────────────────────────────────────────────────
function SmartTestRow({ result, index }: { result: TestCaseResult; index: number }) {
  if (result.hidden) {
    return (
      <div className="flex items-center justify-between border-b border-gray-800/60 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-500">🔒</span>
          <span className="text-sm text-slate-500">Gizli doğrulama</span>
        </div>
        <span className="font-mono text-[11px] text-slate-600">{result.durationMs}ms</span>
      </div>
    );
  }

  const name = result.name || `Test ${index + 1}`;
  const showDetails = !result.passed;

  return (
    <div className={cn('border-b border-gray-800/60', showDetails && 'bg-red-950/10')}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className={cn('text-base font-bold', result.passed ? 'text-green-400' : 'text-red-400')}>
            {result.passed ? '✓' : '✗'}
          </span>
          <span className={cn('text-sm font-medium', result.passed ? 'text-green-400' : 'text-red-400')}>
            {name}
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">{result.durationMs}ms</span>
      </div>

      {showDetails && (
        <div className="mx-4 mb-3 overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="w-[90px] border-r border-gray-800 px-3 py-2 align-top text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Beklenen
                </td>
                <td className="break-all px-3 py-2 font-mono text-slate-300">
                  {result.expectedStdout?.trim() || '(boş)'}
                </td>
              </tr>
              <tr>
                <td className="border-r border-gray-800 px-3 py-2 align-top text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Alınan
                </td>
                <td className="break-all px-3 py-2 font-mono text-slate-300">
                  {result.stdout?.trim() || '(boş)'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Test sonuçları paneli ─────────────────────────────────────────────────
function SmartTestResults({ submitResult }: { submitResult: CodeSubmitResponse }) {
  const { testResults, passed } = submitResult;
  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length;

  return (
    <div className="flex h-full flex-col bg-[#090d16]">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-800 px-4 py-2.5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Test Sonuçları
        </span>
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[11px] font-bold',
            passed ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400',
          )}
        >
          {passedCount}/{totalCount} geçti {passed ? '✓' : '✗'}
        </span>
      </div>

      <div className="overflow-y-auto">
        {testResults.map((r, i) => (
          <SmartTestRow key={i} result={r} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Akıllı panel — sekme yok, duruma göre içerik ─────────────────────────
function SmartPanel({
  editorState,
  runResult,
  submitResult,
}: {
  editorState: EditorState;
  runResult: CodeRunResponse | null;
  submitResult: CodeSubmitResponse | null;
}) {
  if (editorState === 'running') {
    return (
      <div className="flex h-full items-center gap-2 bg-[#090d16] p-4 font-mono text-xs text-slate-400">
        <span className="animate-spin">⟳</span>
        <span>Kod çalıştırılıyor...</span>
      </div>
    );
  }

  if (editorState === 'submitting') {
    return (
      <div className="flex h-full items-center gap-2 bg-[#090d16] p-4 font-mono text-xs text-slate-400">
        <span className="animate-spin">⟳</span>
        <span>Test senaryoları değerlendiriliyor...</span>
      </div>
    );
  }

  if (submitResult !== null) {
    if (submitResult.testResults.length > 0) {
      return <SmartTestResults submitResult={submitResult} />;
    }
    // Test senaryosu yoksa gönder çıktısını göster
    return (
      <SmartRunOutput
        result={{
          stdout: submitResult.stdout ?? '',
          stderr: submitResult.stderr ?? '',
          exitCode: submitResult.passed ? 0 : 1,
          durationMs: 0,
          timedOut: false,
        }}
      />
    );
  }

  if (runResult !== null) {
    return <SmartRunOutput result={runResult} />;
  }

  return (
    <div className="flex h-full items-center bg-[#090d16] p-4 font-mono text-xs text-slate-500">
      <span className="mr-2 animate-pulse text-slate-400">$_</span>
      <span className="italic">Kodu yaz, Çalıştır&apos;a bas.</span>
    </div>
  );
}

function PyodideLoadingBanner({ status }: { status: PyodideStatus }) {
  if (status === 'ready' || status === 'idle') return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm',
        status === 'loading'
          ? 'border-primary/30 bg-primary/5 text-primary'
          : 'border-error/30 bg-error-container text-error',
      )}
    >
      {status === 'loading' && (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <div>
            <p className="font-semibold">Python çalıştırıcı yükleniyor...</p>
            <p className="text-xs opacity-70">
              İlk seferde ~10 saniye sürebilir, sonraki çalıştırmalar anlık olacak.
            </p>
          </div>
        </>
      )}
      {status === 'error' && (
        <>
          <span className="text-lg">⚠</span>
          <div>
            <p className="font-semibold">Python çalıştırıcı yüklenemedi</p>
            <p className="text-xs opacity-70">İnternet bağlantınızı kontrol edin ve sayfayı yenileyin.</p>
          </div>
        </>
      )}
    </div>
  );
}

function CorrectAnswerBanner({
  explanation,
  onSuccess,
}: {
  explanation?: string | null;
  onSuccess: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onSuccess, 1500);
    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div className="rounded-xl border border-secondary/40 bg-secondary/10 px-4 py-3">
      <p className="font-bold text-secondary">✓ Doğru! Harika iş çıkardın!</p>
      {explanation && <p className="mt-1 text-xs text-on-surface-variant">{explanation}</p>}
    </div>
  );
}

function WrongAnswerBanner({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="rounded-xl border border-error/40 bg-error-container/20 px-4 py-3">
      <p className="font-bold text-error">✗ Yanlış. Tekrar dene!</p>
    </div>
  );
}

export function CodeRunnerAssignment({
  question,
  currentAnswer,
  onChange,
  questionIndex = 0,
  totalQuestions = 1,
  onPrev,
  onNext,
  canPrev = false,
  canNext = false,
}: CodeRunnerAssignmentProps) {
  const q = question as ExtendedQuestion;
  const starterCode = question.starterCode ?? '# Çözümünü buraya yaz\n';

  const [code, setCode] = useState(
    currentAnswer && currentAnswer !== '__code_editor__' ? currentAnswer : starterCode,
  );
  const [editorState, setEditorState] = useState<EditorState>('idle');
  const [runResult, setRunResult] = useState<CodeRunResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<CodeSubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useTextarea, setUseTextarea] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState<PyodideStatus>(getPyodideStatus());
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'wrong'>('none');
  const [showHint, setShowHint] = useState(false);

  const prevQuestionId = useRef(question.id);
  useEffect(() => {
    if (prevQuestionId.current !== question.id) {
      prevQuestionId.current = question.id;
      const newCode = question.starterCode ?? '# Çözümünü buraya yaz\n';
      setCode(newCode);
      setRunResult(null);
      setSubmitResult(null);
      setError(null);
      setFeedbackState('none');
      setShowHint(false);
    }
  }, [question.id, question.starterCode]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) setUseTextarea(true);
  }, []);

  useEffect(() => {
    return onPyodideStatusChange(setPyodideStatus);
  }, []);

  const publicExamples =
    question.testCases
      ?.filter((tc) => !tc.hidden)
      .slice(0, 2)
      .map((tc) => ({ input: tc.stdin.replace(/\n/g, ' / '), output: tc.expectedStdout })) ?? [];

  const expectedOutput = question.testCases?.find((tc) => !tc.hidden)?.expectedStdout ?? null;

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const v = value ?? '';
      setCode(v);
      onChange(v);
    },
    [onChange],
  );

  const handleRun = async () => {
    if (editorState !== 'idle') return;
    setEditorState('running');
    setRunResult(null);
    setSubmitResult(null);
    setError(null);

    try {
      const result = await runPython(code, '', question.maxRuntimeMs ?? 5000);
      setRunResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kod çalıştırılamadı.';
      setError(msg);
    } finally {
      setEditorState('idle');
    }
  };

  const handleSubmit = async () => {
    if (editorState !== 'idle') return;
    setEditorState('submitting');
    setRunResult(null);
    setSubmitResult(null);
    setError(null);
    setFeedbackState('none');

    try {
      const testCases = question.testCases ?? [];
      let outcome;
      if (testCases.length === 0) {
        const result = await runPython(code, '', question.maxRuntimeMs ?? 5000);
        outcome = {
          passed: result.exitCode === 0,
          score: result.exitCode === 0 ? 100 : 0,
          stdout: result.stdout,
          stderr: result.stderr,
          testResults: [],
          feedback: result.exitCode === 0 ? 'Kod başarıyla çalıştı! ✓' : 'Kodda hata var, kontrol et.',
        };
        setSubmitResult(outcome);
      } else {
        outcome = await evaluateTestCases(code, testCases, question.maxRuntimeMs ?? 5000);
        setSubmitResult(outcome);
      }

      if (outcome.passed) {
        setFeedbackState('correct');
        onChange('__code_editor__');
      } else {
        setFeedbackState('wrong');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gönderim başarısız.';
      setError(msg);
    } finally {
      setEditorState('idle');
    }
  };

  const handleReset = () => {
    setCode(starterCode);
    onChange(starterCode);
    setRunResult(null);
    setSubmitResult(null);
    setError(null);
    setFeedbackState('none');
  };

  const handleCorrectAutoAdvance = useCallback(() => {
    setFeedbackState('none');
    if (onNext) onNext();
  }, [onNext]);

  const handleWrongDismiss = useCallback(() => {
    setFeedbackState('none');
  }, []);

  const isLoading = editorState !== 'idle';
  const isAnswered = currentAnswer === '__code_editor__';

  const ghostieState = getGhostieState(editorState, runResult, submitResult);
  const ghostieMessage = getGhostieMessage(editorState, runResult, submitResult, pyodideStatus);
  const difficulty = getDifficultyFromQuestion(q, questionIndex);
  const questionTitle = q.title ?? question.questionText;

  const toolbar = (
    <>
      <button
        type="button"
        onClick={handleRun}
        disabled={isLoading}
        title="Kodu çalıştırır ve çıktıyı gösterir — ilerlemez"
        className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
      >
        {editorState === 'running' ? '⟳ Çalışıyor...' : '▶ Çalıştır'}
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        title="Cevabı kontrol eder — doğruysa sonraki soruya geçer"
        className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
      >
        {editorState === 'submitting' ? '⟳ Gönderiliyor...' : '✓ Gönder'}
      </button>
      <button
        type="button"
        onClick={handleReset}
        disabled={isLoading}
        className="rounded-xl border border-gray-600/60 bg-transparent px-4 py-2 text-xs font-bold text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-300 disabled:opacity-50"
      >
        ↺ Sıfırla
      </button>
    </>
  );

  const editorPanel = (
    <div className="flex h-full min-h-0 flex-col">
      {feedbackState === 'correct' && (
        <div className="px-3 pt-3">
          <CorrectAnswerBanner explanation={question.explanation} onSuccess={handleCorrectAutoAdvance} />
        </div>
      )}
      {feedbackState === 'wrong' && (
        <div className="px-3 pt-3">
          <WrongAnswerBanner onDismiss={handleWrongDismiss} />
        </div>
      )}

      {/* Sadece dosya adı etiketi — tıklanamaz */}
      <div className="flex items-center border-b border-[#3c3c3c] bg-[#252526] px-3 py-2">
        <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white">
          solution.py
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <span className="animate-pulse text-sm text-white">İşleniyor...</span>
          </div>
        )}
        {useTextarea ? (
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="h-full min-h-[280px] w-full resize-none border-0 bg-[#1e1e1e] p-4 font-mono text-sm leading-relaxed text-slate-100 focus:outline-none"
          />
        ) : (
          <MonacoEditor
            key={`editor-${questionIndex}`}
            height="100%"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
            }}
          />
        )}
      </div>
    </div>
  );

  const problemPanel = (
    <div className="flex flex-col gap-4">
      <CodingLabProblemContent
        instructions={question.assignmentInstructions ?? question.questionText}
        hint={undefined}
        examples={publicExamples}
      />

      {expectedOutput && (
        <div>
          <p className="mb-1 font-label text-label-sm uppercase tracking-wide text-on-surface-variant">
            Beklenen Çıktı
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-gray-700 bg-gray-900 p-3 font-mono text-sm text-green-300">
            {expectedOutput}
          </pre>
        </div>
      )}

      {question.hint && (
        <div>
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 transition-colors hover:bg-amber-500/15 dark:text-amber-300"
          >
            <span className="font-semibold">💡 İpucu</span>
            {showHint ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showHint && (
            <div className="mt-1 rounded-b-xl border border-t-0 border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
              {question.hint}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <PyodideLoadingBanner status={pyodideStatus} />

      {error && (
        <div className="rounded-xl border border-error/30 bg-error-container p-4 text-sm text-error">
          <p className="font-semibold">⚠ {error}</p>
        </div>
      )}

      <CodingLabShell
        meta={{
          title: `Soru ${questionIndex + 1}/${totalQuestions}: ${questionTitle}`,
          difficulty,
          topic: 'Python',
          estimatedMinutes: 5 + questionIndex * 2,
          questionIndex,
          totalQuestions,
        }}
        toolbar={toolbar}
        onPrev={onPrev}
        onNext={onNext}
        canPrev={canPrev}
        canNext={isAnswered && canNext}
        problemPanel={problemPanel}
        editorPanel={editorPanel}
        resultsPanel={
          <SmartPanel
            editorState={editorState}
            runResult={runResult}
            submitResult={submitResult}
          />
        }
      />

      <FloatingGhostieMentor
        state={ghostieState}
        message={ghostieMessage}
        scoreBanner={
          submitResult ? (
            <div
              className={cn(
                'rounded-xl border p-3 text-center',
                submitResult.passed
                  ? 'border-secondary/30 bg-secondary/10'
                  : 'border-error/30 bg-error-container/20',
              )}
            >
              <p className="font-heading text-2xl font-bold">{submitResult.score}%</p>
              <p className="mt-1 text-xs font-semibold">
                {submitResult.passed ? 'Tüm testler geçti' : 'Bazı testler başarısız'}
              </p>
            </div>
          ) : undefined
        }
      />
    </div>
  );
}
