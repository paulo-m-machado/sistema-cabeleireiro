import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'chave_padrao_super_secreta';

interface JwtPayload {
  id: number;
  funcao: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const isGerente = decoded.funcao?.toLowerCase().includes('gerente');

    if (!isGerente) {
      return res.status(403).json({ error: 'Acesso restrito a Gerentes.' });
    }

    (req as any).usuarioId = decoded.id;
    (req as any).usuarioFuncao = decoded.funcao;

    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}
