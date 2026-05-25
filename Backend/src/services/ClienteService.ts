import { prisma } from '../database/prisma';

interface CreateClienteDTO {
  nome?: string;
  endereco?: string;
  contato?: string;
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
    const cliente = await prisma.clientes.create({
      data,
    });
    return cliente;
  }

  async getAll() {
    const clientes = await prisma.clientes.findMany();
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
