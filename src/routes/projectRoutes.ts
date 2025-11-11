import express from 'express';
import { createProject, getProjectById } from './../controllers/projectController';
import { protect } from './../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/', createProject);
router.get('/:id', getProjectById);

export default router;
