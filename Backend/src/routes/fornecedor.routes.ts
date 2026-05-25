import { Router } from 'express';
import { FornecedorController } from '../controllers/FornecedorController';

const fornecedorRoutes = Router();
const fornecedorController = new FornecedorController();

fornecedorRoutes.post('/', fornecedorController.create);
fornecedorRoutes.get('/', fornecedorController.getAll);
fornecedorRoutes.get('/:id', fornecedorController.getById);
fornecedorRoutes.put('/:id', fornecedorController.update);
fornecedorRoutes.delete('/:id', fornecedorController.delete);

export { fornecedorRoutes };
