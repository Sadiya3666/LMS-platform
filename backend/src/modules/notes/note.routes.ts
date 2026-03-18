import { Router } from 'express';
import { getNotes, createNote, deleteNote } from './note.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/:videoId', getNotes);
router.post('/', createNote);
router.delete('/:id', deleteNote);

export default router;
