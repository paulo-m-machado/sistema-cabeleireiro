import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import styles from './Agenda.module.css';

interface Funcionario {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  nome: string;
}

interface Atendimento {
  id: number;
  horario: string;
  funcionario_id?: number;
  funcionario?: Funcionario;
  funcionarios?: Funcionario;
  cliente_id?: number;
  cliente?: { nome: string; contato?: string };
  clientes?: { nome: string; contato?: string };
  servico_id?: number;
  servico?: { nome: string };
  servicos?: { nome: string };
}

export function Agenda() {
  const { user, isGerente } = useAuth();
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filtroProfissional, setFiltroProfissional] = useState(() => isGerente ? 'todos' : (user?.nome || 'todos'));
  const [mesFiltro, setMesFiltro] = useState(() => new Date().toISOString().substring(0, 7));
  const [diaFiltro, setDiaFiltro] = useState('');
  const [modalAtendimento, setModalAtendimento] = useState<Atendimento | null>(null);
  const [editForm, setEditForm] = useState({ funcionario_id: '', servico_id: '', horario: '' });

  function utcParaLocal(utcStr: string) {
    const d = new Date(utcStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
  }

  useEffect(() => {
    async function load() {
      try {
        const [resA, resF, resS] = await Promise.all([
          api.get('/atendimentos'),
          api.get('/funcionarios'),
          api.get('/servicos'),
        ]);
        setAtendimentos(resA.data);
        setFuncionarios(resF.data);
        setServicos(resS.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const horarios = [];
  for (let h = 6; h <= 19; h++) {
    horarios.push(`${String(h).padStart(2, '0')}:00`);
    horarios.push(`${String(h).padStart(2, '0')}:15`);
    horarios.push(`${String(h).padStart(2, '0')}:30`);
    horarios.push(`${String(h).padStart(2, '0')}:45`);
  }

  // Estatísticas
  const atendimentosFiltrados = atendimentos.filter(a => {
    if (!a.horario) return false;
    const nomeFunc = a.funcionarios?.nome || a.funcionario?.nome || '';
    const profOk = filtroProfissional === 'todos' || nomeFunc === filtroProfissional;
    const mesOk = a.horario.startsWith(mesFiltro);
    const diaOk = !diaFiltro || a.horario.startsWith(diaFiltro);
    return profOk && mesOk && diaOk;
  });

  const hoje = new Date().toISOString().split('T')[0];
  const countHoje = atendimentosFiltrados.filter(a => {
    if (!a.horario) return false;
    return a.horario.startsWith(hoje);
  }).length;

  function abrirModalAtendimento(a: Atendimento) {
    setModalAtendimento(a);
    setEditForm({
      funcionario_id: String(a.funcionario_id ?? ''),
      servico_id: String(a.servico_id ?? ''),
      horario: a.horario ? utcParaLocal(a.horario) : '',
    });
  }

  async function salvarEdicao() {
    if (!modalAtendimento) return;
    try {
      const body: any = {};
      if (editForm.funcionario_id) body.funcionario_id = Number(editForm.funcionario_id);
      if (editForm.servico_id) body.servico_id = Number(editForm.servico_id);
      if (editForm.horario) body.horario = new Date(editForm.horario).toISOString();

      await api.put(`/atendimentos/${modalAtendimento.id}`, body);
      setModalAtendimento(null);
      const resA = await api.get('/atendimentos');
      setAtendimentos(resA.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao editar agendamento.');
    }
  }

  async function cancelarAtendimento() {
    if (!modalAtendimento) return;
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;
    try {
      await api.delete(`/atendimentos/${modalAtendimento.id}`);
      setModalAtendimento(null);
      const resA = await api.get('/atendimentos');
      setAtendimentos(resA.data);
    } catch (err) {
      alert('Erro ao excluir agendamento.');
    }
  }

  async function concluirAtendimento() {
    if (!modalAtendimento) return;
    if (!window.confirm('Confirmar conclusão deste atendimento?')) return;
    try {
      await api.delete(`/atendimentos/${modalAtendimento.id}`);
      setModalAtendimento(null);
      const resA = await api.get('/atendimentos');
      setAtendimentos(resA.data);
    } catch (err) {
      alert('Erro ao concluir atendimento.');
    }
  }

  // Render grid
  return (
    <div className={`${styles.body1} page-bg-image`}>
      <div className={styles['agenda-container']}>
        <div className={styles['agenda-header-section']}>
          <div className={styles['header-left']}>
            <h1>Agenda Semanal</h1>
            <p className={styles.subtitle}>Sebastian Cabelo e Estética &mdash; Área Profissional</p>
          </div>
          <div className={styles['header-right']}>
            <div className={styles['badge-count']}>
              <span>{atendimentosFiltrados.length}</span> agendamentos
            </div>
            <div className={styles['filter-group']}>
              <label>Mês: </label>
              <input 
                type="month" 
                className={styles['month-input']}
                value={mesFiltro}
                onChange={e => { setMesFiltro(e.target.value); setDiaFiltro(''); }}
              />
            </div>
            <div className={styles['filter-group']}>
              <label>Dia: </label>
              <input 
                type="date" 
                className={styles['month-input']}
                value={diaFiltro}
                onChange={e => setDiaFiltro(e.target.value)}
              />
            </div>
            {isGerente && (
              <div className={styles['filter-group']}>
                <label>Profissional: </label>
                <select 
                  value={filtroProfissional} 
                  onChange={e => setFiltroProfissional(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  {funcionarios.map(f => (
                    <option key={f.id} value={f.nome}>{f.nome}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className={styles['legenda-profissionais']}>
          <div className={styles['legenda-item']}><span className={`${styles['legenda-cor']} ${styles['color-joao']}`}></span>João</div>
          <div className={styles['legenda-item']}><span className={`${styles['legenda-cor']} ${styles['color-maria']}`}></span>Maria</div>
          <div className={styles['legenda-item']}><span className={`${styles['legenda-cor']} ${styles['color-carlos']}`}></span>Carlos</div>
          <div className={styles['legenda-item']}><span className={`${styles['legenda-cor']} ${styles['color-ana']}`}></span>Ana</div>
        </div>

        <div className={styles['stats-bar']}>
          <div className={styles['stat-card']}>
            <span className={styles['stat-icon']}>📋</span>
            <span className={styles['stat-value']}>{atendimentosFiltrados.length}</span>
            <span className={styles['stat-label']}>Total</span>
          </div>
          <div className={styles['stat-card']}>
            <span className={styles['stat-icon']}>📅</span>
            <span className={styles['stat-value']}>{countHoje}</span>
            <span className={styles['stat-label']}>Hoje</span>
          </div>
        </div>

        <div className={styles['agenda-wrapper']}>
          <div className={styles['agenda-grid']}>
            {/* Corner Cell */}
            <div className={styles['grid-header']}>Hora</div>
            {/* Days headers */}
            {diasSemana.map(d => (
              <div key={d} className={styles['grid-header']}>{d}</div>
            ))}
            
            {/* Rows by Time */}
            {horarios.map(hora => (
              <React.Fragment key={hora}>
                <div className={styles['time-label']}>{hora}</div>
                {diasSemana.map((dia, dIdx) => {
                  // Mocks para alinhar com o protótipo: o protótipo provavelmente não atava à data real
                  // Aqui filtramos pelo horário correspondente (a.horario.includes(hora))
                  // Isso é uma aproximação para a demo do grid.
                  const cellAtends = atendimentosFiltrados.filter(a => {
                     if (!a.horario) return false;
                     const aDate = new Date(a.horario);
                     const h = String(aDate.getUTCHours()).padStart(2, '0') + ':' + String(aDate.getUTCMinutes()).padStart(2, '0');
                     const aDay = aDate.getUTCDay();
                     const mappedDay = aDay === 0 ? 0 : aDay - 1;
                     return h === hora && mappedDay === dIdx;
                  });

                  return (
                    <div key={`${hora}-${dia}`} className={styles['grid-cell']}>
                      {cellAtends.map(a => {
                         const profName = a.funcionarios?.nome || a.funcionario?.nome || '';
                         const clientName = a.clientes?.nome || a.cliente?.nome || '';
                         const clientPhone = a.clientes?.contato || a.cliente?.contato || '';
                         const serviceName = a.servicos?.nome || a.servico?.nome || '';
                         const colorClass = styles[`Appointment-${profName}`] || '';

                         const wpLink = clientPhone 
                           ? `https://wa.me/55${clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${clientName}, passando para confirmar seu agendamento de ${serviceName} com ${profName} às ${hora}!`)}`
                           : '#';

                          const timeActual = a.horario ? `${String(new Date(a.horario).getUTCHours()).padStart(2, '0')}:${String(new Date(a.horario).getUTCMinutes()).padStart(2, '0')}` : hora;
                          return (
                            <div key={a.id} className={`${styles['appointment-card']} ${colorClass}`} onClick={() => abrirModalAtendimento(a)}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className={styles['time-slot']}>{timeActual}</span>
                                {clientPhone && (
                                  <a href={wpLink} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none' }} title="Avisar no WhatsApp" onClick={e => e.stopPropagation()}>
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                                  </a>
                                )}
                              </div>
                              <strong>{profName}</strong>
                              <span className={styles['client-name']}>{clientName}</span>
                              <span className={styles['service-name']}>{serviceName}</span>
                            </div>
                         );
                      })}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {modalAtendimento && (
        <div className={styles['modal-overlay']} onClick={() => setModalAtendimento(null)}>
          <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3>Detalhes do Agendamento</h3>
              <button className={styles['modal-close']} onClick={() => setModalAtendimento(null)}>&times;</button>
            </div>
            <div className={styles['modal-body']}>
              <p><strong>Cliente:</strong> {modalAtendimento.clientes?.nome || modalAtendimento.cliente?.nome}</p>
              <p><strong>Contato:</strong> {modalAtendimento.clientes?.contato || modalAtendimento.cliente?.contato || '-'}</p>
              <p><strong>Serviço atual:</strong> {modalAtendimento.servicos?.nome || modalAtendimento.servico?.nome || '-'}</p>
              <p><strong>Profissional atual:</strong> {modalAtendimento.funcionarios?.nome || modalAtendimento.funcionario?.nome || '-'}</p>
              <hr className={styles['modal-divider']} />
              <h4>Alterar Agendamento</h4>
              <div className={styles['modal-form']}>
                <div className={styles['modal-field']}>
                  <label>Profissional</label>
                  <select value={editForm.funcionario_id} onChange={e => setEditForm({...editForm, funcionario_id: e.target.value})}>
                    <option value="">Selecione...</option>
                    {funcionarios.map(f => (
                      <option key={f.id} value={f.id}>{f.nome}</option>
                    ))}
                  </select>
                </div>
                <div className={styles['modal-field']}>
                  <label>Serviço</label>
                  <select value={editForm.servico_id} onChange={e => setEditForm({...editForm, servico_id: e.target.value})}>
                    <option value="">Selecione...</option>
                    {servicos.map(s => (
                      <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                  </select>
                </div>
                <div className={styles['modal-field']}>
                  <label>Data e Hora</label>
                  <input type="datetime-local" value={editForm.horario} onChange={e => setEditForm({...editForm, horario: e.target.value})} />
                </div>
              </div>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['btn-cancelar']} onClick={cancelarAtendimento}>Cancelar Atendimento</button>
              <button className={styles['btn-concluir']} onClick={concluirAtendimento}>Concluir Atendimento</button>
              <button className={styles['btn-salvar']} onClick={salvarEdicao}>Salvar Alteração</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
