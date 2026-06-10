import { Router } from 'express';
import { ServicoController } from '../controllers/ServicoController';
import { authMiddleware } from '../middleware/auth';

const servicoRoutes = Router();
const servicoController = new ServicoController();

servicoRoutes.get('/', servicoController.getAll);
servicoRoutes.get('/:id', servicoController.getById);
servicoRoutes.post('/', authMiddleware, servicoController.create);
servicoRoutes.put('/:id', authMiddleware, servicoController.update);
servicoRoutes.delete('/:id', authMiddleware, servicoController.delete);

export { servicoRoutes };
