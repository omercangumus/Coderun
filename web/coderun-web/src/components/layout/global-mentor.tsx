'use client';

import { AiMentorSidebar } from '@/components/lab/ai-mentor-sidebar';
import { useMentorStore } from '@/store/mentor-store';

export function GlobalMentor() {
  const { isOpen, closeMentor } = useMentorStore();

  return (
    <AiMentorSidebar
      isOpen={isOpen}
      onClose={closeMentor}
      lessonContext="Genel sohbet"
      moduleSlug="python"
      lessonTitle="Genel Yardım"
    />
  );
}
