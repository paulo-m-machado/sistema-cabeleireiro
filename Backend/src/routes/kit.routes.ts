import { Router } from 'express';
import { KitController } from '../controllers/KitController';
import { authMiddleware } from '../middleware/auth';

const kitRoutes = Router();
const kitController = new KitController();

kitRoutes.get('/', kitController.getAll);
kitRoutes.get('/:id', kitController.getById);
kitRoutes.post('/', authMiddleware, kitController.create);
kitRoutes.put('/:id', authMiddleware, kitController.update);
kitRoutes.delete('/:id', authMiddleware, kitController.delete);

export { kitRoutes };
