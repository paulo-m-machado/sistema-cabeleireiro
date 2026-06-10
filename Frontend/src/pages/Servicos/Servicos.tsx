import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import styles from './Servicos.module.css';

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: string | number;
  duracao_estimada: number;
}

interface Kit {
  id: number;
  nome: string;
  descricao: string;
  preco: string | number;
  condicoes: string;
}

type ModalMode = 'servico' | 'kit' | null;

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

function duracaoParaTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

function formatPreco(value: string | number): string {
  const num = Number(value);
  return isNaN(num) ? '0.00' : num.toFixed(2);
}

export function Servicos() {
  const { isGerente } = useAuth();
  const navigate = useNavigate();

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracao_estimada: '',
    condicoes: '',
  });
  const [erroForm, setErroForm] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [servicosRes, kitsRes] = await Promise.all([
        api.get('/servicos'),
        api.get('/kits'),
      ]);
      setServicos(servicosRes.data);
      setKits(kitsRes.data);
    } catch (err) {
      setErro('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }

  function openModal(mode: ModalMode, item?: Servico | Kit) {
    setModalMode(mode);
    setErroForm('');

    if (item && mode === 'servico') {
      const s = item as Servico;
      setEditandoId(s.id);
      setFormData({
        nome: s.nome,
        descricao: s.descricao || '',
        preco: formatPreco(s.preco),
        duracao_estimada: formatDuracao(s.duracao_estimada),
        condicoes: '',
      });
    } else if (item && mode === 'kit') {
      const k = item as Kit;
      setEditandoId(k.id);
      setFormData({
        nome: k.nome,
        descricao: k.descricao || '',
        preco: formatPreco(k.preco),
        duracao_estimada: '',
        condicoes: k.condicoes || '',
      });
    } else {
      setEditandoId(null);
      setFormData({ nome: '', descricao: '', preco: '', duracao_estimada: '', condicoes: '' });
    }
  }

  function handleCloseModal() {
    setModalMode(null);
    setEditandoId(null);
    setFormData({ nome: '', descricao: '', preco: '', duracao_estimada: '', condicoes: '' });
    setErroForm('');
  }

  async function handleDeleteServico(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;
    try {
      await api.delete(`/servicos/${id}`);
      loadAll();
    } catch (err) {
      alert('Erro ao excluir serviço.');
    }
  }

  async function handleDeleteKit(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir este kit?')) return;
    try {
      await api.delete(`/kits/${id}`);
      loadAll();
    } catch (err) {
      alert('Erro ao excluir kit.');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroForm('');

    try {
      if (modalMode === 'servico') {
        const minutes = parseInt(formData.duracao_estimada, 10) || 0;
        const body = {
          nome: formData.nome,
          descricao: formData.descricao || undefined,
          preco: formData.preco ? Number(formData.preco) : undefined,
          duracao_estimada: duracaoParaTime(minutes),
        };
        if (editandoId) {
          await api.put(`/servicos/${editandoId}`, body);
        } else {
          await api.post('/servicos', body);
        }
      } else if (modalMode === 'kit') {
        const body = {
          nome: formData.nome,
          descricao: formData.descricao || undefined,
          preco: formData.preco ? Number(formData.preco) : undefined,
          condicoes: formData.condicoes || undefined,
        };
        if (editandoId) {
          await api.put(`/kits/${editandoId}`, body);
        } else {
          await api.post('/kits', body);
        }
      }
      handleCloseModal();
      loadAll();
    } catch (err: any) {
      setErroForm(err.response?.data?.error || 'Erro ao salvar.');
    }
  }

  function getCategoria(nome: string) {
    const n = nome.toLowerCase();
    if (n.includes('corte') || n.includes('escova') || n.includes('coloração') || n.includes('coloracao') || n.includes('hidratação') || n.includes('hidratacao')) return 'Cabelos';
    if (n.includes('limpeza') || n.includes('peeling') || n.includes('estética') || n.includes('estetica')) return 'Estética';
    if (n.includes('manicure') || n.includes('pedicure') || n.includes('unhas')) return 'Unhas';
    return 'Outros';
  }

  const servicosFiltrados = servicos.filter(s => {
    if (categoriaAtiva === 'todos') return true;
    return getCategoria(s.nome) === categoriaAtiva;
  });

  return (
    <div className={`${styles.body1} page-bg-image`}>
      <div className={styles['services-container']}>

        <section className="promos-section">
          <div className={styles['promos-header']}>
            <h2>Kits e Promoções</h2>
            {isGerente && (
              <button
                className={`${styles['filter-btn']} ${styles['btn-add']}`}
                onClick={() => openModal('kit')}
              >
                + Novo Kit
              </button>
            )}
          </div>
          <div className={styles['promos-grid']}>
            {kits.length === 0 && <p style={{ color: '#888' }}>Nenhum kit cadastrado.</p>}
            {kits.map(k => (
              <div key={k.id} className={styles['promo-card']}>
                <div className={styles['promo-title']}>{k.nome}</div>
                <div className={styles['promo-desc']}>{k.descricao}</div>
                <div className={styles['promo-price']}>R$ {formatPreco(k.preco)}</div>
                <div className={styles['promo-conditions']}>{k.condicoes}</div>
                {isGerente && (
                  <div className={styles['promo-admin-actions']}>
                    <button
                      className={styles['promo-btn-edit']}
                      title="Editar kit"
                      onClick={() => openModal('kit', k)}
                    >
                      ✏️
                    </button>
                    <button
                      className={styles['promo-btn-delete']}
                      title="Excluir kit"
                      onClick={() => handleDeleteKit(k.id)}
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="services-section">
          <div className={styles['services-header']}>
            <h2>Nossos Serviços</h2>
            <div className={styles['category-filters']}>
              {['todos', 'Cabelos', 'Estética', 'Unhas', 'Outros'].map(cat => (
                <button
                  key={cat}
                  className={`${styles['filter-btn']} ${categoriaAtiva === cat ? styles.active : ''}`}
                  onClick={() => setCategoriaAtiva(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
              {isGerente && (
                <button
                  className={`${styles['filter-btn']} ${styles['btn-add']}`}
                  onClick={() => openModal('servico')}
                >
                  + Novo Serviço
                </button>
              )}
            </div>
          </div>

          {loading && <p>Carregando...</p>}
          {erro && <p style={{ color: 'var(--danger)' }}>{erro}</p>}

          <div className={styles['services-grid']}>
            {servicosFiltrados.map(s => (
              <div key={s.id} className={styles['service-card']}>
                <div className={styles['service-title']}>{s.nome}</div>
                <div className={styles['service-desc']}>{s.descricao}</div>
                <div className={styles['service-meta']}>
                  <span className={styles['price-badge']}>R$ {formatPreco(s.preco)}</span>
                  <span className={styles['time-badge']}>{formatDuracao(s.duracao_estimada)} min</span>
                </div>
                <div className={styles['card-actions']}>
                  <button
                    className={styles['btn-agendar']}
                    onClick={() => navigate('/agendamento')}
                  >
                    Agendar
                  </button>
                  {isGerente && (
                    <div className={styles['admin-actions']}>
                      <button
                        className={styles['btn-edit']}
                        title="Editar serviço"
                        onClick={() => openModal('servico', s)}
                      >
                        ✏️
                      </button>
                      <button
                        className={styles['btn-delete']}
                        title="Excluir serviço"
                        onClick={() => handleDeleteServico(s.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {modalMode && (
        <div className={styles['modal-overlay']} onClick={handleCloseModal}>
          <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h2>
                {editandoId
                  ? `Editar ${modalMode === 'servico' ? 'Serviço' : 'Kit'}`
                  : `Novo ${modalMode === 'servico' ? 'Serviço' : 'Kit'}`}
              </h2>
              <button className={styles['close-modal']} onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles['form-group']}>
                <label>Nome</label>
                <input
                  type="text"
                  className={styles['form-input']}
                  placeholder={modalMode === 'servico' ? 'Ex: Corte Feminino' : 'Ex: Kit Transformação'}
                  required
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className={styles['form-group']}>
                <label>Descrição</label>
                <textarea
                  className={styles['form-textarea']}
                  placeholder={modalMode === 'servico' ? 'Descrição do serviço...' : 'Serviços incluídos no kit...'}
                  value={formData.descricao}
                  onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label>Preço (R$)</label>
                  <input
                    type="number"
                    className={styles['form-input']}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={formData.preco}
                    onChange={e => setFormData({ ...formData, preco: e.target.value })}
                  />
                </div>
                {modalMode === 'servico' ? (
                  <div className={styles['form-group']}>
                    <label>Duração (minutos)</label>
                    <input
                      type="number"
                      className={styles['form-input']}
                      placeholder="60"
                      min="0"
                      value={formData.duracao_estimada}
                      onChange={e => setFormData({ ...formData, duracao_estimada: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className={styles['form-group']}>
                    <label>Condições</label>
                    <input
                      type="text"
                      className={styles['form-input']}
                      placeholder="Ex: Válido até sexta-feira"
                      value={formData.condicoes}
                      onChange={e => setFormData({ ...formData, condicoes: e.target.value })}
                    />
                  </div>
                )}
              </div>
              {erroForm && <p style={{ color: 'red', marginTop: '10px' }}>{erroForm}</p>}
              <div className={styles['modal-footer']}>
                <button type="button" className={styles['btn-cancel']} onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className={styles['btn-save']}>{editandoId ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
