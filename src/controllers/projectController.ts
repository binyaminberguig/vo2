import { Response, NextFunction } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middlewares/authMiddleware';
import mongoose from 'mongoose';

// ➕ Créer un projet
export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user?._id,
    });

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    next(error);
  }
};

// 📄 Récupérer tous les projets de l'utilisateur
export const getUserProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.find({ owner: req.user?._id });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// 🧩 Récupérer un projet par ID
export const getProjectById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid project ID' });

    const project = await Project.findOne({ _id: id, owner: req.user?._id });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// ✏️ Mettre à jour un projet
export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndUpdate(
      { _id: id, owner: req.user?._id },
      req.body,
      { new: true }
    );

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json({ message: 'Project updated', project });
  } catch (error) {
    next(error);
  }
};

// ❌ Supprimer un projet
export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({ _id: id, owner: req.user?._id });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
