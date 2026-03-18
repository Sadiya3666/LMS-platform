import { Request, Response } from 'express';
import { prisma } from '../../config/db';

export const getQuizzes = async (req: Request, res: Response) => {
  const { subjectId } = req.params;

  try {
    const quizzes = await prisma.quiz.findMany({
      where: { subject_id: BigInt(subjectId as string) },
      include: { questions: true }
    });

    const serialized = quizzes.map(q => ({
      ...q,
      id: q.id.toString(),
      subject_id: q.subject_id.toString(),
      questions: q.questions.map(question => ({
        ...question,
        id: question.id.toString(),
        quiz_id: question.quiz_id.toString()
      }))
    }));

    res.json(serialized);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  const { quizId, answers } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: BigInt(quizId as string) },
      include: { questions: true }
    });

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_idx) {
        score++;
      }
    });

    const result = await prisma.quizResult.create({
      data: {
        user_id: userId,
        quiz_id: BigInt(quizId as string),
        score,
        answers: answers
      }
    });

    res.status(201).json({
      ...result,
      id: result.id.toString(),
      user_id: result.user_id.toString(),
      quiz_id: result.quiz_id.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
};
