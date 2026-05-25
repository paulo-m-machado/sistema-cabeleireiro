import { Request, Response } from 'express';
import { FuncionarioService } from '../services/FuncionarioService';

export class FuncionarioController {
  async create(req: Request, res: Response): Promise<Response> {
    const funcionarioService = new FuncionarioService();
    try {
      const funcionario = await funcionarioService.create(req.body);
      return res.status(201).json(funcionario);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const funcionarioService = new FuncionarioService();
    try {
      const funcionarios = await funcionarioService.getAll();
      return res.json(funcionarios);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const funcionarioService = new FuncionarioService();
    try {
      const funcionario = await funcionarioService.getById(Number(id));
      return res.json(funcionario);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const funcionarioService = new FuncionarioService();
    try {
      const funcionario = await funcionarioService.update(Number(id), req.body);
      return res.json(funcionario);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const funcionarioService = new FuncionarioService();
    try {
      const result = await funcionarioService.delete(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
