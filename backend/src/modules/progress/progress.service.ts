import * as progressRepository from "./progress.repository";

export const getSubjectProgress = async (subjectId: bigint, userId: bigint) => {
  return progressRepository.getSubjectProgress(subjectId, userId);
};

export const getVideoProgress = async (videoId: bigint, userId: bigint) => {
  const progress = await progressRepository.getVideoProgress(videoId, userId);
  return {
    last_position_seconds: progress?.last_position_seconds || 0,
    is_completed: progress?.is_completed || false,
  };
};

export const updateVideoProgress = async (
  userId: bigint,
  videoId: bigint,
  lastPosition: number,
  isCompleted: boolean
) => {
  return progressRepository.upsertVideoProgress(userId, videoId, lastPosition, isCompleted);
};
