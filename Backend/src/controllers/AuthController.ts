import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  async handle(req: Request, res: Response): Promise<Response> {

    console.log("CHEGOU NO LOGIN");
    console.log(req.body);

    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: 'E-mail e senha são obrigatórios.'
      });
    }

    const authService = new AuthService();

    try {
      const result = await authService.login({
        email,
        senha_pura: senha
      });

      return res.json(result);

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
}