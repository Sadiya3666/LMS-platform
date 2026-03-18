import { Video, Section } from "@prisma/client";

export interface FlatVideo extends Video {
  section_title: string;
}

export const computeGlobalOrder = (
  sections: (Section & { videos: Video[] })[]
): FlatVideo[] => {
  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
  
  const flatVideos: FlatVideo[] = [];
  
  for (const section of sortedSections) {
    const sortedVideos = [...section.videos].sort((a, b) => a.order_index - b.order_index);
    for (const video of sortedVideos) {
      flatVideos.push({
        ...video,
        section_title: section.title
      });
    }
  }
  
  return flatVideos;
};

export const getNeighborVideoIds = (
  videoId: bigint,
  globalOrder: FlatVideo[]
) => {
  const index = globalOrder.findIndex(v => v.id === videoId);
  if (index === -1) return { previous_video_id: null, next_video_id: null };
  
  return {
    previous_video_id: index > 0 ? globalOrder[index - 1].id : null,
    next_video_id: index < globalOrder.length - 1 ? globalOrder[index + 1].id : null
  };
};

export const isVideoLocked = (
  videoId: bigint,
  globalOrder: FlatVideo[],
  completedVideoIds: Set<bigint>
): boolean => {
  const index = globalOrder.findIndex(v => v.id === videoId);
  if (index === -1 || index === 0) return false;
  
  const prerequisiteId = globalOrder[index - 1].id;
  return !completedVideoIds.has(prerequisiteId);
};
