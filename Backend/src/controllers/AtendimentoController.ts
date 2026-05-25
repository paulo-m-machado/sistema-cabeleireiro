import { Request, Response } from 'express';
import { AtendimentoService } from '../services/AtendimentoService';

export class AtendimentoController {
  async create(req: Request, res: Response): Promise<Response> {
    const atendimentoService = new AtendimentoService();
    try {
      const atendimento = await atendimentoService.create(req.body);
      return res.status(201).json(atendimento);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const atendimentoService = new AtendimentoService();
    try {
      const atendimentos = await atendimentoService.getAll();
      return res.json(atendimentos);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const atendimentoService = new AtendimentoService();
    try {
      const atendimento = await atendimentoService.getById(Number(id));
      return res.json(atendimento);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const atendimentoService = new AtendimentoService();
    try {
      const atendimento = await atendimentoService.update(Number(id), req.body);
      return res.json(atendimento);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const atendimentoService = new AtendimentoService();
    try {
      const result = await atendimentoService.delete(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
