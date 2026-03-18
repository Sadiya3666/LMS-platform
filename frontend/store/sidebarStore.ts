import { create } from "zustand";
import apiClient from "../lib/apiClient";

interface Video {
  id: string;
  title: string;
  order_index: number;
  duration_seconds: number;
  is_completed: boolean;
  locked: boolean;
}

interface Section {
  id: string;
  title: string;
  order_index: number;
  videos: Video[];
}

interface TreeData {
  id: string;
  title: string;
  sections: Section[];
}

interface SidebarState {
  tree: TreeData | null;
  loading: boolean;
  error: string | null;
  fetchTree: (subjectId: string) => Promise<void>;
  markVideoCompleted: (videoId: string) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  tree: null,
  loading: false,
  error: null,

  fetchTree: async (subjectId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/subjects/${subjectId}/tree`);
      set({ tree: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  markVideoCompleted: (videoId) => {
    const tree = get().tree;
    if (!tree) return;

    const newSections = tree.sections.map((section) => ({
      ...section,
      videos: section.videos.map((video) => {
        if (video.id === videoId) {
          return { ...video, is_completed: true };
        }
        return video;
      }),
    }));

    // Re-calculate locked state for next videos if needed
    // In a real app, we'd probably re-fetch or use complex client logic
    // For now, let's just mark it completed and maybe re-fetch tree soon
    set({ tree: { ...tree, sections: newSections } });
  },
}));
