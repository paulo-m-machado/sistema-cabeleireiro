import { prisma } from '../database/prisma';
import { whatsappService } from './WhatsAppService';

interface CreateAtendimentoDTO {
  funcionario_id?: number;
  cliente_id?: number;
  servico_id?: number;
  kit_id?: number;
  horario?: Date;
  duracao?: Date;
  foco?: boolean;
}

interface UpdateAtendimentoDTO {
  funcionario_id?: number;
  cliente_id?: number;
  servico_id?: number;
  kit_id?: number;
  horario?: Date;
  duracao?: Date;
  foco?: boolean;
}

export class AtendimentoService {
  async create(data: CreateAtendimentoDTO) {
    if (data.funcionario_id && data.horario) {
      const conflito = await prisma.atendimentos.findFirst({
        where: {
          funcionario_id: data.funcionario_id,
          horario: data.horario,
        },
      });
      if (conflito) {
        throw new Error('Este horário já está ocupado para este profissional.');
      }
    }

    const atendimento = await prisma.atendimentos.create({
      data,
      include: {
        clientes: { select: { nome: true, contato: true } },
        funcionarios: { select: { nome: true } },
        servicos: { select: { nome: true } },
        kits: { select: { nome: true } },
      },
    });

    const phone = atendimento.clientes?.contato;
    const clientName = atendimento.clientes?.nome;
    const profName = atendimento.funcionarios?.nome;
    const serviceName = atendimento.servicos?.nome ?? atendimento.kits?.nome;
    const horarioStr = atendimento.horario
      ? new Date(atendimento.horario).toLocaleString('pt-BR', {
          timeZone: 'UTC',
          dateStyle: 'short',
          timeStyle: 'short',
        })
      : '';
    if (phone && clientName && profName && serviceName) {
      const message = `Olá ${clientName}, seu agendamento foi confirmado!\n\n📋 Serviço: ${serviceName}\n💇 Profissional: ${profName}\n📅 Data/Hora: ${horarioStr}\n\nAguardamos você! 💈`;
      whatsappService.sendMessage(phone, message).catch(() => {});
    }

    return atendimento;
  }

  async getAll() {
    const atendimentos = await prisma.atendimentos.findMany({
      include: {
        clientes: true,
        funcionarios: true,
        servicos: true,
        kits: true,
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
        kits: true,
      }
    });
    if (!atendimento) {
      throw new Error('Atendimento não encontrado.');
    }
    return atendimento;
  }

  async update(id: number, data: UpdateAtendimentoDTO) {
    if (data.funcionario_id && data.horario) {
      const conflito = await prisma.atendimentos.findFirst({
        where: {
          funcionario_id: data.funcionario_id,
          horario: data.horario,
          id: { not: id },
        },
      });
      if (conflito) {
        throw new Error('Este horário já está ocupado para este profissional.');
      }
    }

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
