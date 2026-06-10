import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { whatsappService }   from './services/WhatsAppService';
import { authRoutes }        from './routes/auth.routes';
import { clienteRoutes }     from './routes/cliente.routes';
import { funcionarioRoutes } from './routes/funcionario.routes';
import { servicoRoutes }     from './routes/servico.routes';
import { kitRoutes }         from './routes/kit.routes';
import { atendimentoRoutes } from './routes/atendimento.routes';
import { produtoRoutes }     from './routes/produto.routes';
import { vendaRoutes }       from './routes/venda.routes';
import { fornecedorRoutes }  from './routes/fornecedor.routes';
import { historicoRoutes }   from './routes/historico.routes';
import { whatsappRoutes }    from './routes/whatsapp.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true }));

app.use('/auth',          authRoutes);
app.use('/clientes',      clienteRoutes);
app.use('/funcionarios',  funcionarioRoutes);
app.use('/servicos',      servicoRoutes);
app.use('/kits',          kitRoutes);
app.use('/atendimentos',  atendimentoRoutes);
app.use('/produtos',      produtoRoutes);
app.use('/vendas',        vendaRoutes);
app.use('/fornecedores',  fornecedorRoutes);
app.use('/historico',     historicoRoutes);
app.use('/whatsapp',      whatsappRoutes);

whatsappService.initialize().catch(() => {});

app.listen(3333, () => console.log('Servidor rodando na porta 3333'));