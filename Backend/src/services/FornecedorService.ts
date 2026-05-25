import { prisma } from '../database/prisma';

interface CreateFornecedorDTO {
  cnpj?: string;
  nome_fantasia?: string;
  descricao?: string;
  data_cadastro?: Date;
  STATUS?: boolean;
  usuario_cadastrou?: number;
}

interface UpdateFornecedorDTO {
  cnpj?: string;
  nome_fantasia?: string;
  descricao?: string;
  STATUS?: boolean;
  data_cancelamento?: Date;
}

export class FornecedorService {
  async create(data: CreateFornecedorDTO) {
    const fornecedor = await prisma.fornecedores.create({
      data,
    });
    return fornecedor;
  }

  async getAll() {
    const fornecedores = await prisma.fornecedores.findMany();
    return fornecedores;
  }

  async getById(id: number) {
    const fornecedor = await prisma.fornecedores.findUnique({
      where: { id },
    });
    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado.');
    }
    return fornecedor;
  }

  async update(id: number, data: UpdateFornecedorDTO) {
    const fornecedor = await prisma.fornecedores.update({
      where: { id },
      data,
    });
    return fornecedor;
  }

  async delete(id: number) {
    await prisma.fornecedores.delete({
      where: { id },
    });
    return { message: 'Fornecedor deletado com sucesso.' };
  }
}
