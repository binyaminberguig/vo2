import { createTask, updateTaskStatus } from '@controllers/taskController';
import Project from '@models/Project';
import Task from '@models/Task';
import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '@middlewares/authMiddleware';

jest.mock('@models/Project');
jest.mock('@models/Task');

// Utilitaires pour mocker Response et NextFunction
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext: NextFunction = jest.fn();

// Mock user avec ObjectId
const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'John',
  email: 'john@test.com',
  password: 'hashedpassword',
  comparePassword: jest.fn(),
} as any;

describe('Task Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    const projectId = new mongoose.Types.ObjectId().toHexString();

    it('should create a task successfully', async () => {
      const req: Partial<AuthRequest> = {
        params: { projectId },
        body: { title: 'New Task', description: 'Desc' },
        user: mockUser,
      };
      const res = mockResponse();

      (Project.findOne as jest.Mock).mockResolvedValue({ _id: projectId, owner: mockUser._id });
      (Task.create as jest.Mock).mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        title: 'New Task',
        description: 'Desc',
        projectId,
        assignedTo: mockUser._id,
      });

      await createTask(req as AuthRequest, res, mockNext);

      expect(Project.findOne).toHaveBeenCalledWith({ _id: projectId, owner: mockUser._id });
      expect(Task.create).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Desc',
        projectId,
        assignedTo: mockUser._id,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Task created successfully' }));
    });

    it('should return 401 if user not logged in', async () => {
      const req: Partial<AuthRequest> = { params: { projectId }, body: {} };
      const res = mockResponse();

      await createTask(req as AuthRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
    });

    it('should return 404 if project not found', async () => {
      const req: Partial<AuthRequest> = { params: { projectId }, body: {}, user: mockUser };
      const res = mockResponse();

      (Project.findOne as jest.Mock).mockResolvedValue(null);

      await createTask(req as AuthRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found' });
    });
  });

  describe('updateTaskStatus', () => {
    const taskId = new mongoose.Types.ObjectId().toHexString();

    it('should update task status successfully', async () => {
        const req: Partial<AuthRequest> = {
            params: { id: taskId },
            body: { status: 'done' },
            user: mockUser,
        };
        const res = mockResponse();

        const mockTask = {
            _id: taskId,
            status: 'todo',
            save: jest.fn().mockResolvedValue(true),
        };

        // 👇 Simule que findById() renvoie un objet avec une méthode populate() qui résout en mockTask
        (Task.findById as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockTask),
        });

        await updateTaskStatus(req as AuthRequest, res, mockNext);

        expect(Task.findById).toHaveBeenCalledWith(taskId);
        expect(mockTask.status).toBe('done');
        expect(mockTask.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Task status updated' })
        );
    });


    it('should return 401 if user not logged in', async () => {
      const req: Partial<AuthRequest> = { params: { id: taskId }, body: { status: 'todo' } };
      const res = mockResponse();

      await updateTaskStatus(req as AuthRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
    });

    it('should return 400 for invalid status', async () => {
        const req: Partial<AuthRequest> = {
            params: { id: taskId },
            body: { status: 'invalid_status' },
            user: mockUser,
        };
        const res = mockResponse();

        await updateTaskStatus(req as AuthRequest, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid status value' });
    });


    it('should return 404 if task not found', async () => {
        const req: Partial<AuthRequest> = {
            params: { id: taskId },
            body: { status: 'done' },
            user: mockUser,
        };
        const res = mockResponse();

        // 🧩 Ici, on simule l’enchaînement findById().populate() → null
        (Task.findById as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });

        await updateTaskStatus(req as AuthRequest, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });

  });
});
