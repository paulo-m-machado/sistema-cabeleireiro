import { Request, Response } from 'express';
import { KitService } from '../services/KitService';

export class KitController {
  async create(req: Request, res: Response): Promise<Response> {
    const kitService = new KitService();
    try {
      const kit = await kitService.create(req.body);
      return res.status(201).json(kit);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const kitService = new KitService();
    try {
      const kits = await kitService.getAll();
      return res.json(kits);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const kitService = new KitService();
    try {
      const kit = await kitService.getById(Number(id));
      return res.json(kit);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const kitService = new KitService();
    try {
      const kit = await kitService.update(Number(id), req.body);
      return res.json(kit);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const kitService = new KitService();
    try {
      const result = await kitService.delete(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
