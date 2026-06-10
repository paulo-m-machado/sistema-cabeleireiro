import { prisma } from '../database/prisma';

interface CreateProdutoDTO {
  descricao?: string;
  marca?: string;
  qtd_estoque?: number;
  qtd_minima?: number;
  qtd_maxima?: number;
  vlr_venda?: number;
  data_validade?: Date;
  data_inclusao?: Date;
  usuario_cadastrou?: number;
  STATUS?: boolean;
}

interface UpdateProdutoDTO {
  descricao?: string;
  marca?: string;
  qtd_estoque?: number;
  qtd_minima?: number;
  qtd_maxima?: number;
  vlr_venda?: number;
  data_validade?: Date;
  data_ultima_venda?: Date;
  data_alteracao?: Date;
  usuario_alterou?: number;
  STATUS?: boolean;
  data_cancelamento?: Date;
}

export class ProdutoService {
  async create(data: CreateProdutoDTO) {
    const produto = await prisma.produtos.create({
      data,
    });
    return produto;
  }

  async getAll() {
    const produtos = await prisma.produtos.findMany();
    return produtos;
  }

  async getById(id: number) {
    const produto = await prisma.produtos.findUnique({
      where: { id },
    });
    if (!produto) {
      throw new Error('Produto não encontrado.');
    }
    return produto;
  }

  async update(id: number, data: UpdateProdutoDTO) {
    const produto = await prisma.produtos.update({
      where: { id },
      data,
    });
    return produto;
  }

  async delete(id: number) {
    await prisma.produtos.delete({
      where: { id },
    });
    return { message: 'Produto deletado com sucesso.' };
  }
}
