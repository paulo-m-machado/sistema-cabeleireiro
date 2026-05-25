import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';

const clienteRoutes = Router();
const clienteController = new ClienteController();

clienteRoutes.post('/', clienteController.create);
clienteRoutes.get('/', clienteController.getAll);
clienteRoutes.get('/:id', clienteController.getById);
clienteRoutes.put('/:id', clienteController.update);
clienteRoutes.delete('/:id', clienteController.delete);

export { clienteRoutes };
