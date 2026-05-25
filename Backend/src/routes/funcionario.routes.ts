import { Router } from 'express';
import { FuncionarioController } from '../controllers/FuncionarioController';

const funcionarioRoutes = Router();
const funcionarioController = new FuncionarioController();

funcionarioRoutes.post('/', funcionarioController.create);
funcionarioRoutes.get('/', funcionarioController.getAll);
funcionarioRoutes.get('/:id', funcionarioController.getById);
funcionarioRoutes.put('/:id', funcionarioController.update);
funcionarioRoutes.delete('/:id', funcionarioController.delete);

export { funcionarioRoutes };
