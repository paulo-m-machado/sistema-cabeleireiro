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

interface CreateSaleItem {
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
}

interface CreateSaleDTO {
  funcionario_id: number;
  cliente_id?: number;
  itens: CreateSaleItem[];
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
        venda_produto: {
          include: { produtos: true }
        }
      },
      orderBy: { id: 'desc' }
    });
    return vendas;
  }

  async getById(id: number) {
    const venda = await prisma.vendas.findUnique({
      where: { id },
      include: {
        clientes: true,
        funcionarios: true,
        venda_produto: {
          include: { produtos: true }
        }
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

  async createSale(data: CreateSaleDTO) {
    return await prisma.$transaction(async (tx) => {
      let totalValor = 0;
      let totalQtd = 0;

      for (const item of data.itens) {
        if (item.quantidade <= 0) {
          throw new Error(`Quantidade inválida para o produto ${item.produto_id}`);
        }

        const produto = await tx.produtos.findUnique({
          where: { id: item.produto_id },
        });

        if (!produto) {
          throw new Error(`Produto com ID ${item.produto_id} não encontrado.`);
        }

        const estoqueAtual = produto.qtd_estoque ?? 0;
        if (estoqueAtual < item.quantidade) {
          throw new Error(`Estoque insuficiente para "${produto.descricao}". Disponível: ${estoqueAtual}, solicitado: ${item.quantidade}`);
        }

        await tx.produtos.update({
          where: { id: item.produto_id },
          data: {
            qtd_estoque: { decrement: item.quantidade },
            data_ultima_venda: new Date(),
          },
        });

        totalValor += item.valor_unitario * item.quantidade;
        totalQtd += item.quantidade;
      }

      const venda = await tx.vendas.create({
        data: {
          funcionario_id: data.funcionario_id,
          cliente_id: data.cliente_id,
          qtd_produto: totalQtd,
          valor: totalValor,
        },
      });

      for (const item of data.itens) {
        for (let i = 0; i < item.quantidade; i++) {
          await tx.venda_produto.create({
            data: {
              venda_id: venda.id,
              produto_id: item.produto_id,
            },
          });
        }
      }

      return venda;
    });
  }

  async getTopSelling(limit: number = 10) {
    const grouped = await prisma.venda_produto.groupBy({
      by: ['produto_id'],
      _count: { produto_id: true },
      orderBy: { _count: { produto_id: 'desc' } },
      take: limit,
    });

    if (grouped.length === 0) return [];

    const produtoIds = grouped.map(g => g.produto_id!);
    const produtos = await prisma.produtos.findMany({
      where: { id: { in: produtoIds } },
    });

    const produtoMap = new Map(produtos.map(p => [p.id, p]));

    return grouped.map(g => ({
      ...produtoMap.get(g.produto_id!),
      total_vendas: g._count.produto_id,
    })).filter(p => p.descricao);
  }
}
