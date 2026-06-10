import { prisma } from '../database/prisma';

interface CreateHistoricoDTO {
  cliente_id: number;
  data_atendimento: string;
  profissional?: string;
  tipo_servico?: string;
  produtos_utilizados?: string;
  marca_tinta?: string;
  formula_coloracao?: string;
  tempo_pausa?: number;
  corte_realizado?: string;
  preferencias?: string;
  observacoes?: string;
  proxima_recomendacao?: string;
}

interface UpdateHistoricoDTO {
  data_atendimento?: string;
  profissional?: string;
  tipo_servico?: string;
  produtos_utilizados?: string;
  marca_tinta?: string;
  formula_coloracao?: string;
  tempo_pausa?: number;
  corte_realizado?: string;
  preferencias?: string;
  observacoes?: string;
  proxima_recomendacao?: string;
}

export class HistoricoService {
  async create(data: CreateHistoricoDTO) {
    const historico = await prisma.historicos.create({
      data: {
        cliente_id: data.cliente_id,
        data_atendimento: data.data_atendimento ? new Date(data.data_atendimento) : null,
        profissional: data.profissional,
        tipo_servico: data.tipo_servico,
        produtos_utilizados: data.produtos_utilizados,
        marca_tinta: data.marca_tinta,
        formula_coloracao: data.formula_coloracao,
        tempo_pausa: data.tempo_pausa,
        corte_realizado: data.corte_realizado,
        preferencias: data.preferencias,
        observacoes: data.observacoes,
        proxima_recomendacao: data.proxima_recomendacao,
      },
    });
    return historico;
  }

  async getAll() {
    const historicos = await prisma.historicos.findMany({
      include: { clientes: true },
    });
    return historicos;
  }

  async getByClienteId(clienteId: number) {
    const historicos = await prisma.historicos.findMany({
      where: { cliente_id: clienteId },
      orderBy: { data_atendimento: 'desc' },
    });
    return historicos;
  }

  async getById(id: number) {
    const historico = await prisma.historicos.findUnique({
      where: { id },
    });
    if (!historico) {
      throw new Error('Histórico não encontrado.');
    }
    return historico;
  }

  async update(id: number, data: UpdateHistoricoDTO) {
    const updateData: any = { ...data };
    if (data.data_atendimento) {
      updateData.data_atendimento = new Date(data.data_atendimento);
    }
    const historico = await prisma.historicos.update({
      where: { id },
      data: updateData,
    });
    return historico;
  }

  async delete(id: number) {
    await prisma.historicos.delete({
      where: { id },
    });
    return { message: 'Histórico deletado com sucesso.' };
  }
}
