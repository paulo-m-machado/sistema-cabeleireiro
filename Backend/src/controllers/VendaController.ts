import { Request, Response } from 'express';
import { VendaService } from '../services/VendaService';

export class VendaController {
  async create(req: Request, res: Response): Promise<Response> {
    const vendaService = new VendaService();
    try {
      const venda = await vendaService.create(req.body);
      return res.status(201).json(venda);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const vendaService = new VendaService();
    try {
      const vendas = await vendaService.getAll();
      return res.json(vendas);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const vendaService = new VendaService();
    try {
      const venda = await vendaService.getById(Number(id));
      return res.json(venda);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const vendaService = new VendaService();
    try {
      const venda = await vendaService.update(Number(id), req.body);
      return res.json(venda);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const vendaService = new VendaService();
    try {
      const result = await vendaService.delete(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async createSale(req: Request, res: Response): Promise<Response> {
    const vendaService = new VendaService();
    try {
      const venda = await vendaService.createSale(req.body);
      return res.status(201).json(venda);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getTopSelling(req: Request, res: Response): Promise<Response> {
    const vendaService = new VendaService();
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const top = await vendaService.getTopSelling(limit);
      return res.json(top);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
