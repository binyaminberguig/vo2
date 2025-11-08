import express from 'express';
import {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  deleteTask,
} from '../controllers/taskController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

// Créer une tâche pour un projet
router.post('/project/:projectId', createTask);

// Récupérer toutes les tâches d’un projet
router.get('/project/:projectId', getTasksByProject);

// Mettre à jour le statut d’une tâche
router.patch('/:id/status', updateTaskStatus);

// Supprimer une tâche
router.delete('/:id', deleteTask);

export default router;
