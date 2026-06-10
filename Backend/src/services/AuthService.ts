import { prisma } from '../database/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginData {
  email: string;
  senha_pura: string;
}

export class AuthService {
  async login({ email, senha_pura }: LoginData) {
    // Busca o funcionário usando o mapeamento automático do db pull
    const funcionario = await prisma.funcionarios.findUnique({
      where: { email }
    });

    if (!funcionario) {
      throw new Error('E-mail ou senha incorretos.');
    }

    const senhaValida = await bcrypt.compare(senha_pura, funcionario.senha);

    if (!senhaValida) {
      throw new Error('E-mail ou senha incorretos.');
    }

    const secret = process.env.JWT_SECRET || 'chave_padrao_super_secreta';

    const token = jwt.sign(
      { id: funcionario.id, funcao: funcionario.funcao },
      secret,
      { expiresIn: '1d' }
    );

    return {
      user: {
        id: funcionario.id,
        nome: funcionario.nome,
        email: funcionario.email,
        funcao: funcionario.funcao
      },
      token
    };
  }
}