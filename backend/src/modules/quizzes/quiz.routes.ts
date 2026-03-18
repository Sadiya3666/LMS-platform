import { Router } from 'express';
import { getQuizzes, submitQuiz } from './quiz.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/subject/:subjectId', getQuizzes);
router.post('/submit', submitQuiz);

export default router;
