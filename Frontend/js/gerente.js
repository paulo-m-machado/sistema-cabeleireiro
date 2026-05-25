// gerente.js — Painel do Gerente · Sebastian Cabelo e Estética
// Gráficos da PI de Estatística: busca dados reais de /estatisticas/*
// com fallback automático para dados de demonstração caso a API esteja vazia.

document.addEventListener('DOMContentLoaded', () => {

  // ── Animação das barras de desempenho semanal ────────────────────────────
  document.querySelectorAll('.bar-fill').forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = w; }, 120);
  });

  // ════════════════════════════════════════════════════════════════════════
  // DADOS DE FALLBACK — 12 meses de operação (usados se a API retornar vazio)
  // ════════════════════════════════════════════════════════════════════════
  const fallbackMeses = [
    { mes:'Jan', fat:18500, atend:142 }, { mes:'Fev', fat:21200, atend:158 },
    { mes:'Mar', fat:19800, atend:149 }, { mes:'Abr', fat:23400, atend:171 },
    { mes:'Mai', fat:22100, atend:163 }, { mes:'Jun', fat:20300, atend:152 },
    { mes:'Jul', fat:17900, atend:138 }, { mes:'Ago', fat:24600, atend:179 },
    { mes:'Set', fat:26800, atend:193 }, { mes:'Out', fat:25100, atend:184 },
    { mes:'Nov', fat:28900, atend:207 }, { mes:'Dez', fat:31200, atend:221 },
  ];
  const fallbackPizza = {
    labels:  ['Corte', 'Coloração', 'Escova', 'Manicure', 'Estética'],
    valores: [32, 29, 20, 13, 6],
  };

  // ════════════════════════════════════════════════════════════════════════
  // CONFIGURAÇÃO GLOBAL DO CHART.JS
  // ════════════════════════════════════════════════════════════════════════
  Chart.defaults.color                          = '#aaa';
  Chart.defaults.font.family                    = "'Open Sans', sans-serif";
  Chart.defaults.font.size                      = 12;
  Chart.defaults.plugins.legend.labels.color   = '#ccc';
  Chart.defaults.plugins.legend.labels.padding = 16;

  const gridColor = 'rgba(255,255,255,0.06)';
  const axisColor = 'rgba(255,255,255,0.15)';

  // ════════════════════════════════════════════════════════════════════════
  // TENDÊNCIA LINEAR — mínimos quadrados
  // ════════════════════════════════════════════════════════════════════════
  function tendenciaLinear(valores) {
    const n     = valores.length;
    const xs    = valores.map((_, i) => i);
    const somaX  = xs.reduce((a, b) => a + b, 0);
    const somaY  = valores.reduce((a, b) => a + b, 0);
    const somaXY = xs.reduce((s, x, i) => s + x * valores[i], 0);
    const somaX2 = xs.reduce((s, x) => s + x * x, 0);
    const b      = (n * somaXY - somaX * somaY) / (n * somaX2 - somaX ** 2);
    const a      = (somaY - b * somaX) / n;
    return xs.map(x => parseFloat((a + b * x).toFixed(1)));
  }

  // ════════════════════════════════════════════════════════════════════════
  // GRÁFICO 1 — DISPERSÃO (Variáveis Quantitativas Contínuas)
  // ════════════════════════════════════════════════════════════════════════
  function renderDispersao(dados, eixoX, eixoY) {
    new Chart(document.getElementById('chartDispersao'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Registros',
          data:  dados,
          backgroundColor: 'rgba(0,198,255,0.65)',
          borderColor:     '#D4AF37',
          borderWidth:     1.5,
          pointRadius:     8,
          pointHoverRadius: 11,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            borderColor: '#333',
            borderWidth: 1,
            callbacks: {
              label: ctx => [
                `${eixoX}: ${ctx.raw.x}`,
                `${eixoY}: ${ctx.raw.y > 100
                  ? 'R$ ' + Number(ctx.raw.y).toLocaleString('pt-BR')
                  : ctx.raw.y}`,
              ],
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: eixoX, color: '#888' },
            grid:  { color: gridColor },
            border: { color: axisColor },
            ticks:  { color: '#888' },
          },
          y: {
            title: { display: true, text: eixoY, color: '#888' },
            grid:  { color: gridColor },
            border: { color: axisColor },
            ticks:  {
              color: '#888',
              callback: v => v > 1000 ? 'R$' + (v / 1000).toFixed(0) + 'k' : v,
            },
          },
        },
      },
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // GRÁFICO 2 — SÉRIE TEMPORAL com linha de tendência
  // ════════════════════════════════════════════════════════════════════════
  function renderTemporal(labels, valores, eixoY) {
    new Chart(document.getElementById('chartTemporal'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Real',
            data:  valores,
            borderColor:     '#D4AF37',
            backgroundColor: 'rgba(212,175,55,0.10)',
            borderWidth: 3,
            tension:     0.42,
            fill:        true,
            pointRadius: 5,
            pointBackgroundColor: '#D4AF37',
            pointBorderColor:     '#0f0f0f',
            pointBorderWidth:     2,
            pointHoverRadius:     8,
          },
          {
            label: 'Tendência',
            data:  tendenciaLinear(valores),
            borderColor: '#ff6363',
            borderDash:  [8, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill:        false,
            tension:     0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            backgroundColor: '#1a1a1a',
            borderColor:     '#333',
            borderWidth:     1,
          },
        },
        scales: {
          x: { grid: { color: gridColor }, border: { color: axisColor }, ticks: { color: '#888' } },
          y: {
            title: { display: true, text: eixoY, color: '#888' },
            grid:  { color: gridColor },
            border: { color: axisColor },
            ticks:  { color: '#888' },
          },
        },
      },
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // GRÁFICO 3 — PIZZA / DOUGHNUT (Variável Qualitativa)
  // ════════════════════════════════════════════════════════════════════════
  function renderPizza(labels, valores) {
    new Chart(document.getElementById('chartPizza'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: valores,
          backgroundColor: [
            'rgba(88,79,255,0.85)',
            'rgba(0,198,255,0.85)',
            'rgba(212,175,55,0.85)',
            'rgba(46,204,113,0.85)',
            'rgba(255,99,99,0.85)',
            'rgba(255,165,0,0.85)',
            'rgba(200,200,200,0.7)',
          ],
          borderColor: '#0f0f0f',
          borderWidth: 3,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'right',
            labels:   { padding: 14, font: { size: 12 } },
          },
          tooltip: {
            backgroundColor: '#1a1a1a',
            borderColor: '#333',
            borderWidth: 1,
            callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` },
          },
        },
      },
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // CARREGA DADOS DA API — com fallback automático
  // ════════════════════════════════════════════════════════════════════════
  Promise.allSettled([
    fetch('/estatisticas/dispersao').then(r  => r.ok  ? r.json()  : Promise.reject()),
    fetch('/estatisticas/serie-temporal').then(r => r.ok ? r.json() : Promise.reject()),
    fetch('/estatisticas/pizza').then(r => r.ok ? r.json() : Promise.reject()),
  ]).then(([rDisp, rTemp, rPizza]) => {

    // ── Gráfico 1: Dispersão ─────────────────────────────────────────────
    if (rDisp.status === 'fulfilled' && rDisp.value?.dados?.length > 0) {
      renderDispersao(rDisp.value.dados, rDisp.value.eixoX, rDisp.value.eixoY);
    } else {
      // Fallback: faturamento × atendimentos dos dados demo
      renderDispersao(
        fallbackMeses.map(d => ({ x: d.atend, y: d.fat })),
        'Atendimentos / mês',
        'Faturamento (R$)',
      );
    }

    // ── Gráfico 2: Série Temporal ─────────────────────────────────────────
    if (rTemp.status === 'fulfilled' && rTemp.value?.labels?.length > 0) {
      renderTemporal(rTemp.value.labels, rTemp.value.valores, rTemp.value.eixoY);
    } else {
      renderTemporal(
        fallbackMeses.map(d => d.mes),
        fallbackMeses.map(d => d.fat),
        'Faturamento (R$)',
      );
    }

    // ── Gráfico 3: Pizza ──────────────────────────────────────────────────
    if (rPizza.status === 'fulfilled' && rPizza.value?.labels?.length > 0) {
      renderPizza(rPizza.value.labels, rPizza.value.valores);
    } else {
      renderPizza(fallbackPizza.labels, fallbackPizza.valores);
    }
  });
});
