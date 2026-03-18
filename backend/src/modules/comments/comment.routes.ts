import { Router } from 'express';
import { getComments, createComment } from './comment.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.get('/:videoId', getComments);
router.post('/', authMiddleware, createComment);

export default router;
