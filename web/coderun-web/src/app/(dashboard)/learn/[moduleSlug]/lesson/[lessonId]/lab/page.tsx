'use client';

import { useState } from 'react';
import { ArrowLeft, Play, CheckCircle, RotateCcw, Terminal, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils/cn';
import { GhostieMentorPanel } from '@/components/stitch/GhostieCard';
import { useMentor } from '@/lib/hooks/use-mentor';

const LabTerminalComponent = dynamic(
  () => import('@/components/lab/terminal').then((m) => ({ default: m.LabTerminalComponent })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-on-surface-variant font-sans text-body-sm">
        Terminal yükleniyor...
      </div>
    ),
  }
);

const LabCodeEditor = dynamic(
  () => import('@/components/lab/code-editor').then((m) => ({ default: m.LabCodeEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-on-surface-variant font-sans text-body-sm">
        Editör yükleniyor...
      </div>
    ),
  }
);

const MISSION = {
  title: 'Python Uygulaması Geliştir',
  objective: 'Basit bir Python web uygulaması oluştur ve Docker container içinde çalıştır.',
  checklist: [
    { id: 0, label: 'app.py dosyasını oluştur' },
    { id: 1, label: 'Gerekli kütüphaneleri ekle' },
    { id: 2, label: 'Kodu çalıştır ve çıktıyı doğrula' },
    { id: 3, label: 'Dockerfile oluştur' },
    { id: 4, label: 'Docker container oluştur ve çalıştır' },
  ],
  instructions: [
    'Terminal\'de `ls` komutu ile mevcut dosyaları listele',
    '`cat app.py` ile başlangıç kodunu incele',
    '`python app.py` ile kodu çalıştır',
    'Çıktının beklenen sonuçla eşleştiğini doğrula',
    '`docker build -t myapp .` ile container oluştur',
  ],
  expectedOutput: 'Hello, Coderun! 🚀\nApp running on port 8080',
  commonMistakes: [
    'Dosya adını yanlış yazmak (app.py vs App.py)',
    'Docker daemon\'ın çalışmadığını kontrol etmemek',
    'Port numarasını unutmak',
  ],
};

const LAB_QUICK_ACTIONS = [
  'Give me a hint',
  'Explain simply',
  'Show a tiny example',
  'Why is my code wrong?',
];

export default function LabPage({
  params,
}: {
  params: { moduleSlug: string; lessonId: string };
}) {
  const { moduleSlug, lessonId } = params;
  const [activeTab, setActiveTab] = useState<'terminal' | 'editor'>('terminal');
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showMistakes, setShowMistakes] = useState(false);

  const { messages, sendMessage, isLoading } = useMentor({
    context: 'lab',
    moduleSlug,
    lessonId,
  });

  const toggleItem = (id: number) => {
    setCompletedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const progress = Math.round((completedItems.length / MISSION.checklist.length) * 100);
  const isComplete = completedItems.length === MISSION.checklist.length;

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0 -m-4 lg:-m-6 overflow-hidden">
      {/* ── LEFT PANEL: Mission & Instructions ── */}
      <div className="w-72 flex-shrink-0 flex flex-col bg-white border-r border-outline-variant overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant">
          <div className="flex items-center gap-2 mb-3">
            <Link
              href={`/learn/${moduleSlug}/lesson/${lessonId}`}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Derse geri dön"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide">
              Mission Lab
            </span>
          </div>
          <h1 className="font-heading text-base font-bold text-on-surface leading-tight">
            {MISSION.title}
          </h1>
        </div>

        {/* Progress */}
        <div className="p-4 border-b border-outline-variant">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label text-label-sm text-on-surface-variant">İlerleme</span>
            <span className="font-heading text-sm font-bold text-primary">{progress}%</span>
          </div>
          <div className="cr-progress-bar">
            <div
              className={cn('cr-progress-fill transition-all duration-500', isComplete && 'bg-secondary')}
              style={{ width: `${progress}%` }}
            />
          </div>
          {isComplete && (
            <p className="font-sans text-body-sm text-secondary font-semibold mt-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Görev tamamlandı!
            </p>
          )}
        </div>

        {/* Objective */}
        <div className="p-4 border-b border-outline-variant">
          <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide mb-2">
            Hedef
          </p>
          <p className="font-sans text-body-sm text-on-surface leading-relaxed">
            {MISSION.objective}
          </p>
        </div>

        {/* Checklist */}
        <div className="p-4 border-b border-outline-variant">
          <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide mb-3">
            Kontrol Listesi
          </p>
          <div className="flex flex-col gap-2">
            {MISSION.checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="flex items-start gap-2.5 text-left group"
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all duration-150',
                    completedItems.includes(item.id)
                      ? 'bg-secondary border-secondary text-white'
                      : 'border-outline-variant group-hover:border-primary'
                  )}
                >
                  {completedItems.includes(item.id) && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span
                  className={cn(
                    'font-sans text-body-sm leading-tight',
                    completedItems.includes(item.id)
                      ? 'text-on-surface-variant line-through'
                      : 'text-on-surface'
                  )}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions (collapsible) */}
        <div className="border-b border-outline-variant">
          <button
            onClick={() => setShowInstructions((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-container-low transition-colors"
          >
            <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide">
              Adımlar
            </span>
            {showInstructions ? (
              <ChevronUp className="w-4 h-4 text-on-surface-variant" />
            ) : (
              <ChevronDown className="w-4 h-4 text-on-surface-variant" />
            )}
          </button>
          {showInstructions && (
            <div className="px-4 pb-4">
              <ol className="flex flex-col gap-2">
                {MISSION.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-fixed text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="font-sans text-body-sm text-on-surface leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Expected output */}
        <div className="p-4 border-b border-outline-variant">
          <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide mb-2">
            Beklenen Çıktı
          </p>
          <pre className="bg-[#0D1117] text-green-400 font-mono text-xs p-3 rounded-lg overflow-x-auto">
            {MISSION.expectedOutput}
          </pre>
        </div>

        {/* Common mistakes (collapsible) */}
        <div>
          <button
            onClick={() => setShowMistakes((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-container-low transition-colors"
          >
            <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide">
              Sık Yapılan Hatalar
            </span>
            {showMistakes ? (
              <ChevronUp className="w-4 h-4 text-on-surface-variant" />
            ) : (
              <ChevronDown className="w-4 h-4 text-on-surface-variant" />
            )}
          </button>
          {showMistakes && (
            <div className="px-4 pb-4">
              <ul className="flex flex-col gap-1.5">
                {MISSION.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                    <p className="font-sans text-body-sm text-on-surface-variant">{m}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── CENTER PANEL: Code Editor + Terminal ── */}
      <div className="flex-1 flex flex-col bg-[#1E1E2E] overflow-hidden">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1E1E2E] border-b border-white/10">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('terminal')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-colors',
                activeTab === 'terminal'
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <Terminal className="w-3.5 h-3.5" />
              Terminal
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-colors',
                activeTab === 'editor'
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <Code2 className="w-3.5 h-3.5" />
              app.py
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white rounded-lg text-xs font-semibold font-sans transition-colors"
              aria-label="Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Sıfırla
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-white rounded-lg text-xs font-semibold font-sans hover:opacity-90 transition-opacity"
              aria-label="Çalıştır"
            >
              <Play className="w-3.5 h-3.5" />
              Çalıştır
            </button>
            <button
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all',
                isComplete
                  ? 'bg-secondary text-white hover:opacity-90'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              )}
              disabled={!isComplete}
              aria-label="Doğrula"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Doğrula
            </button>
          </div>
        </div>

        {/* Editor / Terminal */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'terminal' ? <LabTerminalComponent /> : <LabCodeEditor />}
        </div>
      </div>

      {/* ── RIGHT PANEL: Ghostie AI Mentor ── */}
      <div className="w-72 flex-shrink-0 flex flex-col">
        <GhostieMentorPanel
          context={`Lab: ${MISSION.title}`}
          messages={messages}
          onSendMessage={sendMessage}
          quickActions={LAB_QUICK_ACTIONS}
          isLoading={isLoading}
          className="h-full"
        />
      </div>
    </div>
  );
}
