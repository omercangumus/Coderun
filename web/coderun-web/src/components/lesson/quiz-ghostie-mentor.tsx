'use client';

import { useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles, MessageCircle, Lightbulb, PenLine } from 'lucide-react';

import { useMentor } from '@/lib/hooks/use-mentor';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';
import { Button } from '@/components/ui/button';
import type { QuestionResponse } from '@/lib/types/module.types';
import type { GhostieState } from '@/lib/ghostie-assets';

interface Props {
  moduleSlug: string;
  lessonTitle: string;
  question: QuestionResponse;
  ghostieState?: GhostieState;
  onSuggestionFill?: (value: string) => void;
}

function attemptLabel(count: number): string {
  if (count <= 1) return 'İpucu modu';
  if (count === 2) return 'Açık ipucu';
  if (count === 3) return 'Örnek modu';
  return 'Öneri modu';
}

export function QuizGhostieMentor({
  moduleSlug,
  lessonTitle,
  question,
  ghostieState = 'idle',
  onSuggestionFill,
}: Props) {
  const {
    messages,
    isLoading,
    attemptCount,
    lastSuggestion,
    sendMessage,
    clearChat,
  } = useMentor({
    context: 'lesson',
    moduleSlug,
    lessonTitle,
    questionText: question.questionText,
    questionType: question.questionType,
    codeBlock: question.codeBlock,
    initialGreeting:
      'Merhaba! Ben Ghostie 👻 Bu soruda takılırsan bana yaz — önce konuyu tartışırız, cevabı hemen vermem. İstersen alttaki hızlı butonları da kullan!',
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const value = inputRef.current?.value.trim();
    if (!value || isLoading) return;
    if (inputRef.current) inputRef.current.value = '';
    await sendMessage(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const quickPrompts =
    question.questionType === 'code_completion'
      ? [
          { label: 'Soruyu açıkla', message: 'Bu kod tamamlama sorusunu bana adım adım açıklar mısın?' },
          { label: 'Nasıl düşünmeliyim?', message: 'Bu boşluğu doldurmak için hangi kavramlara bakmalıyım?' },
          { label: 'Boşluk ipucu', message: '___ işaretli yere ne tür bir ifade gelmeli? Doğrudan cevabı verme.' },
          { label: 'Mini örnek ver', message: 'Benzer ama farklı küçük bir kod örneği gösterir misin?' },
        ]
      : [
          { label: 'Soruyu açıkla', message: 'Bu soruyu daha sade bir dille açıklar mısın?' },
          { label: 'Nasıl düşünmeliyim?', message: 'Bu soruyu çözmek için hangi adımları izlemeliyim?' },
          { label: 'Kavram hatırlat', message: 'Bu soru hangi Python kavramını ölçüyor? Kısaca hatırlat.' },
          { label: 'Yanlışları ele', message: 'Hangi seçenekler mantıken elenebilir? Doğru şıkkı söyleme.' },
        ];

  const reactionState: GhostieState = isLoading ? 'thinking' : ghostieState;
  const canFillSuggestion =
    question.questionType === 'code_completion' &&
    lastSuggestion &&
    onSuggestionFill &&
    attemptCount >= 4;

  return (
    <div className="flex flex-col h-full min-h-[420px] rounded-2xl border border-outline-variant bg-gradient-to-b from-primary/5 to-surface-container-lowest overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-outline-variant/60 bg-surface-container-low/80">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">
            Ghostie AI Mentor
          </p>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-tertiary bg-tertiary-container/40 px-2 py-0.5 rounded-full font-semibold">
              {attemptLabel(attemptCount)}
            </span>
            <button
              type="button"
              onClick={clearChat}
              title="Sohbeti sıfırla"
              className="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <GhostieReaction state={reactionState} size={72} preferAnimation />
        </div>
      </div>

      {/* Mesajlar */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[92%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-surface-container text-on-surface rounded-bl-sm border border-outline/10'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-container rounded-xl px-3 py-2 text-xs text-on-surface-variant italic border border-outline/10">
              Ghostie düşünüyor...
            </div>
          </div>
        )}

        {canFillSuggestion && (
          <div className="pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1.5 border-primary/40 text-primary"
              onClick={() => onSuggestionFill?.(lastSuggestion!)}
            >
              <PenLine className="w-3.5 h-3.5" />
              Öneriyi kutuya yaz: &quot;{lastSuggestion}&quot;
            </Button>
            <p className="text-[10px] text-on-surface-variant mt-1 text-center">
              Önce tartıştık — istersen öneriyi kutuya aktarabilirsin.
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Hızlı chip'ler */}
      <div className="px-3 pb-2 flex flex-wrap gap-1.5">
        {quickPrompts.map((chip) => (
          <button
            key={chip.label}
            type="button"
            disabled={isLoading}
            onClick={() => void sendMessage(chip.message)}
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50"
          >
            {chip.label === 'Soruyu açıkla' && <MessageCircle className="w-3 h-3" />}
            {chip.label === 'Nasıl düşünmeliyim?' && <Lightbulb className="w-3 h-3" />}
            {chip.label.includes('örnek') && <Sparkles className="w-3 h-3" />}
            {chip.label}
          </button>
        ))}
      </div>

      {/* Giriş */}
      <div className="p-3 border-t border-outline-variant/60 bg-surface-container-low/50">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            rows={2}
            onKeyDown={handleKeyDown}
            placeholder="Ghostie'ye sor..."
            disabled={isLoading}
            className="flex-1 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:border-primary disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={isLoading}
            className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors shrink-0"
            aria-label="Gönder"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
