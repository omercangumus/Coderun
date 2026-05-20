import { create } from 'zustand';

interface MentorStore {
  isOpen: boolean;
  openMentor: () => void;
  closeMentor: () => void;
  toggleMentor: () => void;
}

export const useMentorStore = create<MentorStore>((set) => ({
  isOpen: false,
  openMentor: () => set({ isOpen: true }),
  closeMentor: () => set({ isOpen: false }),
  toggleMentor: () => set((state) => ({ isOpen: !state.isOpen })),
}));
