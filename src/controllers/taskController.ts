import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task';
import Project from '../models/Project';
import { AuthRequest } from '../middlewares/authMiddleware';

// ➕ Créer une tâche pour un projet donné
export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await Project.findOne({ _id: projectId, owner: req.user?._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo: assignedTo || req.user?._id,
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    next(error);
  }
};

// 📄 Récupérer toutes les tâches d’un projet
export const getTasksByProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({ _id: projectId, owner: req.user?._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// ✏️ Mettre à jour le statut d’une tâche
export const updateTaskStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['todo', 'in_progress', 'done'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const task = await Task.findById(id).populate('project');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.assignedTo?.toString() !== req.user?._id.toString())
      return res.status(403).json({ message: 'Unauthorized' });

    task.status = status;
    await task.save();

    res.json({ message: 'Task status updated', task });
  } catch (error) {
    next(error);
  }
};

// ❌ Supprimer une tâche
export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate('project');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.assignedTo?.toString() !== req.user?._id.toString())
      return res.status(403).json({ message: 'Unauthorized' });

    await task.deleteOne();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
