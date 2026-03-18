import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db";
import { authMiddleware } from "../../middleware/authMiddleware";

export const getMyCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    // Get all enrollments for user
    const enrollments = await prisma.enrollment.findMany({
      where: { user_id: userId },
      include: {
        subject: {
          include: {
            sections: {
              include: {
                videos: {
                  select: { id: true, duration_seconds: true }
                }
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // We also need user's video progress to calculate percentage
    const videoProgress = await prisma.videoProgress.findMany({
      where: { user_id: userId },
      select: { video_id: true, is_completed: true }
    });

    const completedVideoMap: Record<string, boolean> = {};
    for (const vp of videoProgress) {
        if(vp.is_completed) completedVideoMap[vp.video_id.toString()] = true;
    }

    const result = enrollments.map(en => {
        const subject = en.subject;
        let totalVideos = 0;
        let completedVideos = 0;

        for (const section of subject.sections) {
            for (const video of section.videos) {
                totalVideos++;
                if (completedVideoMap[video.id.toString()]) {
                    completedVideos++;
                }
            }
        }

        const progressPercent = totalVideos === 0 ? 0 : Math.round((completedVideos / totalVideos) * 100);

        return {
            id: subject.id.toString(),
            title: subject.title,
            slug: subject.slug,
            thumbnail_url: subject.thumbnail_url,
            progress: progressPercent,
            completed_videos: completedVideos,
            total_videos: totalVideos,
            enrolled_at: en.created_at
        };
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const router = Router();
router.use(authMiddleware);
router.get("/my-courses", getMyCourses);

export default router;
