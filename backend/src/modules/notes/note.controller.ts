import { Request, Response } from 'express';
import { prisma } from '../../config/db';

export const getNotes = async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const notes = await prisma.note.findMany({
      where: {
        video_id: BigInt(videoId as string),
        user_id: userId
      },
      orderBy: { timestamp: 'asc' }
    });

    const serialized = notes.map(n => ({
      ...n,
      id: n.id.toString(),
      user_id: n.user_id.toString(),
      video_id: n.video_id.toString()
    }));

    res.json(serialized);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

export const createNote = async (req: Request, res: Response) => {
  const { videoId, content, timestamp } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const note = await prisma.note.create({
      data: {
        user_id: userId,
        video_id: BigInt(videoId as string),
        content,
        timestamp: timestamp || 0
      }
    });

    res.status(201).json({
      ...note,
      id: note.id.toString(),
      user_id: note.user_id.toString(),
      video_id: note.video_id.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note' });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const note = await prisma.note.findUnique({ where: { id: BigInt(id as string) } });
    if (!note || note.user_id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.note.delete({ where: { id: BigInt(id as string) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
};
