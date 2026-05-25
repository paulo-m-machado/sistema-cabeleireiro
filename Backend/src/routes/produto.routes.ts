import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';

const produtoRoutes = Router();
const produtoController = new ProdutoController();

produtoRoutes.post('/', produtoController.create);
produtoRoutes.get('/', produtoController.getAll);
produtoRoutes.get('/:id', produtoController.getById);
produtoRoutes.put('/:id', produtoController.update);
produtoRoutes.delete('/:id', produtoController.delete);

export { produtoRoutes };
