import { prisma } from '../database/prisma';

interface CreateClienteDTO {
  nome?: string;
  endereco?: string;
  contato?: string;
  email?: string;
  data_nascimento?: Date;
  preferencia_1?: boolean;
  preferencia_2?: boolean;
  descricao?: string;
}

interface UpdateClienteDTO {
  nome?: string;
  endereco?: string;
  contato?: string;
  data_nascimento?: Date;
  preferencia_1?: boolean;
  preferencia_2?: boolean;
  descricao?: string;
}

export class ClienteService {
  async create(data: CreateClienteDTO) {
    if (data.contato) {
      const existing = await prisma.clientes.findFirst({
        where: { contato: data.contato },
      });
      if (existing) {
        return existing;
      }
    }
    const cliente = await prisma.clientes.create({
      data: {
        nome: data.nome,
        endereco: data.endereco,
        contato: data.contato,
        email: data.email,
        data_nascimento: data.data_nascimento,
        preferencia_1: data.preferencia_1,
        preferencia_2: data.preferencia_2,
        descricao: data.descricao,
      },
    });
    return cliente;
  }

  async getAll(nome?: string) {
    const where = nome
      ? { nome: { contains: nome } }
      : {};
    const clientes = await prisma.clientes.findMany({ where });
    return clientes;
  }

  async getById(id: number) {
    const cliente = await prisma.clientes.findUnique({
      where: { id },
    });
    if (!cliente) {
      throw new Error('Cliente não encontrado.');
    }
    return cliente;
  }

  async update(id: number, data: UpdateClienteDTO) {
    const cliente = await prisma.clientes.update({
      where: { id },
      data,
    });
    return cliente;
  }

  async delete(id: number) {
    await prisma.clientes.delete({
      where: { id },
    });
    return { message: 'Cliente deletado com sucesso.' };
  }
}
