import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  const funcs = await prisma.funcionarios.findMany({
    where: { nome: { contains: 'Ana' } },
    select: { id: true, nome: true },
  });
  console.log('Funcionarios encontrados:', JSON.stringify(funcs, null, 2));

  if (funcs.length > 0) {
    const id = funcs[0].id;
    const atendimentos = await prisma.atendimentos.count({ where: { funcionario_id: id } });
    const vendas = await prisma.vendas.count({ where: { funcionario_id: id } });
    const fornecedores = await prisma.fornecedores.count({ where: { usuario_cadastrou: id } });
    const produtosCriados = await prisma.produtos.count({ where: { usuario_cadastrou: id } });
    const produtosAlterados = await prisma.produtos.count({ where: { usuario_alterou: id } });

    console.log(`Atendimentos vinculados: ${atendimentos}`);
    console.log(`Vendas vinculadas: ${vendas}`);
    console.log(`Fornecedores vinculados: ${fornecedores}`);
    console.log(`Produtos criados: ${produtosCriados}`);
    console.log(`Produtos alterados: ${produtosAlterados}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
