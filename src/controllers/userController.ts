import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();

    res.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
};
