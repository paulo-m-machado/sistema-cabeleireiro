import { Request, Response } from 'express';
import { ClienteService } from '../services/ClienteService';

export class ClienteController {
  async create(req: Request, res: Response): Promise<Response> {
    const clienteService = new ClienteService();
    try {
      const cliente = await clienteService.create(req.body);
      return res.status(201).json(cliente);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const clienteService = new ClienteService();
    try {
      const nome = req.query.nome as string | undefined;
      const clientes = await clienteService.getAll(nome);
      return res.json(clientes);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const clienteService = new ClienteService();
    try {
      const cliente = await clienteService.getById(Number(id));
      return res.json(cliente);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const clienteService = new ClienteService();
    try {
      const cliente = await clienteService.update(Number(id), req.body);
      return res.json(cliente);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const clienteService = new ClienteService();
    try {
      const result = await clienteService.delete(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
