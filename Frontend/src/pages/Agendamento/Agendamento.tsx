import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import styles from './Agendamento.module.css';

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number | string;
  duracao_estimada: number;
}

interface Kit {
  id: number;
  nome: string;
  descricao: string;
  preco: number | string;
}

interface SelectableItem {
  id: number;
  nome: string;
  descricao: string;
  preco: number | string;
  duracao_estimada?: any;
  tipo: 'servico' | 'kit';
}

interface Funcionario {
  id: number;
  nome: string;
  funcao: string;
}

interface Cliente {
  id: number;
  nome: string;
  contato: string;
  email: string;
  descricao: string;
}

function formatDuracao(duracao: any): string {
  if (!duracao) return '0';
  if (typeof duracao === 'number') return String(duracao);
  if (typeof duracao === 'string') {
    if (duracao.includes('T')) {
      const timePart = duracao.split('T')[1];
      const [h, m] = timePart.split(':');
      const totalMinutes = parseInt(h, 10) * 60 + parseInt(m, 10);
      return String(totalMinutes);
    }
    if (duracao.includes(':')) {
      const [h, m] = duracao.split(':');
      const totalMinutes = parseInt(h, 10) * 60 + parseInt(m, 10);
      return String(totalMinutes);
    }
  }
  return String(duracao);
}

