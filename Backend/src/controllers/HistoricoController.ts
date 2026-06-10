import { Request, Response } from 'express';
import { HistoricoService } from '../services/HistoricoService';

export class HistoricoController {
  async create(req: Request, res: Response): Promise<Response> {
    const historicoService = new HistoricoService();
    try {
      const historico = await historicoService.create(req.body);
      return res.status(201).json(historico);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const historicoService = new HistoricoService();
    try {
      const historicos = await historicoService.getAll();
      return res.json(historicos);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getByClienteId(req: Request, res: Response): Promise<Response> {
    const { clienteId } = req.params;
    const historicoService = new HistoricoService();
    try {
      const historicos = await historicoService.getByClienteId(Number(clienteId));
      return res.json(historicos);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const historicoService = new HistoricoService();
    try {
      const historico = await historicoService.getById(Number(id));
      return res.json(historico);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const historicoService = new HistoricoService();
    try {
      const historico = await historicoService.update(Number(id), req.body);
      return res.json(historico);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const historicoService = new HistoricoService();
    try {
      const result = await historicoService.delete(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
