import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db";
import { authMiddleware } from "../../middleware/authMiddleware";

export const getCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { subjectId } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        user_id_subject_id: {
          user_id: userId,
          subject_id: BigInt(subjectId as string)
        }
      },
      include: {
        subject: {
          include: {
            sections: {
                include: { videos: true }
            }
          }
        },
        user: true
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: "You are not enrolled in this course." });
    }

    const videoProgress = await prisma.videoProgress.findMany({
      where: { user_id: userId },
      select: { video_id: true, is_completed: true, updated_at: true }
    });

    const completionMap: Record<string, any> = {};
    for (const vp of videoProgress) {
        if(vp.is_completed) completionMap[vp.video_id.toString()] = vp;
    }

    let totalVideos = 0;
    let completedVideos = 0;
    let lastActivity: Date | null = null;

    for (const section of enrollment.subject.sections) {
        for (const video of section.videos) {
            totalVideos++;
            if (completionMap[video.id.toString()]) {
                completedVideos++;
                const actDate = completionMap[video.id.toString()].updated_at;
                if(!lastActivity || actDate > lastActivity) {
                    lastActivity = actDate;
                }
            }
        }
    }

    if (totalVideos === 0 || completedVideos < totalVideos) {
        return res.status(400).json({ 
            message: "Course not 100% completed.", 
            completed: completedVideos, 
            total: totalVideos 
        });
    }

    // Generate response
    const certHash = Buffer.from(`${userId}-${subjectId}-${lastActivity?.getTime()}`).toString('base64');
    
    return res.json({
        studentName: enrollment.user.name,
        courseName: enrollment.subject.title,
        completionDate: lastActivity?.toISOString() || new Date().toISOString(),
        certificateId: certHash,
        instructorName: enrollment.subject.instructor_name || "EduFlow Instructor"
    });

  } catch (error) {
    next(error);
  }
};

const router = Router();
router.use(authMiddleware);
router.get("/:subjectId", getCertificate);

export default router;
