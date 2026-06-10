import { prisma } from '../database/prisma';
import bcrypt from 'bcrypt';

interface CreateFuncionarioDTO {
  nome?: string;
  endereco?: string;
  contato?: string;
  cpf?: string;
  dataNascimento?: string;
  funcao?: string;
  disponibilidade?: string;
  email: string;
  senha: string;
  observacoes?: string;
}

interface UpdateFuncionarioDTO {
  nome?: string;
  endereco?: string;
  contato?: string;
  cpf?: string;
  dataNascimento?: string;
  funcao?: string;
  disponibilidade?: string;
  email?: string;
  senha?: string;
  observacoes?: string;
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
        nome: data.nome,
        endereco: data.endereco,
        contato: data.contato,
        cpf: data.cpf,
        data_nascimento: data.dataNascimento ? new Date(data.dataNascimento) : undefined,
        funcao: data.funcao,
        disponibilidade: data.disponibilidade,
        email: data.email,
        senha: hashedPassword,
        observacoes: data.observacoes,
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
        observacoes: true,
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
        observacoes: true,
      }
    });
    if (!funcionario) {
      throw new Error('Funcionário não encontrado.');
    }
    return funcionario;
  }

  async update(id: number, data: UpdateFuncionarioDTO) {
    const dataToUpdate: any = {
      nome: data.nome,
      endereco: data.endereco,
      contato: data.contato,
      cpf: data.cpf,
      data_nascimento: data.dataNascimento ? new Date(data.dataNascimento) : undefined,
      funcao: data.funcao,
      disponibilidade: data.disponibilidade,
      email: data.email,
      observacoes: data.observacoes,
    };

    if (data.senha) {
      dataToUpdate.senha = await bcrypt.hash(data.senha, 10);
    }

    Object.keys(dataToUpdate).forEach(key => {
      if (dataToUpdate[key] === undefined) {
        delete dataToUpdate[key];
      }
    });

    const funcionario = await prisma.funcionarios.update({
      where: { id },
      data: dataToUpdate,
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...funcionarioSemSenha } = funcionario;
    return funcionarioSemSenha;
  }

  async delete(id: number) {
    await prisma.$transaction([
      prisma.atendimentos.updateMany({ where: { funcionario_id: id }, data: { funcionario_id: null } }),
      prisma.vendas.updateMany({ where: { funcionario_id: id }, data: { funcionario_id: null } }),
      prisma.fornecedores.updateMany({ where: { usuario_cadastrou: id }, data: { usuario_cadastrou: null } }),
      prisma.produtos.updateMany({ where: { usuario_cadastrou: id }, data: { usuario_cadastrou: null } }),
      prisma.produtos.updateMany({ where: { usuario_alterou: id }, data: { usuario_alterou: null } }),
      prisma.funcionarios.delete({ where: { id } }),
    ]);
    return { message: 'Funcionário deletado com sucesso.' };
  }
}
