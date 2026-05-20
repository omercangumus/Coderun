'use client';

import { CheckCircle, BookOpen, Code2, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LearningCardProps {
  /** Kavram başlığı */
  title: string;
  /** Açıklama metni (Markdown formatında olabilir, düz metin olarak gösterilir) */
  body: string;
  /** Opsiyonel kod parçası */
  codeSnippet?: string;
  /** Kart tipi — görsel stil değişir */
  type?: 'concept' | 'tip' | 'code';
  /** Devam et butonu tıklandığında */
  onContinue: () => void;
}

const TYPE_CONFIG = {
  concept: {
    icon: BookOpen,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    badge: 'Kavram',
    badgeBg: 'bg-primary/15 text-primary',
  },
  tip: {
    icon: Lightbulb,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    badge: 'İpucu',
    badgeBg: 'bg-amber-500/15 text-amber-600',
  },
  code: {
    icon: Code2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    badge: 'Kod',
    badgeBg: 'bg-emerald-500/15 text-emerald-600',
  },
};

export function LearningCard({ title, body, codeSnippet, type = 'concept', onContinue }: LearningCardProps) {
  const cfg = TYPE_CONFIG[type];
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cfg.bg)}>
          <Icon className={cn('w-5 h-5', cfg.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <span className={cn('inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2', cfg.badgeBg)}>
            {cfg.badge}
          </span>
          <h2 className="text-xl font-bold text-on-surface leading-snug">{title}</h2>
        </div>
      </div>

      {/* Separator */}
      <div className={cn('h-px', cfg.border.replace('border', 'bg'))} />

      {/* Body text */}
      <p className="text-base text-on-surface-variant leading-relaxed whitespace-pre-line">{body}</p>

      {/* Code snippet */}
      {codeSnippet && (
        <div className="rounded-xl bg-[#1E1E2E] border border-outline-variant overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-white/40 font-mono">python</span>
          </div>
          <pre className="p-4 text-sm text-green-300 font-mono overflow-x-auto leading-relaxed">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-white font-bold text-base shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
      >
        <CheckCircle className="w-5 h-5" />
        Anladım, Devam Et
      </button>
    </div>
  );
}
