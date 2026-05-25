import { Request, Response } from 'express';
import { ServicoService } from '../services/ServicoService';

export class ServicoController {
  async create(req: Request, res: Response): Promise<Response> {
    const servicoService = new ServicoService();
    try {
      const servico = await servicoService.create(req.body);
      return res.status(201).json(servico);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const servicoService = new ServicoService();
    try {
      const servicos = await servicoService.getAll();
      return res.json(servicos);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const servicoService = new ServicoService();
    try {
      const servico = await servicoService.getById(Number(id));
      return res.json(servico);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const servicoService = new ServicoService();
    try {
      const servico = await servicoService.update(Number(id), req.body);
      return res.json(servico);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const servicoService = new ServicoService();
    try {
      const result = await servicoService.delete(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
