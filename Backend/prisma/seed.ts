import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(start: Date, end: Date): Date {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d;
}

async function main() {
  console.log('🗑️  Limpando dados existentes...');
  await prisma.atendimento_produto.deleteMany();
  await prisma.venda_produto.deleteMany();
  await prisma.compra_produto.deleteMany();
  await prisma.atendimentos.deleteMany();
  await prisma.historicos.deleteMany();
  await prisma.vendas.deleteMany();
  await prisma.compras.deleteMany();
  await prisma.produtos.deleteMany();
  await prisma.fornecedores.deleteMany();
  await prisma.kits.deleteMany();
  await prisma.servicos.deleteMany();
  await prisma.clientes.deleteMany();
  await prisma.funcionarios.deleteMany();

  // ─── SENHA PADRÃO ───
  const senhaHash = await bcrypt.hash('123456', 10);

  // ─── FUNCIONÁRIOS ───
  console.log('👤 Cadastrando funcionários...');
  const funcionarios = await Promise.all([
    prisma.funcionarios.create({
      data: {
        nome: 'Ana Silva', email: 'ana@salao.com', senha: senhaHash,
        funcao: 'Cabeleireiro(a)', contato: '(11) 91234-0001', cpf: '123.456.789-01',
        data_nascimento: new Date('1990-03-15'), endereco: 'Rua A, 100',
        observacoes: 'Especialista em cortes femininos e coloração',
      },
    }),
    prisma.funcionarios.create({
      data: {
        nome: 'Carlos Oliveira', email: 'carlos@salao.com', senha: senhaHash,
        funcao: 'Barbeiro(a)', contato: '(11) 91234-0002', cpf: '123.456.789-02',
        data_nascimento: new Date('1988-07-22'), endereco: 'Rua B, 200',
        observacoes: 'Especialista em barba e cortes masculinos',
      },
    }),
    prisma.funcionarios.create({
      data: {
        nome: 'Mariana Costa', email: 'mariana@salao.com', senha: senhaHash,
        funcao: 'Manicure', contato: '(11) 91234-0003', cpf: '123.456.789-03',
        data_nascimento: new Date('1995-11-01'), endereco: 'Rua C, 300',
        observacoes: 'Especialista em unhas em gel e alongamento',
      },
    }),
    prisma.funcionarios.create({
      data: {
        nome: 'Juliana Santos', email: 'juliana@salao.com', senha: senhaHash,
        funcao: 'Esteticista', contato: '(11) 91234-0004', cpf: '123.456.789-04',
        data_nascimento: new Date('1992-09-12'), endereco: 'Rua D, 400',
        observacoes: 'Especialista em limpeza de pele e massagens',
      },
    }),
    prisma.funcionarios.create({
      data: {
        nome: 'Roberto Lima', email: 'roberto@salao.com', senha: senhaHash,
        funcao: 'Maquiador(a)', contato: '(11) 91234-0005', cpf: '123.456.789-05',
        data_nascimento: new Date('1993-06-28'), endereco: 'Rua E, 500',
        observacoes: 'Especialista em maquiagem social e artística',
      },
    }),
    prisma.funcionarios.create({
      data: {
        nome: 'Fernanda Rocha', email: 'fernanda@salao.com', senha: senhaHash,
        funcao: 'Designer de sobrancelhas', contato: '(11) 91234-0006',
        cpf: '123.456.789-06', data_nascimento: new Date('1991-04-05'),
        endereco: 'Rua F, 600',
        observacoes: 'Especialista em design de sobrancelhas e micropigmentação',
      },
    }),
    // Gerente
    prisma.funcionarios.create({
      data: {
        nome: 'Administrador', email: 'gerente@salao.com', senha: senhaHash,
        funcao: 'Gerente', contato: '(11) 91234-0007',
        cpf: '123.456.789-07', data_nascimento: new Date('1985-01-10'),
        endereco: 'Av. Principal, 1000',
        observacoes: 'Gerente geral do salão - acesso total ao sistema',
      },
    }),
  ]);

  // ─── SERVIÇOS ───
  console.log('💇 Cadastrando serviços...');
  const servicosData = [
    // Cabelo
    { nome: 'Corte Feminino', descricao: 'Corte personalizado com tesoura e máquina', preco: 65.0, duracao_min: 45 },
    { nome: 'Corte Masculino', descricao: 'Corte moderno com tesoura e máquina', preco: 45.0, duracao_min: 30 },
    { nome: 'Hidratação Capilar', descricao: 'Hidratação profunda com queratina e óleos', preco: 55.0, duracao_min: 40 },
    { nome: 'Escova', descricao: 'Escova modelada com secador e prancha', preco: 50.0, duracao_min: 35 },
    { nome: 'Progressiva', descricao: 'Alisamento progressivo com formol livre', preco: 180.0, duracao_min: 120 },
    { nome: 'Luzes', descricao: 'Luzes com papel alumínio ou touca', preco: 150.0, duracao_min: 90 },
    { nome: 'Balayage', descricao: 'Técnica francesa de mechas com efeito degradê', preco: 200.0, duracao_min: 120 },
    { nome: 'Botox Capilar', descricao: 'Tratamento reconstrutor com queratina e colágeno', preco: 80.0, duracao_min: 50 },
    { nome: 'Coloração', descricao: 'Coloração completa com tintura profissional', preco: 90.0, duracao_min: 60 },
    { nome: 'Corte Infantil', descricao: 'Corte infantil com paciência e carinho', preco: 40.0, duracao_min: 25 },
    // Manicure
    { nome: 'Manicure Simples', descricao: 'Corte e lixação de unhas + esmaltação', preco: 30.0, duracao_min: 30 },
    { nome: 'Pedicure Simples', descricao: 'Corte e lixação de unhas dos pés + esmaltação', preco: 35.0, duracao_min: 35 },
    { nome: 'Manicure + Pedicure', descricao: 'Combo mãos e pés com esmaltação', preco: 55.0, duracao_min: 60 },
    { nome: 'Alongamento de Unhas', descricao: 'Alongamento com gel ou acrílico', preco: 100.0, duracao_min: 90 },
    { nome: 'Unhas em Gel', descricao: 'Aplicação de unhas em gel', preco: 90.0, duracao_min: 80 },
    { nome: 'Unhas Acrílicas', descricao: 'Aplicação de unhas acrílicas', preco: 110.0, duracao_min: 90 },
    { nome: 'Francesinha', descricao: 'Esmaltação com técnica francesinha', preco: 40.0, duracao_min: 35 },
    { nome: 'Esmaltação em Gel', descricao: 'Esmaltação com gel de longa duração', preco: 50.0, duracao_min: 40 },
    { nome: 'Banho de Gel', descricao: 'Banho de gel fortalecedor', preco: 60.0, duracao_min: 50 },
    { nome: 'Nail Art', descricao: 'Decoração artística das unhas', preco: 45.0, duracao_min: 45 },
    // Estética
    { nome: 'Limpeza de Pele', descricao: 'Limpeza profunda com extração e máscara', preco: 80.0, duracao_min: 60 },
    { nome: 'Massagem Relaxante', descricao: 'Massagem corporal relaxante com óleos essenciais', preco: 90.0, duracao_min: 60 },
    { nome: 'Massagem Modeladora', descricao: 'Massagem modeladora com técnicas avançadas', preco: 100.0, duracao_min: 60 },
    { nome: 'Drenagem Linfática', descricao: 'Drenagem linfática manual', preco: 85.0, duracao_min: 55 },
    { nome: 'Depilação Facial', descricao: 'Depilação com cera para buço e sobrancelhas', preco: 35.0, duracao_min: 20 },
    { nome: 'Depilação Corporal', descricao: 'Depilação com cera para pernas e axilas', preco: 60.0, duracao_min: 40 },
    { nome: 'Peeling Facial', descricao: 'Pealing químico ou físico para renovação celular', preco: 120.0, duracao_min: 50 },
    { nome: 'Hidratação Facial', descricao: 'Hidratação profunda com ativos cosméticos', preco: 70.0, duracao_min: 45 },
    { nome: 'Maquiagem Social', descricao: 'Maquiagem completa para eventos sociais', preco: 100.0, duracao_min: 60 },
    { nome: 'Maquiagem Artística', descricao: 'Maquiagem criativa e artística', preco: 130.0, duracao_min: 75 },
    { nome: 'Design de Sobrancelhas', descricao: 'Modelagem e design de sobrancelhas', preco: 40.0, duracao_min: 25 },
    { nome: 'Micropigmentação', descricao: 'Micropigmentação de sobrancelhas', preco: 250.0, duracao_min: 120 },
    { nome: 'Microagulhamento', descricao: 'Microagulhamento para rejuvenescimento facial', preco: 180.0, duracao_min: 90 },
    { nome: 'Radiofrequência Facial', descricao: 'Radiofrequência para firmeza da pele', preco: 150.0, duracao_min: 60 },
  ];

  const servicos = await Promise.all(
    servicosData.map((s) =>
      prisma.servicos.create({
        data: {
          nome: s.nome,
          descricao: s.descricao,
          preco: s.preco,
          duracao_estimada: new Date(`1970-01-01T${String(Math.floor(s.duracao_min / 60)).padStart(2, '0')}:${String(s.duracao_min % 60).padStart(2, '0')}:00`),
        },
      })
    )
  );

  // ─── KITS ───
  console.log('📦 Cadastrando kits...');
  const kitsData = [
    { nome: 'Kit Noivas', descricao: 'Escova + Maquiagem Social + Design de Sobrancelhas + Manicure + Pedicure', preco: 280.0, condicoes: 'Agendamento com 7 dias de antecedência' },
    { nome: 'Kit Dia de Beleza', descricao: 'Corte Feminino + Hidratação Capilar + Manicure + Pedicure', preco: 160.0, condicoes: 'Válido de segunda a quinta' },
    { nome: 'Kit Relaxamento', descricao: 'Massagem Relaxante + Drenagem Linfática + Limpeza de Pele', preco: 200.0, condicoes: 'Duração aproximada de 2h30' },
    { nome: 'Kit Unhas dos Sonhos', descricao: 'Alongamento + Francesinha + Nail Art', preco: 150.0, condicoes: 'Consultar disponibilidade' },
    { nome: 'Kit Cabelo Renew', descricao: 'Hidratação + Corte + Escova', preco: 120.0, condicoes: 'Válido para cabelos de qualquer tipo' },
    { nome: 'Kit Estética Completa', descricao: 'Limpeza de Pele + Peeling + Hidratação Facial + Design de Sobrancelhas', preco: 250.0, condicoes: 'Não inclui protetor solar' },
    { nome: 'Kit Bem-Estar', descricao: 'Massagem Modeladora + Depilação Corporal + Manicure', preco: 180.0, condicoes: 'Agendamento com 48h de antecedência' },
    { nome: 'Kit Cabelo + Unhas', descricao: 'Coloração + Escova + Manicure + Pedicure', preco: 200.0, condicoes: 'Promoção imperdível' },
    { nome: 'Kit Casal', descricao: '2 Cortes + 2 Escovas + 2 Manicures', preco: 220.0, condicoes: 'Mesmo horário para o casal' },
    { nome: 'Kit Debutante', descricao: 'Maquiagem Social + Penteado + Manicure + Pedicure + Design de Sobrancelhas', preco: 350.0, condicoes: 'Inclui teste de maquiagem 1 semana antes' },
  ];

  const kits = await Promise.all(
    kitsData.map((k) =>
      prisma.kits.create({ data: { nome: k.nome, descricao: k.descricao, preco: k.preco, condicoes: k.condicoes } })
    )
  );

  // ─── PRODUTOS ───
  console.log('🧴 Cadastrando produtos...');
  const produtosData = [
    // Shampoos e Condicionadores
    { descricao: 'Shampoo Neutro Profissional 300ml', marca: 'Kérastase', qtd_estoque: 25, qtd_minima: 5, qtd_maxima: 50, vlr_venda: 45.90 },
    { descricao: 'Condicionador Neutro Profissional 300ml', marca: 'Kérastase', qtd_estoque: 20, qtd_minima: 5, qtd_maxima: 40, vlr_venda: 49.90 },
    { descricao: 'Shampoo Antiqueda 250ml', marca: 'L\'Oréal Professionnel', qtd_estoque: 15, qtd_minima: 3, qtd_maxima: 30, vlr_venda: 55.00 },
    { descricao: 'Condicionador Antiqueda 250ml', marca: 'L\'Oréal Professionnel', qtd_estoque: 14, qtd_minima: 3, qtd_maxima: 30, vlr_venda: 58.00 },
    { descricao: 'Shampoo Matizador 250ml', marca: 'Schwarzkopf', qtd_estoque: 10, qtd_minima: 3, qtd_maxima: 20, vlr_venda: 62.00 },
    // Máscaras e Óleos
    { descricao: 'Máscara Capilar Reconstrutora 500g', marca: 'Amend', qtd_estoque: 12, qtd_minima: 4, qtd_maxima: 25, vlr_venda: 78.90 },
    { descricao: 'Máscara de Hidratação 300g', marca: 'Wella Professionals', qtd_estoque: 18, qtd_minima: 5, qtd_maxima: 35, vlr_venda: 65.00 },
    { descricao: 'Óleo Capilar Reparador 100ml', marca: 'Moroccanoil', qtd_estoque: 22, qtd_minima: 5, qtd_maxima: 40, vlr_venda: 89.90 },
    { descricao: 'Óleo de Argan 50ml', marca: 'Novex', qtd_estoque: 30, qtd_minima: 5, qtd_maxima: 50, vlr_venda: 29.90 },
    // Esmaltes e Unhas
    { descricao: 'Esmalte Vermelho 8ml', marca: 'Risqué', qtd_estoque: 40, qtd_minima: 10, qtd_maxima: 60, vlr_venda: 6.50 },
    { descricao: 'Esmalte Rose 8ml', marca: 'Risqué', qtd_estoque: 38, qtd_minima: 10, qtd_maxima: 60, vlr_venda: 6.50 },
    { descricao: 'Esmalte Nude 8ml', marca: 'Colorama', qtd_estoque: 35, qtd_minima: 10, qtd_maxima: 60, vlr_venda: 5.90 },
    { descricao: 'Esmalte Preto 8ml', marca: 'Colorama', qtd_estoque: 30, qtd_minima: 10, qtd_maxima: 60, vlr_venda: 5.90 },
    { descricao: 'Esmalte Branco 8ml', marca: 'Impala', qtd_estoque: 28, qtd_minima: 8, qtd_maxima: 50, vlr_venda: 5.50 },
    { descricao: 'Base Fortalecedora 10ml', marca: 'Risqué', qtd_estoque: 25, qtd_minima: 8, qtd_maxima: 50, vlr_venda: 8.90 },
    { descricao: 'Cobertura Extra Brilho 10ml', marca: 'Colorama', qtd_estoque: 20, qtd_minima: 5, qtd_maxima: 40, vlr_venda: 7.50 },
    { descricao: 'Removedor de Esmalte sem Acetona 200ml', marca: 'Acetona', qtd_estoque: 30, qtd_minima: 10, qtd_maxima: 60, vlr_venda: 12.90 },
    { descricao: 'Algodão 500g', marca: 'Algodão', qtd_estoque: 45, qtd_minima: 15, qtd_maxima: 80, vlr_venda: 8.50 },
    { descricao: 'Palito de Unhas (pacote 100un)', marca: 'Unha & Cia', qtd_estoque: 50, qtd_minima: 20, qtd_maxima: 100, vlr_venda: 4.50 },
    // Estética e Cuidados
    { descricao: 'Creme Hidratante Corporal 400ml', marca: 'CeraVe', qtd_estoque: 15, qtd_minima: 5, qtd_maxima: 30, vlr_venda: 59.90 },
    { descricao: 'Protetor Solar Facial FPS50 50g', marca: 'La Roche-Posay', qtd_estoque: 12, qtd_minima: 4, qtd_maxima: 25, vlr_venda: 79.90 },
    { descricao: 'Sérum Facial Vitamina C 30ml', marca: 'SkinCeuticals', qtd_estoque: 8, qtd_minima: 3, qtd_maxima: 15, vlr_venda: 129.90 },
    { descricao: 'Máscara Facial Argila 100g', marca: 'Adcos', qtd_estoque: 10, qtd_minima: 3, qtd_maxima: 20, vlr_venda: 45.00 },
    { descricao: 'Tônico Facial Adstringente 200ml', marca: 'Vichy', qtd_estoque: 10, qtd_minima: 3, qtd_maxima: 20, vlr_venda: 52.00 },
    { descricao: 'Creme para Mãos 100g', marca: 'Granado', qtd_estoque: 25, qtd_minima: 5, qtd_maxima: 40, vlr_venda: 18.90 },
    // Profissionais
    { descricao: 'Pente Profissional Corte', marca: 'Tondeo', qtd_estoque: 10, qtd_minima: 3, qtd_maxima: 20, vlr_venda: 35.00 },
    { descricao: 'Tesoura Profissional 6.5"', marca: 'Mundial', qtd_estoque: 5, qtd_minima: 2, qtd_maxima: 10, vlr_venda: 89.90 },
    { descricao: 'Máquina de Cortar Cabelo', marca: 'Wahl', qtd_estoque: 4, qtd_minima: 2, qtd_maxima: 8, vlr_venda: 199.90 },
    { descricao: 'Secador Profissional 2200W', marca: 'Taiff', qtd_estoque: 6, qtd_minima: 2, qtd_maxima: 12, vlr_venda: 159.90 },
  ];

  const produtos = await Promise.all(
    produtosData.map((p, i) =>
      prisma.produtos.create({
        data: {
          descricao: p.descricao,
          marca: p.marca,
          qtd_estoque: p.qtd_estoque,
          qtd_minima: p.qtd_minima,
          qtd_maxima: p.qtd_maxima,
          vlr_venda: p.vlr_venda,
          data_inclusao: new Date('2025-01-15'),
          STATUS: true,
          usuario_cadastrou: funcionarios[0].id,
        },
      })
    )
  );

  // ─── CLIENTES ───
  console.log('👥 Cadastrando 50 clientes...');
  const clientesData = [
    { nome: 'Maria Aparecida Oliveira', contato: '(11) 98765-1001', email: 'maria.oliveira@email.com', endereco: 'Rua das Flores, 123' },
    { nome: 'João Pedro Souza', contato: '(11) 98765-1002', email: 'joao.souza@email.com', endereco: 'Av. Paulista, 456' },
    { nome: 'Ana Beatriz Costa', contato: '(11) 98765-1003', email: 'ana.costa@email.com', endereco: 'Rua Augusta, 789' },
    { nome: 'Carlos Eduardo Lima', contato: '(11) 98765-1004', email: 'carlos.lima@email.com', endereco: 'Rua da Consolação, 321' },
    { nome: 'Juliana Almeida Santos', contato: '(11) 98765-1005', email: 'juliana.santos@email.com', endereco: 'Av. Brigadeiro, 654' },
    { nome: 'Rafael Pereira Martins', contato: '(11) 98765-1006', email: 'rafael.martins@email.com', endereco: 'Rua Oscar Freire, 987' },
    { nome: 'Fernanda Rodrigues Gomes', contato: '(11) 98765-1007', email: 'fernanda.gomes@email.com', endereco: 'Rua Haddock Lobo, 147' },
    { nome: 'Lucas Gabriel Nascimento', contato: '(11) 98765-1008', email: 'lucas.nascimento@email.com', endereco: 'Av. São João, 258' },
    { nome: 'Patrícia Oliveira Barbosa', contato: '(11) 98765-1009', email: 'patricia.barbosa@email.com', endereco: 'Rua 7 de Abril, 369' },
    { nome: 'Ricardo Augusto Teixeira', contato: '(11) 98765-1010', email: 'ricardo.teixeira@email.com', endereco: 'Rua Augusta, 159' },
    { nome: 'Camila Fernandes Dias', contato: '(11) 98765-1011', email: 'camila.dias@email.com', endereco: 'Av. Rebouças, 753' },
    { nome: 'Pedro Henrique Carvalho', contato: '(11) 98765-1012', email: 'pedro.carvalho@email.com', endereco: 'Rua Bela Cintra, 951' },
    { nome: 'Larissa Oliveira Mendes', contato: '(11) 98765-1013', email: 'larissa.mendes@email.com', endereco: 'Rua da Consolação, 753' },
    { nome: 'Thiago Alex Santos', contato: '(11) 98765-1014', email: 'thiago.santos@email.com', endereco: 'Av. Angélica, 357' },
    { nome: 'Aline Cristina Barbosa', contato: '(11) 98765-1015', email: 'aline.barbosa@email.com', endereco: 'Rua Maranhão, 159' },
    { nome: 'Gustavo Henrique Alves', contato: '(11) 98765-1016', email: 'gustavo.alves@email.com', endereco: 'Rua Piauí, 753' },
    { nome: 'Vanessa Souza Ramos', contato: '(11) 98765-1017', email: 'vanessa.ramos@email.com', endereco: 'Av. São Gabriel, 951' },
    { nome: 'Felipe Augusto Castro', contato: '(11) 98765-1018', email: 'felipe.castro@email.com', endereco: 'Rua Canadá, 357' },
    { nome: 'Tatiane Moreira Silva', contato: '(11) 98765-1019', email: 'tatiane.silva@email.com', endereco: 'Rua México, 159' },
    { nome: 'André Luiz Fernandes', contato: '(11) 98765-1020', email: 'andre.fernandes@email.com', endereco: 'Av. Europa, 753' },
    { nome: 'Bruna Caroline Oliveira', contato: '(11) 98765-1021', email: 'bruna.oliveira@email.com', endereco: 'Rua França, 951' },
    { nome: 'Diego Souza Martins', contato: '(11) 98765-1022', email: 'diego.martins@email.com', endereco: 'Rua Inglaterra, 357' },
    { nome: 'Elaine Cristina Pereira', contato: '(11) 98765-1023', email: 'elaine.pereira@email.com', endereco: 'Av. Itália, 159' },
    { nome: 'Bruno César Ribeiro', contato: '(11) 98765-1024', email: 'bruno.ribeiro@email.com', endereco: 'Rua Espanha, 753' },
    { nome: 'Daniela Aparecida Campos', contato: '(11) 98765-1025', email: 'daniela.campos@email.com', endereco: 'Rua Portugal, 951' },
    { nome: 'Eduardo Santos Silveira', contato: '(11) 98765-1026', email: 'eduardo.silveira@email.com', endereco: 'Av. Alemanha, 357' },
    { nome: 'Fabiana Oliveira Correia', contato: '(11) 98765-1027', email: 'fabiana.correia@email.com', endereco: 'Rua Suíça, 159' },
    { nome: 'Gabriel Almeida Costa', contato: '(11) 98765-1028', email: 'gabriel.costa@email.com', endereco: 'Rua Holanda, 753' },
    { nome: 'Helena Martins Faria', contato: '(11) 98765-1029', email: 'helena.faria@email.com', endereco: 'Av. Bélgica, 951' },
    { nome: 'Igor Vinícius Barbosa', contato: '(11) 98765-1030', email: 'igor.barbosa@email.com', endereco: 'Rua Áustria, 357' },
    { nome: 'Jéssica Fernanda Duarte', contato: '(11) 98765-1031', email: 'jessica.duarte@email.com', endereco: 'Rua Dinamarca, 159' },
    { nome: 'Kleber Augusto Nogueira', contato: '(11) 98765-1032', email: 'kleber.nogueira@email.com', endereco: 'Av. Suécia, 753' },
    { nome: 'Letícia Gomes Araújo', contato: '(11) 98765-1033', email: 'leticia.araujo@email.com', endereco: 'Rua Noruega, 951' },
    { nome: 'Marcos Vinícius Castro', contato: '(11) 98765-1034', email: 'marcos.castro@email.com', endereco: 'Rua Finlândia, 357' },
    { nome: 'Natália Cristina Lopes', contato: '(11) 98765-1035', email: 'natalia.lopes@email.com', endereco: 'Av. Irlanda, 159' },
    { nome: 'Otávio Henrique Moreira', contato: '(11) 98765-1036', email: 'otavio.moreira@email.com', endereco: 'Rua Escócia, 753' },
    { nome: 'Priscila Oliveira Andrade', contato: '(11) 98765-1037', email: 'priscila.andrade@email.com', endereco: 'Rua País de Gales, 951' },
    { nome: 'Renato Augusto Cardoso', contato: '(11) 98765-1038', email: 'renato.cardoso@email.com', endereco: 'Av. Mônaco, 357' },
    { nome: 'Sabrina Helena Freitas', contato: '(11) 98765-1039', email: 'sabrina.freitas@email.com', endereco: 'Rua Luxemburgo, 159' },
    { nome: 'Tiago Rafael Carvalho', contato: '(11) 98765-1040', email: 'tiago.carvalho@email.com', endereco: 'Rua Andorra, 753' },
    { nome: 'Ursula Beatriz Lima', contato: '(11) 98765-1041', email: 'ursula.lima@email.com', endereco: 'Av. Malta, 951' },
    { nome: 'Vitor Gabriel Oliveira', contato: '(11) 98765-1042', email: 'vitor.oliveira@email.com', endereco: 'Rua Chipre, 357' },
    { nome: 'Yasmin Cristina Rocha', contato: '(11) 98765-1043', email: 'yasmin.rocha@email.com', endereco: 'Rua Islândia, 159' },
    { nome: 'Adriana Souza Melo', contato: '(11) 98765-1044', email: 'adriana.melo@email.com', endereco: 'Av. Croácia, 753' },
    { nome: 'Bianca Oliveira Paz', contato: '(11) 98765-1045', email: 'bianca.paz@email.com', endereco: 'Rua Eslováquia, 951' },
    { nome: 'Cíntia Mara Souza', contato: '(11) 98765-1046', email: 'cintia.souza@email.com', endereco: 'Rua Eslovênia, 357' },
    { nome: 'Douglas Souza Pires', contato: '(11) 98765-1047', email: 'douglas.pires@email.com', endereco: 'Av. Hungria, 159' },
    { nome: 'Elisa Regina Campos', contato: '(11) 98765-1048', email: 'elisa.campos@email.com', endereco: 'Rua Bulgária, 753' },
    { nome: 'Fabrício Alves Neto', contato: '(11) 98765-1049', email: 'fabricio.neto@email.com', endereco: 'Rua Romênia, 951' },
    { nome: 'Giovana Carla Mendes', contato: '(11) 98765-1050', email: 'giovana.mendes@email.com', endereco: 'Av. Sérvia, 357' },
  ];

  const clientes = await Promise.all(
    clientesData.map((c) =>
      prisma.clientes.create({
        data: {
          nome: c.nome,
          contato: c.contato,
          email: c.email,
          endereco: c.endereco,
          data_nascimento: randomDate(new Date('1960-01-01'), new Date('2005-12-31')),
          preferencia_1: Math.random() > 0.5,
          preferencia_2: Math.random() > 0.5,
        },
      })
    )
  );

  // ─── ATENDIMENTOS ───
  console.log('📅 Cadastrando agendamentos dos últimos 6 meses...');
  const hoje = new Date();
  const seisMesesAtras = new Date();
  seisMesesAtras.setMonth(hoje.getMonth() - 6);

  for (let i = 0; i < clientes.length; i++) {
    const cliente = clientes[i];
    const numAtendimentos = randomInt(1, 3);

    for (let j = 0; j < numAtendimentos; j++) {
      const data = randomDate(seisMesesAtras, hoje);
      data.setHours(randomInt(8, 17), randomInt(0, 3) * 15, 0, 0);

      const funcionario = funcionarios[randomInt(0, funcionarios.length - 1)];
      const usarKit = Math.random() > 0.7;

      let servicoId: number | null = null;
      let kitId: number | null = null;
      let duracaoMin = 60;

      if (usarKit) {
        const kit = kits[randomInt(0, kits.length - 1)];
        kitId = kit.id;
        duracaoMin = randomInt(60, 150);
      } else {
        const servico = servicos[randomInt(0, servicos.length - 1)];
        servicoId = servico.id;
        const duracaoStr = servico.duracao_estimada ? servico.duracao_estimada.toTimeString() : '01:00:00';
        const [h, m] = duracaoStr.split(':').map(Number);
        duracaoMin = h * 60 + m;
      }

      const duracao = new Date(1970, 0, 1, 0, duracaoMin, 0);

      const dataFim = new Date(data.getTime() + duracaoMin * 60000);
      if (dataFim > hoje) continue;

      await prisma.atendimentos.create({
        data: {
          cliente_id: cliente.id,
          funcionario_id: funcionario.id,
          servico_id: servicoId,
          kit_id: kitId,
          horario: data,
          duracao: duracao,
          foco: Math.random() > 0.5,
        },
      });
    }
  }

  const totalAtendimentos = await prisma.atendimentos.count();
  const totalClientes = await prisma.clientes.count();
  const totalServicos = await prisma.servicos.count();
  const totalKits = await prisma.kits.count();
  const totalProdutos = await prisma.produtos.count();
  const totalFuncionarios = await prisma.funcionarios.count();

  console.log('\n✅ Banco populado com sucesso!');
  console.log(`   👤 Funcionários: ${totalFuncionarios} (gerente: gerente@salao.com / 123456)`);
  console.log(`   👥 Clientes: ${totalClientes}`);
  console.log(`   💇 Serviços: ${totalServicos}`);
  console.log(`   📦 Kits: ${totalKits}`);
  console.log(`   🧴 Produtos: ${totalProdutos}`);
  console.log(`   📅 Agendamentos: ${totalAtendimentos}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
