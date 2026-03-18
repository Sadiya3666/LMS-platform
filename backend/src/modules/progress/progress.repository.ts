import { prisma } from "../../config/db";

export const getSubjectProgress = async (subjectId: bigint, userId: bigint) => {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      sections: {
        include: {
          videos: true,
        },
      },
    },
  });

  if (!subject) return null;

  const allVideos = subject.sections.flatMap((s: any) => s.videos);
  const totalVideos = allVideos.length;
  const allVideoIds = allVideos.map((v: any) => v.id);

  const completedProgress = await prisma.videoProgress.findMany({
    where: {
      user_id: userId,
      video_id: { in: allVideoIds },
      is_completed: true,
    },
  });

  const lastProgress = await prisma.videoProgress.findFirst({
    where: {
      user_id: userId,
      video_id: { in: allVideoIds },
    },
    orderBy: { updated_at: "desc" },
  });

  return {
    total_videos: totalVideos,
    completed_videos: completedProgress.length,
    percent_complete: totalVideos > 0 ? (completedProgress.length / totalVideos) * 100 : 0,
    last_video_id: lastProgress?.video_id || null,
    last_position_seconds: lastProgress?.last_position_seconds || 0,
  };
};

export const getVideoProgress = async (videoId: bigint, userId: bigint) => {
  return prisma.videoProgress.findUnique({
    where: {
      user_id_video_id: {
        user_id: userId,
        video_id: videoId,
      },
    },
  });
};

export const upsertVideoProgress = async (
  userId: bigint,
  videoId: bigint,
  lastPosition: number,
  isCompleted: boolean
) => {
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (!video) throw new Error("Video not found");

  const cappedPosition = Math.max(0, Math.min(lastPosition, video.duration_seconds || 86400));

  return prisma.videoProgress.upsert({
    where: {
      user_id_video_id: {
        user_id: userId,
        video_id: videoId,
      },
    },
    update: {
      last_position_seconds: cappedPosition,
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date() : undefined,
    },
    create: {
      user_id: userId,
      video_id: videoId,
      last_position_seconds: cappedPosition,
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date() : null,
    },
  });
};
