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
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';
import type { GhostieState } from '@/lib/ghostie-assets';
import {
  CodingLabShell,
  CodingLabProblemContent,
  type ChallengeDifficulty,
} from '@/components/coding-lab/CodingLabShell';
import { FloatingGhostieMentor } from '@/components/coding-lab/FloatingGhostieMentor';
import { cn } from '@/lib/utils/cn';

type RunState = 'idle' | 'loading' | 'success' | 'error';

function formatRunDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} sn`;
}

function getButtonClass(state: RunState) {
  switch (state) {
    case 'loading':
      return "rounded-xl px-4 py-2 text-xs font-bold bg-gray-600 cursor-not-allowed text-gray-300 flex items-center justify-center transition-all duration-200";
    case 'success':
      return "rounded-xl px-4 py-2 text-xs font-bold bg-green-600 text-white flex items-center justify-center transition-all duration-200";
    case 'error':
      return "rounded-xl px-4 py-2 text-xs font-bold bg-red-600 text-white flex items-center justify-center transition-all duration-200";
    case 'idle':
    default:
      return "rounded-xl px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all duration-200";
  }
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

function inferDifficulty(index: number): ChallengeDifficulty {
  if (index <= 1) return 'Kolay';
  if (index <= 3) return 'Orta';
  return 'Zor';
}

function TerminalOutput({ result }: { result: CodeRunResponse | null }) {
  if (!result) {
    return (
      <div className="min-h-[150px] overflow-y-auto bg-gray-900 rounded p-4 font-mono text-sm text-slate-500 flex items-center">
        <span className="mr-2 animate-pulse">$_</span>
        Kodunu yaz, Çalıştır&apos;a bas.
      </div>
    );
  }

  const { stdout, stderr, exitCode } = result;
  const hasStdout = !!stdout;
  const hasStderr = !!stderr;
  const bothEmpty = !hasStdout && !hasStderr;

  return (
    <div className="min-h-[150px] overflow-y-auto bg-gray-900 rounded p-4 font-mono text-sm">
      {result.timedOut && (
        <div className="mb-2 rounded-lg border border-orange-500/40 bg-orange-950/60 px-3 py-1.5 text-orange-400 text-xs">
          ⏱ Zaman aşımı
        </div>
      )}
      {bothEmpty && (
        <div className="text-slate-500 italic">Program herhangi bir çıktı üretmedi.</div>
      )}
      {hasStdout && (
        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{stdout}</pre>
      )}
      {hasStdout && hasStderr && (
        <div className="border-t border-gray-600 my-2 opacity-50" />
      )}
      {hasStderr && (
        <div className="text-red-400 font-mono text-sm">
          <span className="font-bold">⚠ Hata Çıktısı:</span>
          <pre className="text-red-400 font-mono text-sm whitespace-pre-wrap mt-1">{stderr}</pre>
        </div>
      )}
      <div className="mt-3 flex gap-4 border-t border-slate-800/80 pt-2 text-[10px] text-slate-500">
        <span>
          EXIT:{' '}
          <span className={exitCode === 0 ? 'font-bold text-green-400' : 'font-bold text-red-400'}>
            {exitCode}
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

// Pyodide loading indicator component
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
  const starterCode = question.starterCode ?? '# Kodunu buraya yaz\n';
  const [code, setCode] = useState(
    currentAnswer && currentAnswer !== '__code_editor__' ? currentAnswer : starterCode,
  );
  const [editorState, setEditorState] = useState<EditorState>('idle');
  const [resultTab, setResultTab] = useState<ResultTab>('output');
  const [runResult, setRunResult] = useState<CodeRunResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<CodeSubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useTextarea, setUseTextarea] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState<PyodideStatus>(getPyodideStatus());

  const [runState, setRunState] = useState<RunState>('idle');
  const [submitState, setSubmitState] = useState<RunState>('idle');
  const isRunningRef = useRef(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) setUseTextarea(true);
  }, []);

  // Reset state when navigating to a new question
  useEffect(() => {
    const starter = question.starterCode ?? '# Kodunu buraya yaz\n';
    setCode(currentAnswer && currentAnswer !== '__code_editor__' ? currentAnswer : starter);
    setRunResult(null);
    setSubmitResult(null);
    setError(null);
    setEditorState('idle');
    setResultTab('output');
    isRunningRef.current = false;
    isSubmittingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  // Listen to Pyodide status changes
  useEffect(() => {
    return onPyodideStatusChange(setPyodideStatus);
  }, []);

  const publicExamples =
    question.testCases
      ?.filter((tc) => !tc.hidden)
      .slice(0, 2)
      .map((tc) => ({ input: tc.stdin.replace(/\n/g, ' / '), output: tc.expectedStdout })) ?? [];

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const v = value ?? '';
      setCode(v);
      onChange(v);
    },
    [onChange],
  );

  // Pyodide-based run (no Docker needed!)
  const handleRun = async () => {
    if (isRunningRef.current || isSubmittingRef.current) return;
    isRunningRef.current = true;
    setRunState('loading');
    setEditorState('running');
    setRunResult(null);
    setSubmitResult(null);
    setError(null);
    setResultTab('output');

    try {
      const result = await runPython(
        code,
        '',
        question.maxRuntimeMs ?? 5000,
      );
      setRunResult(result);
      setResultTab(result.stderr && result.exitCode !== 0 ? 'errors' : 'output');

      if (result.error || (result.stderr && result.exitCode !== 0)) {
        setRunState('error');
        setTimeout(() => setRunState('idle'), 1500);
      } else {
        setRunState('success');
        setTimeout(() => setRunState('idle'), 1500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kod çalıştırılamadı.';
      setError(msg);
      setRunState('error');
      setTimeout(() => setRunState('idle'), 1500);
    } finally {
      isRunningRef.current = false;
      setEditorState('idle');
    }
  };

  // Pyodide-based submit (client-side test evaluation)
  const handleSubmit = async () => {
    if (isRunningRef.current || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSubmitState('loading');
    setEditorState('submitting');
    setRunResult(null);
    setSubmitResult(null);
    setError(null);

    try {
      const testCases = question.testCases ?? [];
      let outcome;
      if (testCases.length === 0) {
        // No test cases — just run the code and mark as submitted
        const result = await runPython(code, '', question.maxRuntimeMs ?? 5000);
        outcome = {
          passed: result.exitCode === 0,
          score: result.exitCode === 0 ? 100 : 0,
          stdout: result.stdout,
          stderr: result.stderr,
          testResults: [],
          feedback: result.exitCode === 0
            ? 'Kod başarıyla çalıştı! ✓'
            : 'Kodda hata var, kontrol et.',
        };
        setSubmitResult(outcome);
        setResultTab('output');
      } else {
        outcome = await evaluateTestCases(
          code,
          testCases,
          question.maxRuntimeMs ?? 5000,
        );
        setSubmitResult(outcome);
        setResultTab('tests');
      }
      if (outcome.passed) {
        onChange('__code_editor__');
        setSubmitState('success');
        const isLast = questionIndex >= totalQuestions - 1;
        setTimeout(() => {
          setSubmitState('idle');
          if (!isLast && onNext) onNext();
        }, 1500);
      } else {
        setSubmitState('error');
        setTimeout(() => setSubmitState('idle'), 1500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gönderim başarısız.';
      setError(msg);
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 1500);
    } finally {
      isSubmittingRef.current = false;
      setEditorState('idle');
    }
  };

  const handleReset = () => {
    setCode(starterCode);
    onChange(starterCode);
    setRunResult(null);
    setSubmitResult(null);
    setError(null);
  };

  const isLoading = editorState !== 'idle';

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

  const toolbar = (
    <>
      <button
        type="button"
        onClick={handleRun}
        disabled={isLoading || runState !== 'idle' || submitState !== 'idle'}
        className={getButtonClass(runState)}
      >
        {runState === 'loading' && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {runState === 'loading' && 'Çalışıyor...'}
        {runState === 'success' && '✓ Tamamlandı'}
        {runState === 'error' && '✗ Hata'}
        {runState === 'idle' && '▶ Çalıştır'}
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || runState !== 'idle' || submitState !== 'idle'}
        className={getButtonClass(submitState)}
      >
        {submitState === 'loading' && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {submitState === 'loading' && 'Gönderiliyor...'}
        {submitState === 'success' && '✓ Tamamlandı'}
        {submitState === 'error' && '✗ Hata'}
        {submitState === 'idle' && '✓ Gönder'}
      </button>
      <button
        type="button"
        onClick={handleReset}
        disabled={isLoading || runState !== 'idle' || submitState !== 'idle'}
        className="rounded-xl border border-outline-variant px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
      >
        ↺ Sıfırla
      </button>
    </>
  );

  const editorPanel = (
    <div className="flex h-full min-h-[360px] flex-col">
      <div className="flex items-center gap-2 border-b border-[#3c3c3c] bg-[#252526] px-3 py-2">
        <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white">
          solution.py
        </span>
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
        {useTextarea ? (
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="h-full min-h-[280px] w-full resize-none border-0 bg-[#1e1e1e] p-4 font-mono text-sm leading-relaxed text-slate-100 focus:outline-none"
          />
        ) : (
          <MonacoEditor
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

  return (
    <div className="flex flex-col gap-3">
      {/* Pyodide loading status */}
      <PyodideLoadingBanner status={pyodideStatus} />

      {error && (
        <div className="rounded-xl border border-error/30 bg-error-container p-4 text-sm text-error">
          <p className="font-semibold">⚠ {error}</p>
        </div>
      )}

      <CodingLabShell
        meta={{
          title: question.questionText,
          difficulty: inferDifficulty(questionIndex),
          topic: 'Python',
          estimatedMinutes: 5 + questionIndex * 2,
          questionIndex,
          totalQuestions,
        }}
        toolbar={toolbar}
        onPrev={onPrev}
        onNext={onNext}
        canPrev={canPrev}
        canNext={canNext}
        problemPanel={
          <CodingLabProblemContent
            instructions={question.assignmentInstructions ?? question.questionText}
            hint={question.hint}
            examples={publicExamples}
          />
        }
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
