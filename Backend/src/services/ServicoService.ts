import { prisma } from '../database/prisma';

interface CreateServicoDTO {
  nome: string;
  descricao?: string;
  preco?: number;
  duracao_estimada?: Date;
}

interface UpdateServicoDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  duracao_estimada?: Date;
}

export class ServicoService {
  async create(data: CreateServicoDTO) {
    const servico = await prisma.servicos.create({
      data,
    });
    return servico;
  }

  async getAll() {
    const servicos = await prisma.servicos.findMany();
    return servicos;
  }

  async getById(id: number) {
    const servico = await prisma.servicos.findUnique({
      where: { id },
    });
    if (!servico) {
      throw new Error('Serviço não encontrado.');
    }
    return servico;
  }

  async update(id: number, data: UpdateServicoDTO) {
    const servico = await prisma.servicos.update({
      where: { id },
      data,
    });
    return servico;
  }

  async delete(id: number) {
    await prisma.servicos.delete({
      where: { id },
    });
    return { message: 'Serviço deletado com sucesso.' };
  }
}
