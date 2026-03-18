import * as subjectRepository from "./subject.repository";
import { prisma } from "../../config/db";
import { computeGlobalOrder, isVideoLocked } from "../../utils/ordering";

export const getPublishedSubjects = async (page: number, pageSize: number, query?: string) => {
  return subjectRepository.getSubjects(page, pageSize, query);
};

export const getSubjectMetadata = async (subjectId: bigint) => {
  return subjectRepository.getSubjectById(subjectId);
};

export const getSubjectTreeWithStatus = async (subjectId: bigint, userId: bigint) => {
  const subject = await subjectRepository.getSubjectTree(subjectId);
  if (!subject) throw new Error("Subject not found");

  const progress = await prisma.videoProgress.findMany({
    where: { user_id: userId, is_completed: true },
    select: { video_id: true },
  });

  const completedVideoIds = new Set<bigint>(progress.map((p: { video_id: bigint }) => p.video_id));
  const globalOrder = computeGlobalOrder(subject.sections as any);

  const sections = subject.sections.map((section: any) => ({
    id: section.id,
    title: section.title,
    order_index: section.order_index,
    videos: section.videos.map((video: any) => ({
      id: video.id,
      title: video.title,
      order_index: video.order_index,
      duration_seconds: video.duration_seconds,
      is_completed: completedVideoIds.has(video.id),
      locked: isVideoLocked(video.id, globalOrder, completedVideoIds),
    })),
  }));

  return {
    id: subject.id,
    title: subject.title,
    sections,
  };
};

export const getFirstUnlockedVideo = async (subjectId: bigint, userId: bigint) => {
  const subject = await subjectRepository.getSubjectTree(subjectId);
  if (!subject) throw new Error("Subject not found");

  const progress = await prisma.videoProgress.findMany({
    where: { user_id: userId, is_completed: true },
    select: { video_id: true },
  });

  const completedVideoIds = new Set<bigint>(progress.map((p: { video_id: bigint }) => p.video_id));
  const globalOrder = computeGlobalOrder(subject.sections as any);

  for (const video of globalOrder) {
    if (!isVideoLocked(video.id, globalOrder, completedVideoIds)) {
      if (!completedVideoIds.has(video.id)) {
        return video.id;
      }
    }
  }

  return globalOrder[0]?.id || null;
};
