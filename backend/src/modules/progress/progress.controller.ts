import { Request, Response, NextFunction } from "express";
import * as progressService from "./progress.service";

export const getSubjectProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subjectId = BigInt(req.params.subjectId as string);
    const userId = req.user!.id;
    const progress = await progressService.getSubjectProgress(subjectId, userId);
    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};

export const getVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const videoId = BigInt(req.params.videoId as string);
    const userId = req.user!.id;
    const progress = await progressService.getVideoProgress(videoId, userId);
    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const videoId = BigInt(req.params.videoId as string);
    const userId = req.user!.id;
    const { last_position_seconds, is_completed } = req.body;
    
    const progress = await progressService.updateVideoProgress(
      userId,
      videoId,
      last_position_seconds,
      is_completed
    );
    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};
