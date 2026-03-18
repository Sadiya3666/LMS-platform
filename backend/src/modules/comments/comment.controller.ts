import { Request, Response } from 'express';
import { prisma } from '../../config/db';

export const getComments = async (req: Request, res: Response) => {
  const { videoId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { video_id: BigInt(videoId as string), parent_id: null },
      include: {
        user: { select: { name: true } },
        replies: {
          include: { user: { select: { name: true } } }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const serializeComment = (c: any) => ({
      ...c,
      id: c.id.toString(),
      user_id: c.user_id.toString(),
      video_id: c.video_id.toString(),
      parent_id: c.parent_id?.toString(),
      replies: c.replies?.map(serializeComment)
    });

    res.json(comments.map(serializeComment));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

export const createComment = async (req: Request, res: Response) => {
  const { videoId, content, parentId } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const comment = await prisma.comment.create({
      data: {
        user_id: userId,
        video_id: BigInt(videoId as string),
        content,
        parent_id: parentId ? BigInt(parentId as string) : null
      },
      include: { user: { select: { name: true } } }
    });

    res.status(201).json({
      ...comment,
      id: comment.id.toString(),
      user_id: comment.user_id.toString(),
      video_id: comment.video_id.toString(),
      parent_id: comment.parent_id?.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create comment' });
  }
};
