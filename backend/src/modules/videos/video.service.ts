import * as videoRepository from "./video.repository";
import { prisma } from "../../config/db";
import { computeGlobalOrder, getNeighborVideoIds, isVideoLocked } from "../../utils/ordering";

export const getVideoDetails = async (videoId: bigint, userId: bigint) => {
  const video = await videoRepository.getVideoWithContext(videoId);
  if (!video) throw new Error("Video not found");

  const subject = video.section.subject;
  const globalOrder = computeGlobalOrder(subject.sections as any);
  
  const progress = await prisma.videoProgress.findMany({
    where: { user_id: userId, is_completed: true },
    select: { video_id: true },
  });
  const completedVideoIds = new Set<bigint>(progress.map((p: { video_id: bigint }) => p.video_id));

  const locked = isVideoLocked(videoId, globalOrder, completedVideoIds);
  const { previous_video_id, next_video_id } = getNeighborVideoIds(videoId, globalOrder);

  return {
    id: video.id,
    title: video.title,
    description: video.description,
    youtube_url: video.youtube_url,
    order_index: video.order_index,
    duration_seconds: video.duration_seconds,
    section_id: video.section_id,
    section_title: video.section.title,
    subject_id: subject.id,
    subject_title: subject.title,
    previous_video_id,
    next_video_id,
    locked,
    unlock_reason: locked ? "Complete previous video to unlock" : null,
  };
};
