import { Request, Response } from 'express';
import { ProdutoService } from '../services/ProdutoService';

export class ProdutoController {
  async create(req: Request, res: Response): Promise<Response> {
    const produtoService = new ProdutoService();
    try {
      const produto = await produtoService.create(req.body);
      return res.status(201).json(produto);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const produtoService = new ProdutoService();
    try {
      const produtos = await produtoService.getAll();
      return res.json(produtos);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const produtoService = new ProdutoService();
    try {
      const produto = await produtoService.getById(Number(id));
      return res.json(produto);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const produtoService = new ProdutoService();
    try {
      const produto = await produtoService.update(Number(id), req.body);
      return res.json(produto);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const produtoService = new ProdutoService();
    try {
      const result = await produtoService.delete(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
