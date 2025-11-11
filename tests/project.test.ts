import { createProject, getProjectById } from '@controllers/projectController';
import Project from '@models/Project';
import Task from '@models/Task';
import Comment from '@models/Comment';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '@middlewares/authMiddleware';
import { IUser } from '@models/User';
import { Types } from 'mongoose';

jest.mock('@models/Project');
jest.mock('@models/Task');
jest.mock('@models/Comment');

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext: NextFunction = jest.fn();

describe('Project Controller', () => {
  const mockUser: IUser = {
    _id: new Types.ObjectId(),
    name: 'John',
    email: 'john@test.com',
    password: 'hashedpassword',
    comparePassword: jest.fn(),
  } as unknown as IUser;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const req: Partial<AuthRequest> = {
        body: { name: 'Test Project', description: 'Desc' },
        user: mockUser,
      };
      const res = mockResponse();

      (Project.create as jest.Mock).mockResolvedValue({
        _id: 'proj123',
        name: 'Test Project',
        description: 'Desc',
        owner: mockUser._id,
      });

      await createProject(req as AuthRequest, res, mockNext);

      expect(Project.create).toHaveBeenCalledWith({
        name: 'Test Project',
        description: 'Desc',
        owner: mockUser._id,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project created successfully',
        project: {
          _id: 'proj123',
          name: 'Test Project',
          description: 'Desc',
          owner: mockUser._id,
        },
      });
    });

    it('should return 401 if user is not present', async () => {
      const req: Partial<AuthRequest> = { body: { name: 'Test' } };
      const res = mockResponse();

      await createProject(req as AuthRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
      expect(Project.create).not.toHaveBeenCalled();
    });

    it('should call next on error', async () => {
      const req: Partial<AuthRequest> = {
        body: { name: 'Test' },
        user: mockUser,
      };
      const res = mockResponse();
      const error = new Error('DB error');

      (Project.create as jest.Mock).mockRejectedValue(error);

      await createProject(req as AuthRequest, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getProjectById', () => {
    const mockProject = {
      _id: 'proj1',
      name: 'Project 1',
      description: 'Desc',
      owner: { name: 'Owner', email: 'owner@test.com' },
    };
    const mockTasks = [
      { _id: 'task1', title: 'Task1', assignedTo: { name: 'A', email: 'a@test.com' } },
    ];
    const mockComments = [
      { _id: 'c1', task: 'task1', content: 'Comment1', author: { name: 'B', email: 'b@test.com' } },
    ];

    it('should return project with tasks and comments', async () => {
      const req: Partial<AuthRequest> = { params: { id: 'proj1' } };
      const res = mockResponse();

      (Project.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(mockProject) }),
      });
      (Task.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(mockTasks) }),
      });
      (Comment.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(mockComments) }),
      });

      await getProjectById(req as AuthRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...mockProject,
        tasks: [
          {
            ...mockTasks[0],
            comments: [mockComments[0]],
          },
        ],
      });
    });

    it('should return 404 if project not found', async () => {
      const req: Partial<AuthRequest> = { params: { id: 'proj1' } };
      const res = mockResponse();

      (Project.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) }),
      });

      await getProjectById(req as AuthRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found' });
    });

    it('should call next on error', async () => {
      const req: Partial<AuthRequest> = { params: { id: 'proj1' } };
      const res = mockResponse();
      const error = new Error('DB error');

      (Project.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({ lean: jest.fn().mockRejectedValue(error) }),
      });

      await getProjectById(req as AuthRequest, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
