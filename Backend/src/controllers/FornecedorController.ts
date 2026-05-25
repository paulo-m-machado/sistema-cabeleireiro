import { Request, Response } from 'express';
import { FornecedorService } from '../services/FornecedorService';

export class FornecedorController {
  async create(req: Request, res: Response): Promise<Response> {
    const fornecedorService = new FornecedorService();
    try {
      const fornecedor = await fornecedorService.create(req.body);
      return res.status(201).json(fornecedor);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const fornecedorService = new FornecedorService();
    try {
      const fornecedores = await fornecedorService.getAll();
      return res.json(fornecedores);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const fornecedorService = new FornecedorService();
    try {
      const fornecedor = await fornecedorService.getById(Number(id));
      return res.json(fornecedor);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const fornecedorService = new FornecedorService();
    try {
      const fornecedor = await fornecedorService.update(Number(id), req.body);
      return res.json(fornecedor);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const fornecedorService = new FornecedorService();
    try {
      const result = await fornecedorService.delete(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
