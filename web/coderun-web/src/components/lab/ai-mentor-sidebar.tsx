'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import axiosClient from '@/lib/api/axios-client';
import { AI_ENDPOINTS } from '@/lib/constants/api.constants';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lessonContext?: string;
}

export function AiMentorSidebar({ isOpen, onClose, lessonContext }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Merhaba! Lab görevinde takıldığın bir yer var mı? Sana yardımcı olmaya hazırım. 👻' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await axiosClient.post(AI_ENDPOINTS.mentor, {
        message: userMsg,
        lesson_context: lessonContext ?? null,
      });
      const reply = (response.data as { reply: string }).reply;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Şu an yanıt veremiyorum. Lütfen biraz sonra tekrar dene.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 flex flex-col z-50">
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-gray-800">AI Mentor</span>
          <span className="text-xs text-gray-500">(Phantom)</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-gray-500">
              Düşünüyor...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Soru sor..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
