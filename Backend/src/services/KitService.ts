import { prisma } from '../database/prisma';

interface CreateKitDTO {
  nome: string;
  descricao?: string;
  preco?: number;
  condicoes?: string;
}

interface UpdateKitDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  condicoes?: string;
}

export class KitService {
  async create(data: CreateKitDTO) {
    const kit = await prisma.kits.create({ data });
    return kit;
  }

  async getAll() {
    const kits = await prisma.kits.findMany();
    return kits;
  }

  async getById(id: number) {
    const kit = await prisma.kits.findUnique({ where: { id } });
    if (!kit) throw new Error('Kit não encontrado.');
    return kit;
  }

  async update(id: number, data: UpdateKitDTO) {
    const kit = await prisma.kits.update({ where: { id }, data });
    return kit;
  }

  async delete(id: number) {
    await prisma.kits.delete({ where: { id } });
    return { message: 'Kit deletado com sucesso.' };
  }
}
