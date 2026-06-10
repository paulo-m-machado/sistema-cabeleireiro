import { Router } from 'express';
import { VendaController } from '../controllers/VendaController';

const vendaRoutes = Router();
const vendaController = new VendaController();

vendaRoutes.post('/', vendaController.create);
vendaRoutes.get('/', vendaController.getAll);
vendaRoutes.get('/top-selling', vendaController.getTopSelling);
vendaRoutes.post('/create-sale', vendaController.createSale);
vendaRoutes.get('/:id', vendaController.getById);
vendaRoutes.put('/:id', vendaController.update);
vendaRoutes.delete('/:id', vendaController.delete);

export { vendaRoutes };
