'use client';

import { use, useState } from 'react';
import { ArrowLeft, Bot, ChevronDown, ChevronUp, Terminal, Code2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AiMentorSidebar } from '@/components/lab/ai-mentor-sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

const LabTerminalComponent = dynamic(
  () => import('@/components/lab/terminal').then(m => ({ default: m.LabTerminalComponent })),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-slate-400">Terminal yükleniyor...</div> }
);

const LabCodeEditor = dynamic(
  () => import('@/components/lab/code-editor').then(m => ({ default: m.LabCodeEditor })),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-slate-400">Editör yükleniyor...</div> }
);

const CRITERIA = [
  'Proje dosyasını oluştur',
  'Gerekli kütüphaneleri ekle',
  'Kodu çalıştır ve çıktıyı doğrula',
  'Docker container oluştur',
];

export default function LabPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonId: string }>;
}) {
  const { moduleSlug, lessonId } = use(params);
  const [activeTab, setActiveTab] = useState<'terminal' | 'editor'>('terminal');
  const [mentorOpen, setMentorOpen] = useState(false);
  const [completedCriteria, setCompletedCriteria] = useState<number[]>([]);
  const [showHints, setShowHints] = useState(false);

  const toggleCriteria = (idx: number) => {
    setCompletedCriteria(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 -m-4 lg:-m-6 p-4 lg:p-6">
      {/* Sol kolon */}
      <div className="w-2/5 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center gap-3">
          <Link
            href={`/learn/${moduleSlug}/lesson/${lessonId}`}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold text-white">Lab Ortamı</h1>
        </div>

        {/* Görev açıklaması */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-white mb-2">Görev</h2>
          <p className="text-sm text-slate-400">
            Bu lab ortamında Python uygulamanızı geliştirin ve Docker container içinde çalıştırın.
            Terminal ve editörü kullanarak görevleri tamamlayın.
          </p>
        </div>

        {/* Tamamlanma kriterleri */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-white mb-3">Tamamlanma Kriterleri</h2>
          <div className="flex flex-col gap-2">
            {CRITERIA.map((criterion, idx) => (
              <button
                key={idx}
                onClick={() => toggleCriteria(idx)}
                className="flex items-center gap-3 text-left text-sm"
              >
                <div className={cn(
                  'w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors',
                  completedCriteria.includes(idx)
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-600'
                )}>
                  {completedCriteria.includes(idx) && '✓'}
                </div>
                <span className={completedCriteria.includes(idx) ? 'text-slate-500 line-through' : 'text-slate-300'}>
                  {criterion}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* İpuçları */}
        <div className="border border-slate-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowHints(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-700/30 transition-colors"
          >
            <span>💡 İpuçları</span>
            {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showHints && (
            <div className="px-4 py-3 bg-yellow-500/10 border-t border-slate-700 text-sm text-yellow-200 space-y-2">
              <p>1. Önce <code className="bg-slate-700 px-1 rounded">ls</code> komutu ile dosyaları listele</p>
              <p>2. <code className="bg-slate-700 px-1 rounded">python app.py</code> ile kodu çalıştır</p>
              <p>3. Docker için <code className="bg-slate-700 px-1 rounded">docker build -t myapp .</code> kullan</p>
            </div>
          )}
        </div>

        {/* AI Mentor butonu */}
        <Button
          variant="outline"
          onClick={() => setMentorOpen(true)}
          className="gap-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
        >
          <Bot className="w-4 h-4" />
          AI Mentor&apos;a Sor
        </Button>
      </div>

      {/* Sağ kolon */}
      <div className="flex-1 flex flex-col">
        {/* Sekmeler */}
        <div className="flex gap-1 mb-3">
          <button
            onClick={() => setActiveTab('terminal')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'terminal'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            )}
          >
            <Terminal className="w-4 h-4" />
            Terminal
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'editor'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            )}
          >
            <Code2 className="w-4 h-4" />
            Editör
          </button>
        </div>

        {/* İçerik */}
        <div className="flex-1 overflow-hidden rounded-xl">
          {activeTab === 'terminal' ? <LabTerminalComponent /> : <LabCodeEditor />}
        </div>
      </div>

      {/* AI Mentor sidebar */}
      <AiMentorSidebar isOpen={mentorOpen} onClose={() => setMentorOpen(false)} />
    </div>
  );
}
