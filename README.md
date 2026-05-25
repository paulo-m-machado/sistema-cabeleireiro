# Sistema de Gestão — Sebastian Cabelo e Estética

Projeto unificado com **Backend TypeScript/Express/Prisma** e **Frontend HTML/CSS/JS**.

## Estrutura

```
projeto-final/
├── Backend/          ← TypeScript · Express · Prisma · MySQL
│   ├── src/
│   │   ├── server.ts           ← entrada; serve também o Frontend
│   │   ├── routes/             ← rotas REST (inclui /estatisticas)
│   │   ├── controllers/
│   │   ├── services/
│   │   └── database/
│   ├── prisma/schema.prisma
│   ├── .env
│   └── package.json
│
└── Frontend/         ← HTML · CSS · JS puro (sem framework)
    ├── home/
    ├── login/        ← conectado à API POST /auth/login
    ├── gerente/      ← gráficos PI buscam /estatisticas/*
    ├── cadastro-funcionario/  ← conectado à API POST /funcionarios
    ├── agenda/
    ├── agendamento/
    ├── estoque/
    ├── servicos/
    ├── registro-servico/
    ├── historico-cliente/
    ├── css/
    ├── js/
    └── img/
```

## Como rodar

### 1. Configurar o banco de dados
Edite `Backend/.env`:
```
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
JWT_SECRET="sua_chave_secreta"
PORT=3333
```

### 2. Instalar dependências e subir
```bash
cd Backend
npm install
npm run dev
```

### 3. Acessar
| Página         | URL                                     |
|----------------|-----------------------------------------|
| Home           | http://localhost:3333/home/index.html   |
| Login          | http://localhost:3333/login/index.html  |
| Gerente (PI)   | http://localhost:3333/gerente/index.html|

## Rotas da API

| Método | Rota                         | Descrição                              |
|--------|------------------------------|----------------------------------------|
| POST   | /auth/login                  | Login com e-mail e senha               |
| GET    | /clientes                    | Listar clientes                        |
| POST   | /funcionarios                | Cadastrar funcionário                  |
| GET    | /servicos                    | Listar serviços                        |
| GET    | /atendimentos                | Listar atendimentos                    |
| GET    | /vendas                      | Listar vendas                          |
| GET    | /compras                     | Listar compras                         |
| GET    | /estatisticas/dispersao      | Dados gráfico dispersão (PI)           |
| GET    | /estatisticas/serie-temporal | Dados série temporal (PI)              |
| GET    | /estatisticas/pizza          | Dados gráfico pizza (PI)               |

## Gráficos da PI de Estatística (Painel do Gerente)

A página `/gerente/index.html` exibe os 3 gráficos exigidos na Atividade 2:

- **Dispersão** — Valor da Venda × Quantidade de Produtos (variáveis quantitativas contínuas)
- **Série Temporal** — Atendimentos por mês com linha de tendência (mínimos quadrados)
- **Pizza/Doughnut** — Distribuição por tipo de serviço (variável qualitativa)

Se o banco ainda não tiver dados, os gráficos exibem automaticamente dados de demonstração.
