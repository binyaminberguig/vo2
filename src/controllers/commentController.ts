import { Response, NextFunction } from 'express';
import Comment from '../models/Comment';
import Task from '../models/Task';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const comment = await Comment.create({
      text,
      author: req.user._id,
      task: id,
    });

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    next(error);
  }
};
