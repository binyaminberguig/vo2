import express from 'express';
import { createComment } from '../controllers/commentController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/tasks/:id/comments', createComment);

export default router;
