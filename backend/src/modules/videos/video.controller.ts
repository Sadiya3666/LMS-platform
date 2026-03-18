import { Request, Response, NextFunction } from "express";
import * as videoService from "./video.service";

export const getVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const videoId = BigInt(req.params.videoId as string);
    const userId = req.user!.id;
    const details = await videoService.getVideoDetails(videoId, userId);
    res.status(200).json(details);
  } catch (error: any) {
    if (error.message === "Video not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
