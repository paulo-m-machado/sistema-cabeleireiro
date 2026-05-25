import { prisma } from '../database/prisma';

interface CreateCompraDTO {
  fornecedor_id?: number;
  valor?: number;
  quantidade?: number;
  data_compra?: Date;
  data_entrega?: Date;
  STATUS?: string;
}

interface UpdateCompraDTO {
  fornecedor_id?: number;
  valor?: number;
  quantidade?: number;
  data_compra?: Date;
  data_entrega?: Date;
  STATUS?: string;
}

export class CompraService {
  async create(data: CreateCompraDTO) {
    const compra = await prisma.compras.create({
      data,
    });
    return compra;
  }

  async getAll() {
    const compras = await prisma.compras.findMany({
      include: {
        fornecedores: true,
      }
    });
    return compras;
  }

  async getById(id: number) {
    const compra = await prisma.compras.findUnique({
      where: { id },
      include: {
        fornecedores: true,
      }
    });
    if (!compra) {
      throw new Error('Compra não encontrada.');
    }
    return compra;
  }

  async update(id: number, data: UpdateCompraDTO) {
    const compra = await prisma.compras.update({
      where: { id },
      data,
    });
    return compra;
  }

  async delete(id: number) {
    await prisma.compras.delete({
      where: { id },
    });
    return { message: 'Compra deletada com sucesso.' };
  }
}
