import { Router, Request, Response } from 'express';
import { prisma } from '../database/prisma';

const estatisticasRoutes = Router();

// ─── GET /estatisticas/dispersao ────────────────────────────────────────────
// Gráfico 1: Dispersão — Valor da Venda (R$) × Quantidade de Produtos
// Duas variáveis quantitativas contínuas → verifica associação linear
estatisticasRoutes.get('/dispersao', async (_req: Request, res: Response) => {
  try {
    const vendas = await prisma.vendas.findMany({
      where: { valor: { not: null }, qtd_produto: { not: null } },
      select: { id: true, valor: true, qtd_produto: true },
      orderBy: { id: 'asc' },
    });

    const dados = vendas.map(v => ({
      x: Number(v.qtd_produto),
      y: Number(v.valor),
    }));

    return res.json({
      titulo: 'Dispersão: Valor da Venda (R$) × Quantidade de Produtos',
      eixoX: 'Quantidade de Produtos',
      eixoY: 'Valor da Venda (R$)',
      dados,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── GET /estatisticas/serie-temporal ───────────────────────────────────────
// Gráfico 2: Série Temporal — Total de atendimentos por mês
// Verifica tendência ao longo do tempo
estatisticasRoutes.get('/serie-temporal', async (_req: Request, res: Response) => {
  try {
    const atendimentos = await prisma.atendimentos.findMany({
      select: { horario: true },
      orderBy: { horario: 'asc' },
    });

    const agrupado: Record<string, number> = {};
    for (const a of atendimentos) {
      const dt  = new Date(a.horario);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      agrupado[key] = (agrupado[key] || 0) + 1;
    }

    const labels  = Object.keys(agrupado).sort();
    const valores  = labels.map(l => agrupado[l]);

    return res.json({
      titulo: 'Série Temporal: Atendimentos por Mês',
      eixoX:  'Mês/Ano',
      eixoY:  'Quantidade de Atendimentos',
      labels,
      valores,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── GET /estatisticas/pizza ─────────────────────────────────────────────────
// Gráfico 3: Pizza — Distribuição de atendimentos por serviço (variável qualitativa)
estatisticasRoutes.get('/pizza', async (_req: Request, res: Response) => {
  try {
    const atendimentos = await prisma.atendimentos.findMany({
      where: { servico_id: { not: null } },
      include: { servicos: { select: { nome: true } } },
    });

    const agrupado: Record<string, number> = {};
    for (const a of atendimentos) {
      const nome = a.servicos?.nome?.trim() || 'Não informado';
      agrupado[nome] = (agrupado[nome] || 0) + 1;
    }

    // Top 6 serviços + "Outros"
    const ordenado = Object.entries(agrupado).sort((a, b) => b[1] - a[1]);
    const top       = ordenado.slice(0, 6);
    const resto     = ordenado.slice(6).reduce((s, [, v]) => s + v, 0);
    if (resto > 0) top.push(['Outros', resto]);

    return res.json({
      titulo:  'Distribuição de Atendimentos por Serviço',
      labels:  top.map(([l]) => l),
      valores: top.map(([, v]) => v),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export { estatisticasRoutes };
