// Coderun Stitch Design System — Learning Path Node

import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type NodeState = 'completed' | 'active' | 'locked' | 'review' | 'checkpoint' | 'miniProject';
export type NodeType = 'lesson' | 'quiz' | 'review' | 'checkpoint' | 'miniProject';

interface ProgressNodeProps {
  state: NodeState;
  type?: NodeType;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  side?: 'left' | 'right' | 'center';
  className?: string;
}

const stateConfig: Record<NodeState, { bg: string; border: string; icon: string; glow?: string }> = {
  completed: {
    bg: 'bg-node-completed',
    border: 'border-secondary-fixed-dim',
    icon: '✓',
    glow: 'shadow-success',
  },
  active: {
    bg: 'bg-node-active',
    border: 'border-primary/30',
    icon: '▶',
    glow: 'shadow-primary animate-pulse-glow',
  },
  locked: {
    bg: 'bg-node-locked',
    border: 'border-outline-variant',
    icon: '🔒',
  },
  review: {
    bg: 'bg-node-review',
    border: 'border-amber-300',
    icon: '↺',
  },
  checkpoint: {
    bg: 'bg-node-checkpoint',
    border: 'border-yellow-400',
    icon: '⚑',
  },
  miniProject: {
    bg: 'bg-node-project',
    border: 'border-tertiary/30',
    icon: '{ }',
  },
};

const typeIcon: Record<NodeType, string> = {
  lesson: '📖',
  quiz: '❓',
  review: '↺',
  checkpoint: '⚑',
  miniProject: '{ }',
};

export function ProgressNode({
  state,
  type = 'lesson',
  label,
  sublabel,
  onClick,
  side = 'center',
  className,
}: ProgressNodeProps) {
  const config = stateConfig[state];
  const isActive = state === 'active';
  const isLocked = state === 'locked';
  const isLarge = state === 'checkpoint' || state === 'miniProject';

  const nodeSize = isLarge ? 'w-16 h-16 text-xl' : isActive ? 'w-14 h-14 text-lg' : 'w-12 h-12 text-base';

  const node = (
    <button
      type="button"
      disabled={isLocked}
      onClick={!isLocked ? onClick : undefined}
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white',
        'border-4 transition-all duration-200',
        nodeSize,
        config.bg,
        config.border,
        config.glow,
        isActive && 'scale-110',
        !isLocked && 'hover:scale-105 active:scale-95 cursor-pointer',
        isLocked && 'cursor-not-allowed opacity-70',
        className
      )}
      aria-label={`${label} — ${state}`}
    >
      <span className={cn(isLocked ? 'text-outline-variant' : 'text-white')}>
        {isLocked ? <Lock className="w-4.5 h-4.5 stroke-[2.5px]" /> : config.icon}
      </span>
    </button>
  );

  const labelEl = (
    <div className={cn('max-w-[90px]', side === 'right' ? 'text-left' : 'text-right')}>
      <p
        className={cn(
          'font-sans text-xs leading-tight',
          isActive ? 'font-semibold text-primary' : 'font-normal text-on-surface-variant',
          isLocked && 'opacity-50'
        )}
      >
        {label}
      </p>
      {sublabel && (
        <p className="font-label text-[10px] text-on-surface-variant/60 mt-0.5">{sublabel}</p>
      )}
    </div>
  );

  if (side === 'center') {
    return (
      <div className="flex flex-col items-center gap-1">
        {node}
        <p className={cn(
          'font-sans text-xs text-center max-w-[80px] leading-tight',
          isActive ? 'font-semibold text-primary' : 'text-on-surface-variant',
          isLocked && 'opacity-50'
        )}>
          {label}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', side === 'right' ? 'flex-row-reverse' : 'flex-row')}>
      {labelEl}
      {node}
    </div>
  );
}

// Connector line between nodes
interface NodeConnectorProps {
  isCompleted?: boolean;
  height?: number;
  curved?: boolean;
}

export function NodeConnector({ isCompleted = false, height = 40 }: NodeConnectorProps) {
  return (
    <div className="flex justify-center">
      <div
        className={cn(
          'w-1 rounded-full transition-colors duration-300',
          isCompleted ? 'bg-node-completed' : 'bg-outline-variant'
        )}
        style={{ height: `${height}px` }}
      />
    </div>
  );
}

// Unit header — shown above a group of nodes
interface UnitHeaderProps {
  title: string;
  subtitle?: string;
  progress: number; // 0-100
  lessonCount: number;
  completedCount: number;
}

export function UnitHeader({ title, subtitle, progress, lessonCount, completedCount }: UnitHeaderProps) {
  return (
    <div className="cr-card p-4 bg-gradient-to-r from-primary-fixed to-surface-container-lowest border-primary/20 mb-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-label text-label-sm text-primary uppercase tracking-wide mb-0.5">
            Ünite
          </p>
          <h3 className="font-heading text-h4 font-bold text-on-surface">{title}</h3>
          {subtitle && (
            <p className="font-sans text-body-sm text-on-surface-variant mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-heading text-h3 font-bold text-primary">{progress}%</p>
          <p className="font-sans text-body-sm text-on-surface-variant">
            {completedCount}/{lessonCount}
          </p>
        </div>
      </div>
      <div className="cr-progress-bar">
        <div className="cr-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
