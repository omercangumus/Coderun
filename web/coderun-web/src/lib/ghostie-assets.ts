export type GhostieState =
  | 'idle'
  | 'thinking'
  | 'hint'
  | 'wrong'
  | 'reinforcement'
  | 'angry'
  | 'correct'
  | 'success'
  | 'well_done'
  | 'celebrating'
  | 'lesson_complete'
  | 'level_up'
  | 'very_happy';

export const ghostieImageByState: Record<GhostieState, string> = {
  idle: '/images/ghostie/ghostie_idle.png',
  thinking: '/images/ghostie/ghostie_idle.png',
  hint: '/images/ghostie/ghostie_idle.png',
  wrong: '/images/ghostie/ghostie_sad_wrong.png',
  reinforcement: '/images/ghostie/ghostie_sad_wrong.png',
  angry: '/images/ghostie/ghostie_angry.png',
  correct: '/images/ghostie/ghostie_success_coder.png',
  success: '/images/ghostie/ghostie_success_coder.png',
  well_done: '/images/ghostie/ghostie_success_coder.png',
  celebrating: '/images/ghostie/ghostie_very_happy.png',
  lesson_complete: '/images/ghostie/ghostie_very_happy.png',
  level_up: '/images/ghostie/ghostie_very_happy.png',
  very_happy: '/images/ghostie/ghostie_very_happy.png',
};

export const ghostieAnimationByState: Record<GhostieState, string> = {
  idle: '/animations/ghostie/ghostie_idle.mp4',
  thinking: '/animations/ghostie/ghostie_idle.mp4',
  hint: '/animations/ghostie/ghostie_idle.mp4',
  wrong: '/animations/ghostie/ghostie_sad_wrong.mp4',
  reinforcement: '/animations/ghostie/ghostie_sad_wrong.mp4',
  angry: '/animations/ghostie/ghostie_angry.mp4',
  correct: '/animations/ghostie/ghostie_success_coder.mp4',
  success: '/animations/ghostie/ghostie_success_coder.mp4',
  well_done: '/animations/ghostie/ghostie_success_coder.mp4',
  celebrating: '/animations/ghostie/ghostie_very_happy.mp4',
  lesson_complete: '/animations/ghostie/ghostie_very_happy.mp4',
  level_up: '/animations/ghostie/ghostie_very_happy.mp4',
  very_happy: '/animations/ghostie/ghostie_very_happy.mp4',
};
