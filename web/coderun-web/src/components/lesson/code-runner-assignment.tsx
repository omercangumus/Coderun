'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { QuestionResponse } from '@/lib/types/module.types';
import type { CodeRunResponse, CodeSubmitResponse, TestCaseResult } from '@/lib/types/code-runner.types';
import { codeApi } from '@/lib/api/code-api';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';
import type { GhostieState } from '@/lib/ghostie-assets';
import {
  CodingLabShell,
  CodingLabProblemContent,
  type ChallengeDifficulty,
} from '@/components/coding-lab/CodingLabShell';
import { cn } from '@/lib/utils/cn';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#1e1e1e] font-mono text-sm text-slate-400">
      Editör yükleniyor...
    </div>
  ),
});

type EditorState = 'idle' | 'running' | 'submitting';

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
): string {
  if (editorState === 'running') return 'Kodun çalıştırılıyor...';
  if (editorState === 'submitting') return 'Test senaryoları değerlendiriliyor...';
  if (submitResult !== null) return submitResult.feedback;
  if (runResult?.timedOut) return 'Zaman aşımı! Sonsuz döngü var mı?';
  if (runResult?.stderr && runResult.exitCode !== 0) return 'Bir hata oluştu. Kodu kontrol et!';
  if (runResult?.exitCode === 0) return 'Kod başarıyla çalıştı!';
  return 'Kodunu yaz, çalıştır ve gönder!';
}

function inferDifficulty(index: number): ChallengeDifficulty {
  if (index <= 1) return 'Kolay';
  if (index <= 3) return 'Orta';
  return 'Zor';
}

function TerminalOutput({ result }: { result: CodeRunResponse | null }) {
  if (!result) {
    return (
      <div className="flex h-full items-center bg-[#090d16] p-4 font-mono text-xs text-slate-500">
        <span className="mr-2 animate-pulse">$_</span>
        Çalıştır butonuna bas...
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
          SÜRE: <span className="font-bold text-blue-400">{result.durationMs}ms</span>
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
              <span className="ml-auto font-mono opacity-70">{r.durationMs}ms</span>
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
  const starterCode = question.starterCode ?? '# Buraya kodunuzu yazin\n';
  const [code, setCode] = useState(currentAnswer || starterCode);
  const [editorState, setEditorState] = useState<EditorState>('idle');
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal'>('editor');
  const [runResult, setRunResult] = useState<CodeRunResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<CodeSubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useTextarea, setUseTextarea] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) setUseTextarea(true);
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

  const handleRun = async () => {
    if (editorState !== 'idle') return;
    setEditorState('running');
    setRunResult(null);
    setSubmitResult(null);
    setError(null);
    setActiveTab('terminal');
    try {
      const result = await codeApi.runCode({
        language: question.language ?? 'python',
        code,
        timeoutMs: question.maxRuntimeMs ?? 5000,
        memoryLimitMb: question.memoryLimitMb ?? 128,
      });
      setRunResult(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kod çalıştırılamadı.');
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
    try {
      const result = await codeApi.submitCode({
        questionId: question.id,
        code,
        language: question.language ?? 'python',
      });
      setSubmitResult(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gönderim başarısız.');
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
  };

  const isLoading = editorState !== 'idle';
  const ghostieState = getGhostieState(editorState, runResult, submitResult);
  const ghostieMessage = getGhostieMessage(editorState, runResult, submitResult);

  const toolbar = (
    <>
      <button
        type="button"
        onClick={handleRun}
        disabled={isLoading}
        className="rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-on-secondary transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {editorState === 'running' ? '⟳ Çalışıyor...' : '▶ Çalıştır'}
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
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
      <div className="flex items-center gap-2 border-b border-[#3c3c3c] bg-[#252526] px-3 py-2">
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={cn(
            'rounded-lg px-3 py-1 text-xs font-semibold',
            activeTab === 'editor' ? 'bg-white/10 text-white' : 'text-white/50',
          )}
        >
          solution.py
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('terminal')}
          className={cn(
            'rounded-lg px-3 py-1 text-xs font-semibold',
            activeTab === 'terminal' ? 'bg-white/10 text-white' : 'text-white/50',
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
        {activeTab === 'editor' ? (
          useTextarea ? (
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
          )
        ) : (
          <TerminalOutput result={runResult} />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="rounded-xl border border-error/30 bg-error-container p-3 text-sm text-error">
          ⚠ {error}
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
          submitResult ? (
            <TestResultsPanel results={submitResult.testResults} />
          ) : activeTab === 'terminal' && runResult ? (
            <div className="h-full max-h-[200px]">
              <TerminalOutput result={runResult} />
            </div>
          ) : null
        }
        mentorPanel={
          <div className="flex h-full flex-col gap-3 p-4">
            <GhostieReaction state={ghostieState} message={ghostieMessage} size={96} preferAnimation />
            {submitResult && (
              <div
                className={cn(
                  'rounded-2xl border p-4 text-center',
                  submitResult.passed
                    ? 'border-secondary/30 bg-secondary/10'
                    : 'border-error/30 bg-error-container/20',
                )}
              >
                <p className="font-heading text-3xl font-bold">{submitResult.score}%</p>
                <p className="mt-1 text-sm font-semibold">
                  {submitResult.passed ? '🎉 Tüm testler geçti!' : 'Tekrar dene!'}
                </p>
              </div>
            )}
          </div>
        }
      />

      {/* Mobile mentor fallback */}
      <div className="xl:hidden">
        <GhostieReaction state={ghostieState} message={ghostieMessage} size={72} preferAnimation />
      </div>
    </div>
  );
}
