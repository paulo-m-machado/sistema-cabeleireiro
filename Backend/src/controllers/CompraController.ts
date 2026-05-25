import { Request, Response } from 'express';
import { CompraService } from '../services/CompraService';

export class CompraController {
  async create(req: Request, res: Response): Promise<Response> {
    const compraService = new CompraService();
    try {
      const compra = await compraService.create(req.body);
      return res.status(201).json(compra);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const compraService = new CompraService();
    try {
      const compras = await compraService.getAll();
      return res.json(compras);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const compraService = new CompraService();
    try {
      const compra = await compraService.getById(Number(id));
      return res.json(compra);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const compraService = new CompraService();
    try {
      const compra = await compraService.update(Number(id), req.body);
      return res.json(compra);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const compraService = new CompraService();
    try {
      const result = await compraService.delete(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