export function Agendamento() {
  const [etapa, setEtapa] = useState(1);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  
  const [itemSelecionado, setItemSelecionado] = useState<SelectableItem | null>(null);
  const [profissionaisSelecionados, setProfissionaisSelecionados] = useState<Funcionario[]>([]);
  
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteObs, setClienteObs] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  const [abaCliente, setAbaCliente] = useState<'novo' | 'existente'>('novo');
  const [pesquisaCliente, setPesquisaCliente] = useState('');
  const [clientesEncontrados, setClientesEncontrados] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  const isKit = itemSelecionado?.tipo === 'kit';

  useEffect(() => {
    api.get('/servicos').then(r => setServicos(r.data));
    api.get('/kits').then(r => setKits(r.data));
    api.get('/funcionarios').then(r => {
      const profissionais = r.data.filter((f: any) => {
        const funcao = (f.funcao || '').toLowerCase();
        return !funcao.includes('gerente') && !funcao.includes('recepcionista');
      });
      setFuncionarios(profissionais);
    });
  }, []);

  useEffect(() => {
    if (dataSelecionada && profissionaisSelecionados.length > 0) {
      setHorarioSelecionado('');
      api.get('/atendimentos').then(r => {
        const atendimentos: any[] = r.data;
        const idsProfissionais = new Set(profissionaisSelecionados.map(p => p.id));
        const ocupados = new Set<string>();
        atendimentos.forEach(a => {
          if (!a.horario || !idsProfissionais.has(a.funcionario_id)) return;
          const aDate = new Date(a.horario);
          const isoDate = aDate.toISOString().split('T')[0];
          if (isoDate === dataSelecionada) {
            const time = `${String(aDate.getUTCHours()).padStart(2, '0')}:${String(aDate.getUTCMinutes()).padStart(2, '0')}`;
            ocupados.add(time);
          }
        });
        setHorariosOcupados(Array.from(ocupados));
      });
    }
  }, [dataSelecionada, profissionaisSelecionados]);

  function handleSelectItem(item: SelectableItem) {
    setItemSelecionado(item);
    setProfissionaisSelecionados([]);
  }

  function handleToggleProfissional(f: Funcionario) {
    if (isKit) {
      setProfissionaisSelecionados(prev =>
        prev.some(p => p.id === f.id)
          ? prev.filter(p => p.id !== f.id)
          : [...prev, f]
      );
    } else {
      setProfissionaisSelecionados([f]);
    }
  }

  function getCategoria(nome: string) {
    const n = nome.toLowerCase();
    if (n.includes('corte') || n.includes('escova') || n.includes('coloração') || n.includes('hidratação')) return 'Cabelos';
    if (n.includes('limpeza') || n.includes('peeling') || n.includes('estética')) return 'Estética';
    if (n.includes('manicure') || n.includes('pedicure') || n.includes('unhas')) return 'Unhas';
    return 'Outros';
  }

  const itensVisiveis: SelectableItem[] = [
    ...servicos.map(s => ({ ...s, tipo: 'servico' as const })),
    ...kits.map(k => ({ ...k, tipo: 'kit' as const })),
  ].filter(i => {
    if (categoriaAtiva === 'Todos') return true;
    if (i.tipo === 'kit') return categoriaAtiva === 'Outros';
    return getCategoria(i.nome) === categoriaAtiva;
  });

  const getHorariosGerados = () => {
    const horas = [];
    for (let h = 6; h <= 19; h++) {
      horas.push(`${String(h).padStart(2, '0')}:00`);
      horas.push(`${String(h).padStart(2, '0')}:15`);
      horas.push(`${String(h).padStart(2, '0')}:30`);
      horas.push(`${String(h).padStart(2, '0')}:45`);
    }
    return horas;
  };

  const getAvatarColorClass = (idx: number) => {
    const i = idx % 4;
    return styles[`avatar-${i}`];
  };

  async function buscarClientes() {
    if (!pesquisaCliente.trim()) return;
    try {
      const { data } = await api.get(`/clientes?nome=${encodeURIComponent(pesquisaCliente.trim())}`);
      setClientesEncontrados(data);
    } catch {
      setClientesEncontrados([]);
    }
  }

  async function confirmarAgendamento() {
    if (abaCliente === 'novo' && (!clienteNome || !clienteTelefone)) {
      alert("Preencha os dados obrigatórios.");
      return;
    }
    if (abaCliente === 'existente' && !clienteSelecionado) {
      alert("Selecione um cliente existente.");
      return;
    }
    setSubmitting(true);
    try {
      let cliente_id: number;

      if (abaCliente === 'novo') {
        const cRes = await api.post('/clientes', {
          nome: clienteNome,
          contato: clienteTelefone,
          email: clienteEmail || undefined,
          descricao: clienteObs,
          funcionario_id: profissionaisSelecionados[0]!.id,
        });
        cliente_id = cRes.data.id;
      } else {
        cliente_id = clienteSelecionado!.id;
      }

      const dateTimeIso = `${dataSelecionada}T${horarioSelecionado}:00.000Z`;

      const promises = profissionaisSelecionados.map(prof => {
        const body: any = {
          funcionario_id: prof.id,
          cliente_id,
          horario: dateTimeIso,
        };
        if (isKit) {
          body.kit_id = itemSelecionado!.id;
        } else {
          body.servico_id = itemSelecionado!.id;
        }
        return api.post('/atendimentos', body);
      });

      await Promise.all(promises);

      setEtapa(5);
    } catch (err) {
      alert("Erro ao confirmar agendamento");
    } finally {
      setSubmitting(false);
    }
  }

  function renderStepClass(s: number) {
    if (etapa > s) return `${styles.step} ${styles.completed}`;
    if (etapa === s) return `${styles.step} ${styles.active}`;
    return styles.step;
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className={`${styles['page-background']} page-bg-image`}>
      <div className={styles['agendamento-container']}>
        {/* Stepper */}
        <div className={styles.stepper}>
          <div className={renderStepClass(1)}>
            <div className={styles['step-number']}>1</div>
            <div className={styles['step-text']}>Serviço</div>
          </div>
          <div className={styles['step-separator']}></div>
          <div className={renderStepClass(2)}>
            <div className={styles['step-number']}>2</div>
            <div className={styles['step-text']}>Profissional</div>
          </div>
          <div className={styles['step-separator']}></div>
          <div className={renderStepClass(3)}>
            <div className={styles['step-number']}>3</div>
            <div className={styles['step-text']}>Data & Hora</div>
          </div>
          <div className={styles['step-separator']}></div>
          <div className={renderStepClass(4)}>
            <div className={styles['step-number']}>4</div>
            <div className={styles['step-text']}>Confirmação</div>
          </div>
        </div>

        <div className={styles['etapas-container']}>
          {/* Etapa 1: Serviço */}
          {etapa === 1 && (
            <div className={`${styles.etapa} ${styles.active}`}>
              <h2>Escolha o Serviço ou Kit</h2>
              <div className={styles.filters}>
                {['Todos', 'Cabelos', 'Estética', 'Unhas', 'Outros'].map(cat => (
                  <button 
                    key={cat} 
                    className={`${styles['filter-btn']} ${categoriaAtiva === cat ? styles.active : ''}`}
                    onClick={() => setCategoriaAtiva(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className={styles['servicos-grid']}>
                {itensVisiveis.map(item => {
                  const isSelected = itemSelecionado?.id === item.id && itemSelecionado?.tipo === item.tipo;
                  const notSelected = itemSelecionado && !isSelected;
                  return (
                    <div 
                      key={`${item.tipo}-${item.id}`}
                      className={`${styles['service-card']} ${isSelected ? styles.selectedCard : ''} ${notSelected ? styles.notSelectedCard : ''} ${item.tipo === 'kit' ? styles['kit-card'] : ''}`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className={styles['card-icon-check']}>✓</div>
                      <h3>{item.nome}</h3>
                      {item.tipo === 'kit' && <span className={styles['badge-kit']}>Kit</span>}
                      <p>{item.descricao}</p>
                      <div className={styles['service-badges']}>
                        <span className={styles['badge-price']}>R$ {Number(item.preco).toFixed(2)}</span>
                        {item.tipo === 'servico' && (
                          <span className={styles['badge-time']}>{formatDuracao(item.duracao_estimada)} min</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className={styles['botoes-navegacao']}>
                <div></div>
                <button 
                  className={styles['btn-primario']} 
                  disabled={!itemSelecionado}
                  onClick={() => setEtapa(2)}
                >
                  Próximo &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Etapa 2: Profissional */}
          {etapa === 2 && (
            <div className={`${styles.etapa} ${styles.active}`}>
              <h2>
                {isKit ? 'Escolha os Profissionais' : 'Escolha o Profissional'}
              </h2>
              {isKit && (
                <p style={{ color: '#D4AF37', marginBottom: '15px', fontSize: '0.9rem' }}>
                  Selecione um ou mais profissionais para este kit
                </p>
              )}
              <div className={styles['profissionais-grid']}>
                {funcionarios.map((f, i) => {
                  const isSelected = profissionaisSelecionados.some(p => p.id === f.id);
                  const notSelected = profissionaisSelecionados.length > 0 && !isSelected;
                  const inits = f.nome.substring(0,2).toUpperCase();
                  return (
                    <div 
                      key={f.id} 
                      className={`${styles['professional-card']} ${isSelected ? styles.selectedCard : ''} ${notSelected && !isKit ? styles.notSelectedCard : ''}`}
                      onClick={() => handleToggleProfissional(f)}
                    >
                      <div className={styles['card-icon-check']}>✓</div>
                      <div className={`${styles.avatar} ${getAvatarColorClass(i)}`}>{inits}</div>
                      <h3>{f.nome}</h3>
                      <p>{f.funcao || 'Profissional'}</p>
                      <div className={styles['badge-available']}>Disponível</div>
                    </div>
                  )
                })}
              </div>
              
              <div className={styles['botoes-navegacao']}>
                <button className={styles['btn-secundario']} onClick={() => setEtapa(1)}>&larr; Voltar</button>
                <button 
                  className={styles['btn-primario']} 
                  disabled={profissionaisSelecionados.length === 0}
                  onClick={() => setEtapa(3)}
                >
                  Próximo &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Etapa 3: Data e Horário */}
          {etapa === 3 && (
            <div className={`${styles.etapa} ${styles.active}`}>
              <h2>Escolha a Data e o Horário</h2>
              <div className={styles['data-hora-container']}>
                <div className={styles['data-section']}>
                  <label htmlFor="data-agendamento">Data:</label>
                  <input 
                    type="date" 
                    id="data-agendamento" 
                    className={styles['input-dark']}
                    min={minDate}
                    value={dataSelecionada}
                    onChange={e => setDataSelecionada(e.target.value)}
                  />
                </div>
                <div className={styles['horarios-section']}>
                  <label>Horários Disponíveis:</label>
                  {isKit && (
                    <p style={{ color: '#D4AF37', fontSize: '0.85rem', marginBottom: '8px' }}>
                      Exibindo horários em que todos os profissionais estão disponíveis
                    </p>
                  )}
                  <div className={styles['horarios-grid']}>
                    {!dataSelecionada && <p className={styles['placeholder-text']}>Selecione uma data primeiro.</p>}
                    {dataSelecionada && getHorariosGerados().map(h => {
                      const isOcupado = horariosOcupados.includes(h);
                      const isSelecionado = horarioSelecionado === h;
                      return (
                        <div 
                          key={h}
                          className={`${styles['chip-horario']} ${isOcupado ? styles.ocupado : ''} ${isSelecionado ? styles.selecionado : ''}`}
                          onClick={() => {
                            if (!isOcupado) setHorarioSelecionado(h);
                          }}
                        >
                          {h}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className={styles['botoes-navegacao']}>
                <button className={styles['btn-secundario']} onClick={() => setEtapa(2)}>&larr; Voltar</button>
                <button 
                  className={styles['btn-primario']} 
                  disabled={!dataSelecionada || !horarioSelecionado}
                  onClick={() => setEtapa(4)}
                >
                  Próximo &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Etapa 4: Confirmação */}
          {etapa === 4 && (
            <div className={`${styles.etapa} ${styles.active}`}>
              <h2>Confirmação</h2>
              <div className={styles['confirmacao-grid']}>
                <div className={styles['resumo-card']}>
                  <h3>Resumo do Agendamento</h3>
                  <p><strong>Serviço:</strong> {itemSelecionado?.nome}</p>
                  <p><strong>Profissional(is):</strong> {profissionaisSelecionados.map(p => p.nome).join(', ')}</p>
                  <p><strong>Data:</strong> {dataSelecionada.split('-').reverse().join('/')}</p>
                  <p><strong>Horário:</strong> {horarioSelecionado}</p>
                  <p><strong>Preço:</strong> R$ {Number(itemSelecionado?.preco).toFixed(2)}</p>
                  {itemSelecionado?.tipo === 'servico' && (
                    <p><strong>Duração:</strong> {formatDuracao(itemSelecionado?.duracao_estimada)} min</p>
                  )}
                </div>
                <div className={styles['dados-cliente-form']}>
                  <div className={styles['cliente-tabs']}>
                    <button
                      className={`${styles['cliente-tab']} ${abaCliente === 'novo' ? styles['cliente-tab-active'] : ''}`}
                      onClick={() => { setAbaCliente('novo'); setClienteSelecionado(null); }}
                    >
                      Novo Cliente
                    </button>
                    <button
                      className={`${styles['cliente-tab']} ${abaCliente === 'existente' ? styles['cliente-tab-active'] : ''}`}
                      onClick={() => { setAbaCliente('existente'); }}
                    >
                      Cliente Existente
                    </button>
                  </div>

                  {abaCliente === 'novo' ? (
                    <>
                      <div className={styles['input-group']}>
                        <input 
                          type="text" 
                          placeholder="Nome completo *" 
                          className={styles['input-dark']}
                          value={clienteNome}
                          onChange={e => setClienteNome(e.target.value)}
                        />
                      </div>
                      <div className={styles['input-group']}>
                        <input 
                          type="text" 
                          placeholder="Telefone/WhatsApp *" 
                          className={styles['input-dark']}
                          value={clienteTelefone}
                          onChange={e => setClienteTelefone(e.target.value)}
                        />
                      </div>
                      <div className={styles['input-group']}>
                        <input 
                          type="email" 
                          placeholder="E-mail" 
                          className={styles['input-dark']}
                          value={clienteEmail}
                          onChange={e => setClienteEmail(e.target.value)}
                        />
                      </div>
                      <div className={styles['input-group']}>
                        <textarea 
                          placeholder="Observações/Alergias" 
                          className={styles['input-dark']} 
                          rows={3}
                          value={clienteObs}
                          onChange={e => setClienteObs(e.target.value)}
                        ></textarea>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles['input-group']} style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="Pesquisar cliente pelo nome..." 
                          className={styles['input-dark']}
                          style={{ flex: 1 }}
                          value={pesquisaCliente}
                          onChange={e => { setPesquisaCliente(e.target.value); setClientesEncontrados([]); }}
                          onKeyDown={e => { if (e.key === 'Enter') buscarClientes(); }}
                        />
                        <button 
                          className={styles['btn-buscar']}
                          onClick={buscarClientes}
                        >
                          Buscar
                        </button>
                      </div>

                      {clientesEncontrados.length > 0 && (
                        <div className={styles['clientes-lista']}>
                          {clientesEncontrados.map(c => (
                            <div 
                              key={c.id}
                              className={`${styles['cliente-item']} ${clienteSelecionado?.id === c.id ? styles['cliente-item-selected'] : ''}`}
                              onClick={() => setClienteSelecionado(c)}
                            >
                              <strong>{c.nome}</strong>
                              {c.contato && <span>{c.contato}</span>}
                            </div>
                          ))}
                        </div>
                      )}

                      {clienteSelecionado && (
                        <div className={styles['cliente-selecionado']}>
                          <p><strong>Cliente selecionado:</strong> {clienteSelecionado.nome}</p>
                          {clienteSelecionado.contato && <p><strong>Contato:</strong> {clienteSelecionado.contato}</p>}
                          {clienteSelecionado.email && <p><strong>Email:</strong> {clienteSelecionado.email}</p>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className={styles['botoes-navegacao']}>
                <button className={styles['btn-secundario']} onClick={() => setEtapa(3)}>&larr; Voltar</button>
                <button 
                  className={styles['btn-confirmar']}
                  onClick={confirmarAgendamento}
                  disabled={submitting}
                >
                  {submitting ? 'Confirmando...' : '✓ Confirmar Agendamento'}
                </button>
              </div>
            </div>
          )}

          {/* Tela de Sucesso */}
          {etapa === 5 && (
            <div className={`${styles.etapa} ${styles.active} ${styles['text-center']}`}>
              <h2 style={{ color: '#2ECC71' }}>Agendamento Confirmado!</h2>
              <div className={styles['linha-dourada']}></div>
              <p className={styles['sucesso-subtitulo']}>
                Seu agendamento para {itemSelecionado?.nome} com {profissionaisSelecionados.map(p => p.nome).join(' e ')} foi confirmado para {dataSelecionada.split('-').reverse().join('/')} às {horarioSelecionado}.
              </p>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.5rem' }}>
                {clienteTelefone ? '📱 Uma confirmação será enviada por WhatsApp.' : '⚠️ Informe um telefone para receber confirmação por WhatsApp.'}
              </p>
              <Link to="/" className={`${styles['btn-primario']} ${styles['btn-home-link']}`}>Voltar para a Home</Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
