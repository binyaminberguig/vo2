import { Response, NextFunction } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middlewares/authMiddleware';
import Task from './../models/Task';
import Comment from './../models/Comment';

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
    });

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // 1️⃣ Récupère le projet
    const project = await Project.findById(id)
      .populate('owner', 'name email')
      .lean(); // lean pour renvoyer un objet simple (et rapide)

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 2️⃣ Récupère toutes les tâches liées à ce projet
    const tasks = await Task.find({ projectId: id })
      .populate('assignedTo', 'name email')
      .lean();

    // 3️⃣ Pour chaque tâche, récupère ses commentaires
    const taskIds = tasks.map(t => t._id);
    const comments = await Comment.find({ task: { $in: taskIds } })
      .populate('author', 'name email')
      .lean();

    // 4️⃣ Attache les commentaires à leurs tâches
    const tasksWithComments = tasks.map(task => ({
      ...task,
      comments: comments.filter(c => c.task.toString() === task._id.toString()),
    }));

    // 5️⃣ Structure finale
    const projectWithTasks = {
      ...project,
      tasks: tasksWithComments,
    };

    return res.status(200).json(projectWithTasks);
  } catch (error) {
    next(error);
  }
};
