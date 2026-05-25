import { prisma } from '../database/prisma';
import bcrypt from 'bcrypt';

interface CreateFuncionarioDTO {
  nome?: string;
  endereco?: string;
  contato?: string;
  cpf?: string;
  data_nascimento?: Date;
  funcao?: string;
  disponibilidade?: string;
  email: string;
  senha: string;
}

interface UpdateFuncionarioDTO {
  nome?: string;
  endereco?: string;
  contato?: string;
  cpf?: string;
  data_nascimento?: Date;
  funcao?: string;
  disponibilidade?: string;
  email?: string;
  senha?: string;
}

export class FuncionarioService {
  async create(data: CreateFuncionarioDTO) {
    const funcionarioExists = await prisma.funcionarios.findUnique({
      where: { email: data.email },
    });

    if (funcionarioExists) {
      throw new Error('E-mail já está sendo utilizado.');
    }

    const hashedPassword = await bcrypt.hash(data.senha, 10);

    const funcionario = await prisma.funcionarios.create({
      data: {
        ...data,
        senha: hashedPassword,
      },
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...funcionarioSemSenha } = funcionario;
    return funcionarioSemSenha;
  }

  async getAll() {
    const funcionarios = await prisma.funcionarios.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        funcao: true,
        cpf: true,
        contato: true,
        endereco: true,
        data_nascimento: true,
        disponibilidade: true,
      }
    });
    return funcionarios;
  }

  async getById(id: number) {
    const funcionario = await prisma.funcionarios.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        funcao: true,
        cpf: true,
        contato: true,
        endereco: true,
        data_nascimento: true,
        disponibilidade: true,
      }
    });
    if (!funcionario) {
      throw new Error('Funcionário não encontrado.');
    }
    return funcionario;
  }

  async update(id: number, data: UpdateFuncionarioDTO) {
    const dataToUpdate = { ...data };

    if (data.senha) {
      dataToUpdate.senha = await bcrypt.hash(data.senha, 10);
    }

    const funcionario = await prisma.funcionarios.update({
      where: { id },
      data: dataToUpdate,
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...funcionarioSemSenha } = funcionario;
    return funcionarioSemSenha;
  }

  async delete(id: number) {
    await prisma.funcionarios.delete({
      where: { id },
    });
    return { message: 'Funcionário deletado com sucesso.' };
  }
}
