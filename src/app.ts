import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import { AuthRequest, protect } from './middlewares/authMiddleware';


dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);


app.get('/api/profile', protect, (req: AuthRequest, res) => {
  res.json({ message: `Hello ${req.user?.name}`, user: req.user });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server running with TypeScript!' });
});

export default app;