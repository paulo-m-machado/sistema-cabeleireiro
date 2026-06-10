import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import styles from './Equipe.module.css';

interface Funcionario {
  id: number;
  nome: string;
  funcao: string;
  email: string;
  contato: string;
}

export function Equipe() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [formEdit, setFormEdit] = useState({ nome: '', funcao: '', email: '', contato: '' });

  useEffect(() => {
    carregarEquipe();
  }, []);

  async function carregarEquipe() {
    try {
      const res = await api.get('/funcionarios');
      setFuncionarios(res.data);
    } catch (err) {
      console.error('Erro ao carregar equipe', err);
    }
  }

  function abrirEdicao(f: Funcionario) {
    setEditando(f);
    setFormEdit({ nome: f.nome, funcao: f.funcao || '', email: f.email || '', contato: f.contato || '' });
  }

  async function salvarEdicao() {
    if (!editando) return;
    try {
      await api.put(`/funcionarios/${editando.id}`, formEdit);
      setEditando(null);
      carregarEquipe();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao salvar alterações.');
    }
  }

  async function excluirFuncionario(id: number, nome: string) {
    if (!confirm(`Tem certeza que deseja excluir "${nome}" da equipe?`)) return;
    try {
      await api.delete(`/funcionarios/${id}`);
      carregarEquipe();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao excluir funcionário. Verifique se não há agendamentos vinculados.');
    }
  }

  const getAvatarClass = (i: number) => styles[`avatar-${i % 5}`];
  const getInitials = (nome: string) => nome?.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || '?';

  // Estatísticas
  const totalEquipe = funcionarios.length;
  const totalGerentes = funcionarios.filter(f => f.funcao?.toLowerCase().includes('gerente')).length;
  const totalProfissionais = totalEquipe - totalGerentes;

  return (
    <div className={`${styles['equipe-page']} page-bg-image`}>
      <div className={styles['equipe-container']}>

        {/* Header */}
        <div className={styles['equipe-header']}>
          <div className={styles['header-left']}>
            <h1>👥 Gerenciar Equipe</h1>
            <p>Visualize, edite e gerencie os membros do seu salão</p>
          </div>
          <Link to="/cadastro-funcionario" className={styles['btn-novo']}>
            + Novo Funcionário
          </Link>
        </div>

        {/* Stats */}
        <div className={styles['stats-row']}>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>{totalEquipe}</span>
            <span className={styles['stat-label']}>Total</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>{totalProfissionais}</span>
            <span className={styles['stat-label']}>Profissionais</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>{totalGerentes}</span>
            <span className={styles['stat-label']}>Gerentes</span>
          </div>
        </div>

        {/* Grid de cards */}
        {funcionarios.length === 0 ? (
          <div className={styles['empty-state']}>
            <p>Nenhum membro cadastrado na equipe.</p>
            <Link to="/cadastro-funcionario" className={styles['btn-novo']}>
              + Cadastrar primeiro funcionário
            </Link>
          </div>
        ) : (
          <div className={styles['equipe-grid']}>
            {funcionarios.map((f, i) => (
              <div key={f.id} className={styles['member-card']}>
                <div className={styles['card-top']}>
                  <div className={`${styles['avatar-circle']} ${getAvatarClass(i)}`}>
                    {getInitials(f.nome)}
                  </div>
                  <div>
                    <div className={styles['card-name']}>{f.nome}</div>
                    <div className={styles['card-funcao']}>{f.funcao || 'Sem função definida'}</div>
                  </div>
                </div>

                <div className={styles['card-details']}>
                  {f.email && (
                    <div className={styles['detail-row']}>
                      <span className={styles['detail-icon']}>✉</span>
                      <span>{f.email}</span>
                    </div>
                  )}
                  {f.contato && (
                    <div className={styles['detail-row']}>
                      <span className={styles['detail-icon']}>📱</span>
                      <span>{f.contato}</span>
                    </div>
                  )}
                  {!f.email && !f.contato && (
                    <div className={styles['detail-row']}>
                      <span style={{ opacity: 0.5 }}>Sem dados de contato</span>
                    </div>
                  )}
                </div>

                <div className={styles['card-actions']}>
                  <button className={`${styles['btn-action']} ${styles['btn-editar']}`} onClick={() => abrirEdicao(f)}>
                    ✏️ Editar
                  </button>
                  <button className={`${styles['btn-action']} ${styles['btn-excluir']}`} onClick={() => excluirFuncionario(f.id, f.nome)}>
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de edição */}
        {editando && (
          <div className={styles['modal-overlay']} onClick={() => setEditando(null)}>
            <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
              <h2>Editar Funcionário</h2>

              <div className={styles['modal-field']}>
                <label>Nome completo</label>
                <input
                  type="text"
                  value={formEdit.nome}
                  onChange={e => setFormEdit({ ...formEdit, nome: e.target.value })}
                />
              </div>

              <div className={styles['modal-field']}>
                <label>Função / Profissão</label>
                <select
                  value={formEdit.funcao}
                  onChange={e => setFormEdit({ ...formEdit, funcao: e.target.value })}
                >
                  <option value="">Selecione</option>
                  <option value="Cabeleireiro(a)">Cabeleireiro(a)</option>
                  <option value="Maquiador(a)">Maquiador(a)</option>
                  <option value="Esteticista">Esteticista</option>
                  <option value="Manicure">Manicure</option>
                  <option value="Barbeiro(a)">Barbeiro(a)</option>
                  <option value="Designer de sobrancelhas">Designer de sobrancelhas</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Recepcionista">Recepcionista</option>
                </select>
              </div>

              <div className={styles['modal-field']}>
                <label>E-mail</label>
                <input
                  type="email"
                  value={formEdit.email}
                  onChange={e => setFormEdit({ ...formEdit, email: e.target.value })}
                />
              </div>

              <div className={styles['modal-field']}>
                <label>Telefone / WhatsApp</label>
                <input
                  type="tel"
                  value={formEdit.contato}
                  onChange={e => setFormEdit({ ...formEdit, contato: e.target.value })}
                />
              </div>

              <div className={styles['modal-buttons']}>
                <button className={styles['btn-salvar']} onClick={salvarEdicao}>
                  Salvar Alterações
                </button>
                <button className={styles['btn-cancelar']} onClick={() => setEditando(null)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
