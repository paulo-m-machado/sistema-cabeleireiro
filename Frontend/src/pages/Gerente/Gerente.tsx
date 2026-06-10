import { useEffect, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import api from '../../api/axios';
import styles from './Gerente.module.css';
import {
  media, mediana, moda, modaQualitativa, amplitudeTotal, variancia, desvioPadrao, coeficienteVariacao,
} from '../../utils/estatisticas';

interface Resumo {
  totalClientes: number;
  totalFuncionarios: number;
  totalServicos: number;
  totalProdutos: number;
  totalVendas: number;
  totalAtendimentos: number;
}

interface Produto {
  vlr_venda: number | null;
  qtd_estoque: number | null;
  marca: string | null;
}

interface Atendimento {
  horario: string;
  servico_id: number | null;
}

interface Servico {
  id: number;
  nome: string;
  preco: number | null;
}

interface Venda {
  valor: number | null;
}

const IconClientes = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconFuncionarios = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="10" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
  </svg>
);

const IconServicos = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="9.8" y1="8.2" x2="22" y2="18.2" />
    <line x1="9.8" y1="15.8" x2="22" y2="5.8" />
  </svg>
);

const IconProdutos = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <polygon points="12 22.08 12 12 3 6.93 3 17.02 12 22.08" />
    <polygon points="12 22.08 12 12 21 6.93 21 17.02 12 22.08" />
    <polygon points="12 12 3 6.93 12 1.86 21 6.93 12 12" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconVendas = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconAtendimentos = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CHART_COLORS = ['#D4AF37', '#00c6ff', '#2ECC71', '#e74c3c', '#9b59b6', '#f39c12', '#1abc9c', '#e67e22'];

