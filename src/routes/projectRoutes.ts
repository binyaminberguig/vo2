import express from 'express';
import {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from './../controllers/projectController';
import { protect } from './../middlewares/authMiddleware';

const router = express.Router();

// Toutes les routes sont protégées
router.use(protect);

router.post('/', createProject);
router.get('/', getUserProjects);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
