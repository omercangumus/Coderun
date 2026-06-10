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

type ResultTab = 'output' | 'errors' | 'tests';

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

function TerminalOutput({ result }: { result: CodeRunResponse | null }) {
  if (!result) {
    return (
      <div className="flex h-full items-center bg-[#090d16] p-4 font-mono text-xs text-slate-500">
        <span className="mr-2 animate-pulse">$_</span>
        Kodunu yaz, Çalıştır&apos;a bas.
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-[#090d16] p-4 font-mono text-xs">
      {result.timedOut && (
        <div className="mb-2 rounded-lg border border-orange-500/40 bg-orange-950/60 px-3 py-1.5 text-orange-400">
          ⏱ Zaman aşımı
        </div>
      )}
      {result.stdout && <pre className="whitespace-pre-wrap text-[#39ff14]">{result.stdout}</pre>}
      {result.stderr && <pre className="mt-1 whitespace-pre-wrap text-rose-400">{result.stderr}</pre>}
      {!result.stdout && !result.stderr && (
        <span className="italic text-slate-500">(çıktı yok)</span>
      )}
      <div className="mt-3 flex gap-4 border-t border-slate-800/80 pt-2 text-[10px] text-slate-500">
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

function TestResultsPanel({ results }: { results: TestCaseResult[] }) {
  if (results.length === 0) return null;

  return (
    <div className="h-full overflow-y-auto bg-surface-container-low p-3">
      <p className="mb-2 font-label text-label-sm uppercase tracking-wide text-on-surface-variant">
        Test Sonuçları
      </p>
      <div className="space-y-2">
        {results.map((r, i) => (
          <div
            key={i}
            className={cn(
              'rounded-xl border p-3 text-xs',
              r.passed
                ? 'border-secondary/30 bg-secondary/10 text-secondary'
                : 'border-error/30 bg-error-container/30 text-error',
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold">{r.passed ? '✓' : '✗'}</span>
              <span className="font-semibold">{r.name}</span>
              {r.hidden && (
                <span className="rounded bg-surface-container px-1.5 py-0.5 text-[9px] uppercase">gizli</span>
              )}
              <span className="ml-auto font-mono opacity-70">{formatRunDuration(r.durationMs)}</span>
            </div>
            {!r.passed && !r.hidden && r.expectedStdout && (
              <p className="mt-2 font-mono text-[10px] opacity-80">Beklenen: {r.expectedStdout.slice(0, 120)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PyodideLoadingBanner({ status }: { status: PyodideStatus }) {
  if (status === 'ready' || status === 'idle') return null;

  return (
    <div
      className={cn(
        'rounded-xl border px-4 py-3 text-sm flex items-center gap-3',
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
            <p className="text-xs opacity-70">İlk seferde ~10 saniye sürebilir, sonraki çalıştırmalar anlık olacak.</p>
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

/** Doğru cevap banner'ı: 1.5 sn görünür, sonra onSuccess çağrılır */
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
      {explanation && (
        <p className="mt-1 text-xs text-on-surface-variant">{explanation}</p>
      )}
    </div>
  );
}

/** Yanlış cevap banner'ı: 3 sn görünür, sonra kaybolur — editör temizlenmez */
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
  const [editorTab, setEditorTab] = useState<'editor' | 'terminal'>('editor');
  const [resultTab, setResultTab] = useState<ResultTab>('output');
  const [runResult, setRunResult] = useState<CodeRunResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<CodeSubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useTextarea, setUseTextarea] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState<PyodideStatus>(getPyodideStatus());
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'wrong'>('none');
  const [showHint, setShowHint] = useState(false);

  // Soru değişince tüm state'i sıfırla
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
      setEditorTab('editor');
      setResultTab('output');
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

  /** Çalıştır: sadece kodu çalıştırır, ilerlemez */
  const handleRun = async () => {
    if (editorState !== 'idle') return;
    setEditorState('running');
    setRunResult(null);
    setSubmitResult(null);
    setError(null);
    setEditorTab('terminal');
    setResultTab('output');

    try {
      const result = await runPython(code, '', question.maxRuntimeMs ?? 5000);
      setRunResult(result);
      setResultTab(result.stderr && result.exitCode !== 0 ? 'errors' : 'output');
      setEditorTab('terminal');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kod çalıştırılamadı.';
      setError(msg);
    } finally {
      setEditorState('idle');
    }
  };

  /** Gönder: cevabı kontrol eder, doğruysa 1.5 sn sonra ilerler */
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
        setResultTab('output');
      } else {
        outcome = await evaluateTestCases(code, testCases, question.maxRuntimeMs ?? 5000);
        setSubmitResult(outcome);
        setResultTab('tests');
      }

      if (outcome.passed) {
        setFeedbackState('correct');
        onChange('__code_editor__');
        // Auto-advance after 1.5s handled by CorrectAnswerBanner
      } else {
        setFeedbackState('wrong');
        // Editör TEMİZLENMEZ — sadece banner 3 sn sonra kaybolur
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
  // Sonraki buton sadece soru cevaplanmışsa aktif
  const isAnswered = currentAnswer === '__code_editor__';

  const resultsPanelContent = () => {
    if (submitResult && resultTab === 'tests') {
      return <TestResultsPanel results={submitResult.testResults} />;
    }
    if (runResult && resultTab === 'errors') {
      return (
        <div className="h-full overflow-auto bg-[#090d16] p-4 font-mono text-xs text-rose-400">
          {runResult.stderr || '(hata çıktısı yok)'}
        </div>
      );
    }
    if (runResult) {
      return <TerminalOutput result={runResult} />;
    }
    return <TerminalOutput result={null} />;
  };

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
        className="rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-on-secondary transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {editorState === 'running' ? '⟳ Çalışıyor...' : '▶ Çalıştır'}
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        title="Cevabı kontrol eder — doğruysa sonraki soruya geçer"
        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {editorState === 'submitting' ? '⟳ Gönderiliyor...' : '✓ Gönder'}
      </button>
      <button
        type="button"
        onClick={handleReset}
        disabled={isLoading}
        className="rounded-xl border border-outline-variant px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
      >
        ↺ Sıfırla
      </button>
    </>
  );

  const editorPanel = (
    <div className="flex h-full min-h-[360px] flex-col">
      {/* Feedback banners */}
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

      <div className="flex items-center gap-2 border-b border-[#3c3c3c] bg-[#252526] px-3 py-2">
        <button
          type="button"
          onClick={() => setEditorTab('editor')}
          className={cn(
            'rounded-lg px-3 py-1 text-xs font-semibold',
            editorTab === 'editor' ? 'bg-white/10 text-white' : 'text-white/50',
          )}
        >
          solution.py
        </button>
        <button
          type="button"
          onClick={() => setEditorTab('terminal')}
          className={cn(
            'rounded-lg px-3 py-1 text-xs font-semibold',
            editorTab === 'terminal' ? 'bg-white/10 text-white' : 'text-white/50',
          )}
        >
          Terminal
        </button>
        <button
          type="button"
          onClick={() => setUseTextarea(!useTextarea)}
          className="ml-auto text-[10px] font-semibold text-primary hover:underline"
        >
          {useTextarea ? 'Monaco' : 'Metin'}
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <span className="animate-pulse text-sm text-white">İşleniyor...</span>
          </div>
        )}
        {editorTab === 'editor' ? (
          useTextarea ? (
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="h-full min-h-[280px] w-full resize-none border-0 bg-[#1e1e1e] p-4 font-mono text-sm leading-relaxed text-slate-100 focus:outline-none"
            />
          ) : (
            // key prop force-remounts Monaco on question change
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
          )
        ) : (
          <TerminalOutput result={runResult} />
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

      {/* Beklenen çıktı */}
      {expectedOutput && (
        <div>
          <p className="mb-1 font-label text-label-sm uppercase tracking-wide text-on-surface-variant">
            Beklenen Çıktı
          </p>
          <pre className="rounded-xl border border-outline-variant bg-[#0d1117] p-3 font-mono text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">
            {expectedOutput}
          </pre>
        </div>
      )}

      {/* İpucu — tıklanınca açılır, kapatılabilir */}
      {question.hint && (
        <div>
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 transition-colors"
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
    <div className="flex flex-col gap-3">
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
          <div className="flex h-full min-h-[140px] flex-col">
            <div className="flex gap-1 border-b border-outline-variant bg-surface-container px-2 py-1">
              {(
                [
                  { id: 'output' as const, label: 'Çıktı' },
                  { id: 'errors' as const, label: 'Hatalar' },
                  { id: 'tests' as const, label: 'Testler' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setResultTab(tab.id)}
                  disabled={tab.id === 'tests' && !submitResult}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide',
                    resultTab === tab.id
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-high',
                    tab.id === 'tests' && !submitResult && 'opacity-40',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="min-h-0 flex-1">{resultsPanelContent()}</div>
          </div>
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
