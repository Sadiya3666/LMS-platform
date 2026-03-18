import { create } from "zustand";

interface VideoState {
  currentVideoId: string | null;
  subjectId: string | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isCompleted: boolean;
  nextVideoId: string | null;
  prevVideoId: string | null;
  setVideo: (data: Partial<VideoState>) => void;
  updateTime: (time: number) => void;
  markCompleted: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideoId: null,
  subjectId: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isCompleted: false,
  nextVideoId: null,
  prevVideoId: null,

  setVideo: (data) => set((state) => ({ ...state, ...data })),
  updateTime: (currentTime) => set({ currentTime }),
  markCompleted: () => set({ isCompleted: true }),
}));
