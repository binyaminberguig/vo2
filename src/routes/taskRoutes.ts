import express from 'express';
import { createTask, updateTaskStatus } from '../controllers/taskController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/projects/:projectId/tasks', createTask);
router.patch('/:id/status', updateTaskStatus);

export default router;
