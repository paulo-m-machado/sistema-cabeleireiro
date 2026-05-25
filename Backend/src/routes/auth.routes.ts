import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRoutes = Router();
const authController = new AuthController();

// Mapeia o método POST para http://localhost:3333/auth/login
authRoutes.post('/login', authController.handle);

export { authRoutes };