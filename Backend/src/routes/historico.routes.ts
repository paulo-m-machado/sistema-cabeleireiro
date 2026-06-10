import { Router } from 'express';
import { HistoricoController } from '../controllers/HistoricoController';

const historicoRoutes = Router();
const historicoController = new HistoricoController();

historicoRoutes.post('/', historicoController.create);
historicoRoutes.get('/', historicoController.getAll);
historicoRoutes.get('/detalhe/:id', historicoController.getById);
historicoRoutes.get('/:clienteId', historicoController.getByClienteId);
historicoRoutes.put('/:id', historicoController.update);
historicoRoutes.delete('/:id', historicoController.delete);

export { historicoRoutes };
