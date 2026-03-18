import { Request, Response, NextFunction } from "express";
import * as subjectService from "./subject.service";
import { prisma } from "../../config/db";

export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 12;
    const q = req.query.q as string || "";
    const category = req.query.category as string || "";
    const skip = (page - 1) * pageSize;

    const where: any = {
      is_published: true,
      ...(q && {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } }
        ]
      })
    };
    if (category && category !== 'All') {
        where.category = category;
    }

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" }
      }),
      prisma.subject.count({ where })
    ]);

    return res.json({
      subjects,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    console.error("getSubjects error:", error);
    next(error);
  }
};

export const getSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.subjectId as string);
    const subject = await subjectService.getSubjectMetadata(id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json(subject);
  } catch (error) {
    next(error);
  }
};

export const getTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subjectId = BigInt(req.params.subjectId as string);
    const userId = req.user!.id;
    const tree = await subjectService.getSubjectTreeWithStatus(subjectId, userId);
    res.status(200).json(tree);
  } catch (error) {
    next(error);
  }
};

export const getFirstVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subjectId = BigInt(req.params.subjectId as string);
    const userId = req.user!.id;
    const videoId = await subjectService.getFirstUnlockedVideo(subjectId, userId);
    res.status(200).json({ video_id: videoId });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.subject.findMany({
      where: { is_published: true, category: { not: null } },
      select: { category: true },
      distinct: ['category']
    });
    res.json(categories.map(c => c.category));
  } catch (error) {
    next(error);
  }
};
