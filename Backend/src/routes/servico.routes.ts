import { Router } from 'express';
import { ServicoController } from '../controllers/ServicoController';

const servicoRoutes = Router();
const servicoController = new ServicoController();

servicoRoutes.post('/', servicoController.create);
servicoRoutes.get('/', servicoController.getAll);
servicoRoutes.get('/:id', servicoController.getById);
servicoRoutes.put('/:id', servicoController.update);
servicoRoutes.delete('/:id', servicoController.delete);

export { servicoRoutes };
