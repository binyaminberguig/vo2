import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task';
import Project from '../models/Project';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const project = await Project.findOne({ _id: projectId, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title,
      description,
      projectId: projectId,
      assignedTo: assignedTo || req.user._id,
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['todo', 'in_progress', 'done'];

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!validStatuses.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const task = await Task.findById(id).populate('project');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    await task.save();

    res.json({ message: 'Task status updated', task });
  } catch (error) {
    next(error);
  }
};
