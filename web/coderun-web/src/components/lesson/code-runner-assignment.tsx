'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { QuestionResponse } from '@/lib/types/module.types';
import type { CodeRunResponse, CodeSubmitResponse, TestCaseResult } from '@/lib/types/code-runner.types';
import { codeApi } from '@/lib/api/code-api';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';
import type { GhostieState } from '@/lib/ghostie-assets';

// Monaco — SSR devre dışı (Next.js hydration hatası önlenir)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-400 text-sm font-mono">
      Editör yükleniyor...
    </div>
  ),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EditorState = 'idle' | 'running' | 'submitting';

interface CodeRunnerAssignmentProps {
  question: QuestionResponse;
  currentAnswer: string;
  onChange: (answer: string) => void;
}

// ---------------------------------------------------------------------------
// Ghostie state mapping
// ---------------------------------------------------------------------------

function getGhostieState(
  editorState: EditorState,
  runResult: CodeRunResponse | null,
  submitResult: CodeSubmitResponse | null,
): GhostieState {
  if (editorState === 'running' || editorState === 'submitting') return 'thinking';
  if (submitResult !== null) {
    return submitResult.passed ? 'very_happy' : 'wrong';
  }
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
): string | undefined {
  if (editorState === 'running') return 'Kodun çalıştırılıyor...';
  if (editorState === 'submitting') return 'Test senaryoları değerlendiriliyor...';
  if (submitResult !== null) {
    return submitResult.feedback;
  }
  if (runResult !== null) {
    if (runResult.timedOut) return 'Zaman aşımı! Sonsuz döngü var mı?';
    if (runResult.stderr && runResult.exitCode !== 0) return 'Bir hata oluştu. Kodu kontrol et!';
    if (runResult.exitCode === 0) return 'Kod başarıyla çalıştı!';
  }
  return 'Kodunu yaz ve çalıştır!';
}

// ---------------------------------------------------------------------------
// Terminal component
// ---------------------------------------------------------------------------

