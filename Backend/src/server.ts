import express    from 'express';
import cors       from 'cors';
import dotenv     from 'dotenv';
import path       from 'path';

import { authRoutes }         from './routes/auth.routes';
import { clienteRoutes }      from './routes/cliente.routes';
import { funcionarioRoutes }  from './routes/funcionario.routes';
import { fornecedorRoutes }   from './routes/fornecedor.routes';
import { produtoRoutes }      from './routes/produto.routes';
import { servicoRoutes }      from './routes/servico.routes';
import { vendaRoutes }        from './routes/venda.routes';
import { compraRoutes }       from './routes/compra.routes';
import { atendimentoRoutes }  from './routes/atendimento.routes';
import { estatisticasRoutes } from './routes/estatisticas.routes';

dotenv.config();

const app = express();

// ─── Middlewares ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve o Frontend (HTML/CSS/JS) como arquivos estáticos.
// Estrutura: projeto-final/Backend/src/server.ts
//   __dirname = .../Backend/src
//   ../..     = .../projeto-final
//   ../../Frontend = .../projeto-final/Frontend  ✓
app.use(express.static(path.join(__dirname, '..', '..', 'Frontend')));

// ─── Rotas da API ─────────────────────────────────────────────────────────────
app.use('/auth',          authRoutes);
app.use('/clientes',      clienteRoutes);
app.use('/funcionarios',  funcionarioRoutes);
app.use('/fornecedores',  fornecedorRoutes);
app.use('/produtos',      produtoRoutes);
app.use('/servicos',      servicoRoutes);
app.use('/vendas',        vendaRoutes);
app.use('/compras',       compraRoutes);
app.use('/atendimentos',  atendimentoRoutes);
app.use('/estatisticas',  estatisticasRoutes);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Frontend:  http://localhost:${PORT}/home/index.html`);
  console.log(`Gerente:   http://localhost:${PORT}/gerente/index.html`);
});
