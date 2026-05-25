import { Router } from 'express';
import { CompraController } from '../controllers/CompraController';

const compraRoutes = Router();
const compraController = new CompraController();

compraRoutes.post('/',     compraController.create);
compraRoutes.get('/',      compraController.getAll);
compraRoutes.get('/:id',   compraController.getById);
compraRoutes.put('/:id',   compraController.update);
compraRoutes.delete('/:id',compraController.delete);

export { compraRoutes };
