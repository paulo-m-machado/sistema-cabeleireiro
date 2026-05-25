import { prisma } from '../database/prisma';

interface CreateAtendimentoDTO {
  funcionario_id?: number;
  cliente_id?: number;
  servico_id?: number;
  horario?: Date;
  duracao?: Date;
  foco?: boolean;
}

interface UpdateAtendimentoDTO {
  funcionario_id?: number;
  cliente_id?: number;
  servico_id?: number;
  horario?: Date;
  duracao?: Date;
  foco?: boolean;
}

export class AtendimentoService {
  async create(data: CreateAtendimentoDTO) {
    const atendimento = await prisma.atendimentos.create({
      data,
    });
    return atendimento;
  }

  async getAll() {
    const atendimentos = await prisma.atendimentos.findMany({
      include: {
        clientes: true,
        funcionarios: true,
        servicos: true,
      }
    });
    return atendimentos;
  }

  async getById(id: number) {
    const atendimento = await prisma.atendimentos.findUnique({
      where: { id },
      include: {
        clientes: true,
        funcionarios: true,
        servicos: true,
      }
    });
    if (!atendimento) {
      throw new Error('Atendimento não encontrado.');
    }
    return atendimento;
  }

  async update(id: number, data: UpdateAtendimentoDTO) {
    const atendimento = await prisma.atendimentos.update({
      where: { id },
      data,
    });
    return atendimento;
  }

  async delete(id: number) {
    await prisma.atendimentos.delete({
      where: { id },
    });
    return { message: 'Atendimento deletado com sucesso.' };
  }
}