export function Gerente() {
  const [resumo, setResumo] = useState<Resumo>({
    totalClientes: 0, totalFuncionarios: 0, totalServicos: 0,
    totalProdutos: 0, totalVendas: 0, totalAtendimentos: 0,
  });

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [clientes, funcionarios, servicosRes, produtosRes, vendasRes, atendimentosRes] =
          await Promise.allSettled([
            api.get('/clientes'),
            api.get('/funcionarios'),
            api.get('/servicos'),
            api.get('/produtos'),
            api.get('/vendas'),
            api.get('/atendimentos'),
          ]);

        setResumo({
          totalClientes:     clientes.status     === 'fulfilled' ? (clientes.value.data?.length     ?? 0) : 0,
          totalFuncionarios: funcionarios.status === 'fulfilled' ? (funcionarios.value.data?.length ?? 0) : 0,
          totalServicos:     servicosRes.status  === 'fulfilled' ? (servicosRes.value.data?.length   ?? 0) : 0,
          totalProdutos:     produtosRes.status  === 'fulfilled' ? (produtosRes.value.data?.length   ?? 0) : 0,
          totalVendas:       vendasRes.status    === 'fulfilled' ? (vendasRes.value.data?.length     ?? 0) : 0,
          totalAtendimentos: atendimentosRes.status === 'fulfilled' ? (atendimentosRes.value.data?.length ?? 0) : 0,
        });

        if (produtosRes.status === 'fulfilled') setProdutos(produtosRes.value.data);
        if (atendimentosRes.status === 'fulfilled') setAtendimentos(atendimentosRes.value.data);
        if (servicosRes.status === 'fulfilled') setServicos(servicosRes.value.data);
        if (vendasRes.status === 'fulfilled') setVendas(vendasRes.value.data);
      } catch (err) {
        console.error('Erro ao carregar dados', err);
      }
    }
    carregarDados();
  }, []);

  const cards = [
    { icon: <IconClientes />, label: 'Clientes',      valor: resumo.totalClientes,      cor: '#D4AF37', link: '/cadastro' },
    { icon: <IconFuncionarios />, label: 'Funcionários',  valor: resumo.totalFuncionarios,  cor: '#00c6ff', link: '/equipe' },
    { icon: <IconServicos />, label: 'Serviços',      valor: resumo.totalServicos,      cor: '#38bdf8', link: '/servicos' },
    { icon: <IconProdutos />, label: 'Produtos',      valor: resumo.totalProdutos,      cor: '#D4AF37', link: '/estoque' },
    { icon: <IconVendas />, label: 'Vendas',        valor: resumo.totalVendas,        cor: '#2ECC71', link: '#' },
    { icon: <IconAtendimentos />, label: 'Atendimentos',  valor: resumo.totalAtendimentos,  cor: '#00c6ff', link: '/agenda' },
  ];

  // ── Dados para os gráficos ──

  const scatterData = produtos
    .filter(p => p.vlr_venda != null && p.qtd_estoque != null)
    .map(p => ({ x: p.qtd_estoque as number, y: p.vlr_venda as number }));

  const atendimentosPorMes: { mes: string; total: number }[] = (() => {
    const agrupado = new Map<string, number>();
    for (const a of atendimentos) {
      if (!a.horario) continue;
      const mes = a.horario.substring(0, 7);
      agrupado.set(mes, (agrupado.get(mes) ?? 0) + 1);
    }
    return [...agrupado.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, total]) => ({ mes, total }));
  })();

  const servicosMaisProcurados: { nome: string; total: number }[] = (() => {
    const mapaServico = new Map<number, string>();
    for (const s of servicos) {
      if (s.id != null) mapaServico.set(s.id, s.nome);
    }
    const agrupado = new Map<string, number>();
    for (const a of atendimentos) {
      if (a.servico_id == null) continue;
      const nome = mapaServico.get(a.servico_id) || `Serviço #${a.servico_id}`;
      agrupado.set(nome, (agrupado.get(nome) ?? 0) + 1);
    }
    return [...agrupado.entries()]
      .sort(([, a], [, b]) => b - a)
      .map(([nome, total]) => ({ nome, total }));
  })();

  // ── Estatísticas ──

  const vlrVendaVals = produtos.map(p => p.vlr_venda).filter((v): v is number => v != null);
  const qtdEstoqueVals = produtos.map(p => p.qtd_estoque).filter((v): v is number => v != null);
  const valorVendaVals = vendas.map(v => v.valor).filter((v): v is number => v != null);
  const precoServicoVals = servicos.map(s => Number(s.preco)).filter((v): v is number => !isNaN(v));
  const nomesServicos = servicosMaisProcurados.map(s => s.nome);

  const tendencias = [
    {
      variavel: 'Preço de Venda (Produtos)',
      media: media(vlrVendaVals),
      mediana: mediana(vlrVendaVals),
      moda: moda(vlrVendaVals).join(', '),
      interpretacao: `O preço médio dos produtos é R$ ${media(vlrVendaVals).toFixed(2)}, a mediana é R$ ${mediana(vlrVendaVals).toFixed(2)} e o(s) valor(es) mais frequente(s) é(são) ${moda(vlrVendaVals).join(', ')}.`,
    },
    {
      variavel: 'Quantidade em Estoque',
      media: media(qtdEstoqueVals),
      mediana: mediana(qtdEstoqueVals),
      moda: moda(qtdEstoqueVals).join(', '),
      interpretacao: `A quantidade média em estoque é ${media(qtdEstoqueVals).toFixed(1)} unidades, a mediana é ${mediana(qtdEstoqueVals).toFixed(1)} e o(s) valor(es) mais frequente(s) é(são) ${moda(qtdEstoqueVals).join(', ')}.`,
    },
    {
      variavel: 'Valor da Venda',
      media: media(valorVendaVals),
      mediana: mediana(valorVendaVals),
      moda: moda(valorVendaVals).join(', '),
      interpretacao: `O valor médio das vendas é R$ ${media(valorVendaVals).toFixed(2)}, a mediana é R$ ${mediana(valorVendaVals).toFixed(2)} e o(s) valor(es) mais frequente(s) é(são) ${moda(valorVendaVals).join(', ')}.`,
    },
    {
      variavel: 'Preço dos Serviços',
      media: media(precoServicoVals),
      mediana: mediana(precoServicoVals),
      moda: moda(precoServicoVals).join(', '),
      interpretacao: `O preço médio dos serviços é R$ ${media(precoServicoVals).toFixed(2)}, a mediana é R$ ${mediana(precoServicoVals).toFixed(2)} e o(s) valor(es) mais frequente(s) é(são) ${moda(precoServicoVals).join(', ')}.`,
    },
    {
      variavel: 'Serviço mais Procurado (Qualitativa)',
      media: 0,
      mediana: 0,
      moda: modaQualitativa(nomesServicos).join(', '),
      interpretacao: `O(s) serviço(s) mais procurado(s) é(são): ${modaQualitativa(nomesServicos).join(', ') || 'Nenhum'}.`,
    },
  ];

  const varsVariabilidade = [
    { nome: 'Preço de Venda (Produtos)', vals: vlrVendaVals },
    { nome: 'Quantidade em Estoque', vals: qtdEstoqueVals },
    { nome: 'Valor da Venda', vals: valorVendaVals },
  ];

  const variabilidades = varsVariabilidade.map(({ nome, vals }) => {
    const dp = desvioPadrao(vals);
    const cv = coeficienteVariacao(vals);
    let interpretacao = `Amplitude total: ${amplitudeTotal(vals).toFixed(2)}. `;
    interpretacao += `Variância: ${variancia(vals).toFixed(2)}. `;
    interpretacao += `Desvio padrão: ${dp.toFixed(2)}. `;
    interpretacao += `CV: ${cv.toFixed(2)}%. `;
    interpretacao += cv > 50 ? 'Alta variabilidade.' : cv > 20 ? 'Média variabilidade.' : 'Baixa variabilidade.';
    return {
      variavel: nome,
      amplitude: amplitudeTotal(vals),
      variancia: variancia(vals),
      desvioPadrao: dp,
      cv,
      interpretacao,
    };
  });

  return (
    <main className={`${styles.main} page-bg-image`}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Painel do Gerente</h1>
        <p className={styles.subtitle}>Visão geral e controle completo do sistema</p>
        <div className={styles.line}></div>
      </section>

      <section className={styles.grid}>
        {cards.map((card) => (
          <a key={card.label} href={card.link} className={styles.card} style={{ '--card-cor': card.cor } as React.CSSProperties}>
            <div className={styles.cardIcon}>{card.icon}</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardLabel}>{card.label}</span>
              <span className={styles.cardValor}>{card.valor}</span>
            </div>
            <div className={styles.cardGlow}></div>
          </a>
        ))}
      </section>

      {/* ── GRÁFICOS ── */}
      <section className={styles.graficosSection}>
        <h2 className={styles.sectionTitle}>Gráficos Estatísticos</h2>

        <div className={styles.graficosGrid}>
          {/* Dispersão */}
          <div className={styles.graficoCard}>
            <h3 className={styles.graficoTitulo}>Dispersão: Preço vs Estoque</h3>
            <p className={styles.graficoDesc}>Relação entre quantidade em estoque e preço de venda dos produtos.</p>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="x" name="Estoque" stroke="#94a3b8" />
                <YAxis dataKey="y" name="Preço" stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #D4AF37', borderRadius: 8 }}
                  formatter={(value: number, name: string) => [value.toFixed(2), name === 'x' ? 'Estoque' : 'Preço']}
                />
                <Scatter data={scatterData} fill="#D4AF37" />
              </ScatterChart>
            </ResponsiveContainer>
            <p className={styles.interpretacao}>
              {scatterData.length > 0
                ? 'Observa-se a distribuição dos produtos quanto ao preço e quantidade em estoque, permitindo identificar possíveis associações entre as variáveis.'
                : 'Sem dados disponíveis.'}
            </p>
          </div>

          {/* Série Temporal */}
          <div className={styles.graficoCard}>
            <h3 className={styles.graficoTitulo}>Série Temporal: Atendimentos por Mês</h3>
            <p className={styles.graficoDesc}>Evolução do número de atendimentos ao longo do tempo.</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={atendimentosPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="mes" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #00c6ff', borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="total" stroke="#00c6ff" strokeWidth={2} dot={{ fill: '#00c6ff' }} />
              </LineChart>
            </ResponsiveContainer>
            <p className={styles.interpretacao}>
              {atendimentosPorMes.length > 0
                ? 'A série temporal mostra a tendência de atendimentos ao longo dos meses, permitindo identificar períodos de maior demanda.'
                : 'Sem dados disponíveis.'}
            </p>
          </div>

        </div>

        {/* Pizza */}
        {servicosMaisProcurados.length > 0 && (
          <div className={styles.graficoCard} style={{ maxWidth: 500, margin: '24px auto' }}>
            <h3 className={styles.graficoTitulo}>Serviços Mais Procurados (Pizza)</h3>
            <p className={styles.graficoDesc}>Variável qualitativa: distribuição dos atendimentos por tipo de serviço.</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={servicosMaisProcurados}
                  dataKey="total"
                  nameKey="nome"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ nome, percent }) => `${nome} (${(percent * 100).toFixed(0)}%)`}
                >
                  {servicosMaisProcurados.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #D4AF37', borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className={styles.interpretacao}>
              {servicosMaisProcurados.length > 0
                ? 'A distribuição mostra quais serviços são mais procurados pelos clientes, com base na frequência de atendimentos.'
                : 'Sem dados disponíveis.'}
            </p>
          </div>
        )}
      </section>

      {/* ── MEDIDAS DE TENDÊNCIA CENTRAL ── */}
      <section className={styles.estatisticasSection}>
        <h2 className={styles.sectionTitle}>Medidas de Tendência Central</h2>
        <p className={styles.interpretacao}>
          Média: soma dos valores dividida pelo total. Mediana: valor central dos dados ordenados. Moda: valor(es) que mais se repetem.
        </p>
        <div className={styles.tabelaWrapper}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Variável</th>
                <th>Média</th>
                <th>Mediana</th>
                <th>Moda</th>
                <th>Interpretação</th>
              </tr>
            </thead>
            <tbody>
              {tendencias.map((t, i) => (
                <tr key={i}>
                  <td><strong>{t.variavel}</strong></td>
                  <td>{t.variavel.includes('Qualitativa') ? '—' : t.media.toFixed(2)}</td>
                  <td>{t.variavel.includes('Qualitativa') ? '—' : t.mediana.toFixed(2)}</td>
                  <td>{t.moda || '—'}</td>
                  <td className={styles.interpretacaoCell}>{t.interpretacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── MEDIDAS DE VARIABILIDADE ── */}
      <section className={styles.estatisticasSection}>
        <h2 className={styles.sectionTitle}>Medidas de Variabilidade</h2>
        <p className={styles.interpretacao}>
          Amplitude total: diferença entre o maior e o menor valor. Variância: média dos quadrados dos desvios em relação à média.
          Desvio padrão: raiz quadrada da variância (mesma unidade dos dados). Coeficiente de Variação (CV): desvio padrão dividido pela média (em %).
        </p>
        <div className={styles.tabelaWrapper}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Variável</th>
                <th>Amplitude Total</th>
                <th>Variância</th>
                <th>Desvio Padrão</th>
                <th>CV (%)</th>
                <th>Interpretação</th>
              </tr>
            </thead>
            <tbody>
              {variabilidades.map((v, i) => (
                <tr key={i}>
                  <td><strong>{v.variavel}</strong></td>
                  <td>{v.amplitude.toFixed(2)}</td>
                  <td>{v.variancia.toFixed(2)}</td>
                  <td>{v.desvioPadrao.toFixed(2)}</td>
                  <td>{v.cv.toFixed(2)}%</td>
                  <td className={styles.interpretacaoCell}>{v.interpretacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {variabilidades.length >= 3 && (
          <div className={styles.cvDestaque}>
            <p>
              <strong>Análise do CV:</strong> A variável com <strong>maior variabilidade</strong> é "
              {variabilidades.reduce((a, b) => (a.cv > b.cv ? a : b)).variavel}" (CV = {variabilidades.reduce((a, b) => (a.cv > b.cv ? a : b)).cv.toFixed(2)}%).
              A variável com <strong>menor variabilidade</strong> é "
              {variabilidades.reduce((a, b) => (a.cv < b.cv ? a : b)).variavel}" (CV = {variabilidades.reduce((a, b) => (a.cv < b.cv ? a : b)).cv.toFixed(2)}%).
            </p>
          </div>
        )}
      </section>

      <section className={styles.atalhos}>
        <h2 className={styles.atalhosTitulo}>Acesso Rápido</h2>
        <div className={styles.atalhoGrid}>
          <a href="/equipe" className={styles.atalho}>
            <IconFuncionarios size={18} />
            Gerenciar Equipe
          </a>
          <a href="/cadastro-funcionario" className={styles.atalho}>
            <IconFuncionarios size={18} />
            Cadastrar Funcionário
          </a>
          <a href="/estoque" className={styles.atalho}>
            <IconProdutos size={18} />
            Gerenciar Estoque
          </a>
          <a href="/agenda" className={styles.atalho}>
            <IconAtendimentos size={18} />
            Ver Agenda
          </a>
          <a href="/servicos" className={styles.atalho}>
            <IconServicos size={18} />
            Serviços
          </a>
        </div>
      </section>
    </main>
  );
}