function Terminal({ result }: { result: CodeRunResponse | null }) {
  if (!result) {
    return (
      <div className="h-full bg-[#090d16] rounded-b-lg p-4 font-mono text-xs text-slate-500 flex items-center">
        <span className="animate-pulse mr-2">$_</span>
        <span>Kodu çalıştırmak için yukarıdaki &quot;Çalıştır&quot; butonuna basın...</span>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#090d16] rounded-b-lg p-4 font-mono text-xs overflow-auto">
      {result.timedOut && (
        <div className="mb-2 px-3 py-1.5 bg-orange-950/60 border border-orange-500/40 rounded-lg text-orange-400 flex items-center gap-2">
          <span className="animate-pulse">⏱</span>
          <span>Zaman aşımı — Kod çalıştırılma süresi sınırı aştı!</span>
        </div>
      )}
      {result.stdout && (
        <pre className="text-[#39ff14] whitespace-pre-wrap break-words font-medium leading-relaxed">
          {result.stdout}
        </pre>
      )}
      {result.stderr && (
        <pre className="text-rose-400 whitespace-pre-wrap break-words font-medium leading-relaxed mt-1">
          {result.stderr}
        </pre>
      )}
      {!result.stdout && !result.stderr && (
        <span className="text-slate-500 font-medium italic">(çıktı üretilmedi)</span>
      )}
      <div className="mt-4 pt-2 border-t border-slate-800/80 text-slate-500 flex gap-4 text-[10px]">
        <span>ÇIKIŞ KODU: <span className={result.exitCode === 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{result.exitCode}</span></span>
        <span>SÜRE: <span className="text-blue-400 font-bold">{result.durationMs}ms</span></span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Test results list
// ---------------------------------------------------------------------------

function TestResultsList({ results }: { results: TestCaseResult[] }) {
  if (results.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <span>⚙️</span> Test Senaryoları Sonuçları
      </h4>
      <div className="grid gap-2">
        {results.map((r, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-xl border text-xs transition-all duration-150 ${
              r.passed
                ? 'bg-green-500/10 border-green-500/30 text-green-300 shadow-[0_0_12px_rgba(34,197,94,0.05)]'
                : 'bg-red-500/10 border-red-500/30 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.05)]'
            }`}
          >
            <span className={`flex items-center justify-center w-5 h-5 rounded-full shrink-0 text-[10px] font-bold ${
              r.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {r.passed ? '✓' : '✗'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold truncate text-slate-200">{r.name}</span>
                {r.hidden && (
                  <span className="shrink-0 px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-md text-[9px] uppercase tracking-wider font-semibold border border-slate-700">
                    gizli
                  </span>
                )}
                <span className="shrink-0 text-slate-500 ml-auto text-[10px] font-mono">{r.durationMs}ms</span>
              </div>
              {!r.passed && r.stdout && (
                <div className="mt-2 p-2 bg-slate-900/60 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">Konsol Çıktısı:</span>
                  <pre className="mt-0.5 text-slate-300 whitespace-pre-wrap break-words text-[10px] font-mono">
                    {r.stdout.slice(0, 200)}
                  </pre>
                </div>
              )}
              {!r.passed && !r.hidden && r.expectedStdout && (
                <div className="mt-1.5 p-2 bg-yellow-950/20 rounded-lg border border-yellow-800/30">
                  <span className="text-[10px] text-yellow-500/80 block uppercase tracking-wider font-bold">Beklenen Çıktı:</span>
                  <pre className="mt-0.5 text-yellow-400 whitespace-pre-wrap break-words text-[10px] font-mono">
                    {r.expectedStdout.slice(0, 200)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CodeRunnerAssignment({
  question,
  currentAnswer,
  onChange,
}: CodeRunnerAssignmentProps) {
  const starterCode = question.starterCode ?? '# Buraya kodunuzu yazin\n';
  const [code, setCode] = useState<string>(currentAnswer || starterCode);
  const [editorState, setEditorState] = useState<EditorState>('idle');
  const [runResult, setRunResult] = useState<CodeRunResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<CodeSubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useTextarea, setUseTextarea] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setUseTextarea(true);
    }
  }, []);

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
      const result = await codeApi.runCode({
        language: question.language ?? 'python',
        code,
        timeoutMs: question.maxRuntimeMs ?? 5000,
        memoryLimitMb: question.memoryLimitMb ?? 128,
      });
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
    try {
      const result = await codeApi.submitCode({
        questionId: question.id,
        code,
        language: question.language ?? 'python',
      });
      setSubmitResult(result);
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
  };

  const ghostieState = getGhostieState(editorState, runResult, submitResult);
  const ghostieMessage = getGhostieMessage(editorState, runResult, submitResult);
  const isLoading = editorState !== 'idle';

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant bg-surface-container/60 flex-wrap">
        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-900/30 text-blue-300 border border-blue-700/40 shadow-sm">
          🐍 {(question.language ?? 'python').toUpperCase()}
        </span>
        <span className="text-sm font-semibold text-on-surface flex-1 truncate">
          {question.questionText}
        </span>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleRun}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all duration-150 active:scale-95 shadow-[0_2px_8px_rgba(22,163,74,0.2)]"
          >
            {editorState === 'running' ? (
              <span className="animate-spin mr-1">⟳</span>
            ) : (
              <span className="mr-1">▶</span>
            )}
            Çalıştır
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary/95 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all duration-150 active:scale-95 shadow-[0_2px_8px_rgba(var(--primary-rgb),0.2)]"
          >
            {editorState === 'submitting' ? (
              <span className="animate-spin mr-1">⟳</span>
            ) : (
              <span className="mr-1">✓</span>
            )}
            Gönder
          </button>
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-surface-container hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed text-on-surface-variant transition-all duration-150 border border-outline-variant hover:text-on-surface active:scale-95"
          >
            <span className="mr-1">↺</span> Sıfırla
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-col lg:flex-row gap-3 min-h-0">
        {/* Instructions panel */}
        {question.assignmentInstructions && (
          <div className="lg:w-[30%] shrink-0 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 overflow-auto max-h-80 lg:max-h-[500px]">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
              📋 Görev
            </h3>
            <pre className="text-sm text-on-surface whitespace-pre-wrap font-sans leading-relaxed">
              {question.assignmentInstructions}
            </pre>
            {question.hint && (
              <div className="mt-3 p-2 rounded-lg bg-yellow-900/20 border border-yellow-700/30 text-xs text-yellow-300">
                💡 {question.hint}
              </div>
            )}
          </div>
        )}

        {/* Editor + terminal */}
        <div className="flex-1 flex flex-col min-w-0 rounded-xl overflow-hidden border border-outline-variant">
          {/* Editor header */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#252526] border-b border-[#3c3c3c]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs text-gray-400 font-mono">solution.py</span>
            <button
              onClick={() => setUseTextarea(!useTextarea)}
              className="ml-auto text-[10px] text-primary hover:underline px-2 py-0.5 bg-primary/10 rounded font-semibold transition-colors"
            >
              {useTextarea ? '🖹 Zengin Editör' : '🖹 Düz Metin Editörü'}
            </button>
          </div>

          {/* Monaco editor / textarea fallback */}
          <div className="flex-1 min-h-[280px] relative">
            {isLoading && (
              <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
                <div className="text-white text-sm animate-pulse">
                  {editorState === 'running' ? '⟳ Çalıştırılıyor...' : '⟳ Değerlendiriliyor...'}
                </div>
              </div>
            )}
            {useTextarea ? (
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-[280px] p-4 font-mono text-sm bg-[#1e1e1e] text-slate-100 border-0 focus:outline-none focus:ring-0 resize-none leading-relaxed"
                placeholder="# Buraya kodunuzu yazın..."
              />
            ) : (
              <MonacoEditor
                height="280px"
                language="python"
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  automaticLayout: true,
                  tabSize: 4,
                  insertSpaces: true,
                }}
              />
            )}
          </div>

          {/* Terminal output */}
          <div className="h-40 border-t border-[#3c3c3c]">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#252526] border-b border-[#3c3c3c]">
              <span className="text-xs text-gray-400 font-mono">Terminal</span>
              {runResult && (
                <span
                  className={`ml-auto text-xs font-mono ${
                    runResult.exitCode === 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  exit: {runResult.exitCode} · {runResult.durationMs}ms
                </span>
              )}
            </div>
            <Terminal result={runResult} />
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-3 rounded-xl bg-red-900/20 border border-red-700/40 text-sm text-red-300">
          ⚠ {error}
        </div>
      )}

      {/* Ghostie + test results */}
      <div className="flex flex-col gap-3">
        <GhostieReaction
          state={ghostieState}
          message={ghostieMessage}
          size={80}
          preferAnimation
        />
        {submitResult && (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant bg-surface-container-lowest">
            <div
              className={`text-2xl font-bold ${
                submitResult.passed ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {submitResult.score}%
            </div>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${submitResult.passed ? 'text-green-300' : 'text-red-300'}`}>
                {submitResult.passed ? '🎉 Tüm testler geçti!' : '❌ Bazı testler başarısız'}
              </div>
            </div>
          </div>
        )}
        {submitResult && <TestResultsList results={submitResult.testResults} />}
      </div>
    </div>
  );
}
