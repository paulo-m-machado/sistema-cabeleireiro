import { prisma } from '../database/prisma';

interface CreateVendaDTO {
  cliente_id?: number;
  funcionario_id?: number;
  qtd_produto?: number;
  valor?: number;
}

interface UpdateVendaDTO {
  cliente_id?: number;
  funcionario_id?: number;
  qtd_produto?: number;
  valor?: number;
}

export class VendaService {
  async create(data: CreateVendaDTO) {
    const venda = await prisma.vendas.create({
      data,
    });
    return venda;
  }

  async getAll() {
    const vendas = await prisma.vendas.findMany({
      include: {
        clientes: true,
        funcionarios: true,
      }
    });
    return vendas;
  }

  async getById(id: number) {
    const venda = await prisma.vendas.findUnique({
      where: { id },
      include: {
        clientes: true,
        funcionarios: true,
      }
    });
    if (!venda) {
      throw new Error('Venda não encontrada.');
    }
    return venda;
  }

  async update(id: number, data: UpdateVendaDTO) {
    const venda = await prisma.vendas.update({
      where: { id },
      data,
    });
    return venda;
  }

  async delete(id: number) {
    await prisma.vendas.delete({
      where: { id },
    });
    return { message: 'Venda deletada com sucesso.' };
  }
}
