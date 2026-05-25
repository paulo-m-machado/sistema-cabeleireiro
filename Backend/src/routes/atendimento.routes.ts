import { Router } from 'express';
import { AtendimentoController } from '../controllers/AtendimentoController';

const atendimentoRoutes = Router();
const atendimentoController = new AtendimentoController();

atendimentoRoutes.post('/', atendimentoController.create);
atendimentoRoutes.get('/', atendimentoController.getAll);
atendimentoRoutes.get('/:id', atendimentoController.getById);
atendimentoRoutes.put('/:id', atendimentoController.update);
atendimentoRoutes.delete('/:id', atendimentoController.delete);

export { atendimentoRoutes };
