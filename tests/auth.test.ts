import { register, login } from '@controllers/authController';
import User from '@models/User';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

jest.mock('@models/User');
jest.mock('jsonwebtoken');

fdescribe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockReq.body = { name: 'Ben', email: 'ben@test.com', password: '123456' };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({
        _id: '1',
        name: 'Ben',
        email: 'ben@test.com',
        password: 'hashed',
      });
      (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

      await register(mockReq as Request, mockRes as Response, mockNext);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'ben@test.com' });
      expect(User.create).toHaveBeenCalledWith({
        name: 'Ben',
        email: 'ben@test.com',
        password: '123456',
      });
      expect(jwt.sign).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User registered successfully',
          token: 'fake-jwt-token',
          user: expect.objectContaining({
            name: 'Ben',
            email: 'ben@test.com',
          }),
        })
      );
    });

    it('should return 400 if email already exists', async () => {
      mockReq.body = { name: 'Ben', email: 'ben@test.com', password: '123456' };

      (User.findOne as jest.Mock).mockResolvedValue({ email: 'ben@test.com' });

      await register(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Email already exists',
      });
    });

    it('should call next() on error', async () => {
      mockReq.body = { name: 'Ben', email: 'ben@test.com', password: '123456' };
      (User.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

      await register(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockReq.body = { email: 'ben@test.com', password: '123456' };

      const mockUser = {
        _id: '1',
        name: 'Ben',
        email: 'ben@test.com',
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

      await login(mockReq as Request, mockRes as Response, mockNext);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'ben@test.com' });
      expect(mockUser.comparePassword).toHaveBeenCalledWith('123456');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login successful',
          token: 'fake-jwt-token',
          user: expect.objectContaining({
            email: 'ben@test.com',
          }),
        })
      );
    });

    it('should return 400 if user not found', async () => {
      mockReq.body = { email: 'wrong@test.com', password: '123456' };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await login(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });

    it('should return 400 if password does not match', async () => {
      mockReq.body = { email: 'ben@test.com', password: 'wrongpass' };

      const mockUser = {
        _id: '1',
        name: 'Ben',
        email: 'ben@test.com',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await login(mockReq as Request, mockRes as Response, mockNext);

      expect(mockUser.comparePassword).toHaveBeenCalledWith('wrongpass');
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });

    it('should call next() on DB error', async () => {
      mockReq.body = { email: 'ben@test.com', password: '123456' };
      (User.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

      await login(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
